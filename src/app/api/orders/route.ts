// app/api/orders/route.ts
// =====================================================
// ORDER API ROUTE
// =====================================================
// This runs on the SERVER (not in the browser).
// It handles POST /api/orders which:
//  1. Saves the order to Supabase
//  2. Initiates M-Pesa STK Push payment to customer
//  3. Sends WhatsApp notification to the shop owner

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ── M-PESA STK PUSH ──────────────────────────────────
async function initiateMpesaPayment(phone: string, amount: number, orderId: string) {
  const consumerKey = process.env.MPESA_CONSUMER_KEY!;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
  const shortCode = process.env.MPESA_BUSINESS_SHORT_CODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  const callbackUrl = process.env.MPESA_CALLBACK_URL!;

  // Step 1: Get OAuth token from Safaricom
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const tokenRes = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${credentials}` } }
  );
  const { access_token } = await tokenRes.json();

  // Step 2: Build the STK push password
  // Password = Base64(ShortCode + Passkey + Timestamp)
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");

  // Normalize phone: 0712345678 → 254712345678
  const normalizedPhone = phone.replace(/^0/, "254").replace(/\s/g, "");

  // Step 3: Send STK push request
  const stkRes = await fetch(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.ceil(amount), // M-Pesa requires whole numbers
        PartyA: normalizedPhone,
        PartyB: shortCode,
        PhoneNumber: normalizedPhone,
        CallBackURL: callbackUrl,
        AccountReference: `MWK-${orderId.slice(0, 8).toUpperCase()}`,
        TransactionDesc: "Men's World Kenya Order",
      }),
    }
  );

  return stkRes.json();
}

// ── WHATSAPP NOTIFICATION TO OWNER ───────────────────
async function notifyOwnerViaWhatsApp(order: {
  id: string;
  items: { product_name: string; quantity: number; size: string; price: number }[];
  total: number;
  shipping_address: { full_name: string; phone: string; county: string; town: string };
}) {
  const token = process.env.WHATSAPP_API_TOKEN!;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const ownerNumber = process.env.OWNER_WHATSAPP_NUMBER!;

  // Build a readable message for the owner
  const itemsList = order.items
    .map((i) => `• ${i.product_name} (${i.size}) x${i.quantity} — Ksh ${i.price.toLocaleString()}`)
    .join("\n");

  const message = `🛍️ *NEW ORDER — Men's World Kenya*
  
Order ID: ${order.id.slice(0, 8).toUpperCase()}
  
*Customer:*
Name: ${order.shipping_address.full_name}
Phone: ${order.shipping_address.phone}
Location: ${order.shipping_address.town}, ${order.shipping_address.county}

*Items:*
${itemsList}

*Total: Ksh ${order.total.toLocaleString()}*

Check your admin dashboard to update the order status.`;

  await fetch(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: ownerNumber,
        type: "text",
        text: { body: message },
      }),
    }
  );
}

// ── MAIN POST HANDLER ─────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      shipping_address,
      subtotal,
      shipping_fee,
      total,
      payment_method,
      mpesa_phone,
      user_id,
    } = body;

    // Basic validation
    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!shipping_address?.county) {
      return NextResponse.json({ error: "Shipping address required" }, { status: 400 });
    }

    const db = supabaseAdmin();

    // 1. Save order to database
    const { data: order, error: orderError } = await db
      .from("orders")
      .insert({
        user_id: user_id ?? null,
        items: items.map((item: { product: { id: string; name: string; images: string[]; price: number }; quantity: number; selected_size: string; selected_color: string }) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.images[0] ?? "",
          price: item.product.price,
          quantity: item.quantity,
          size: item.selected_size,
          color: item.selected_color,
        })),
        shipping_address,
        subtotal,
        shipping_fee,
        total,
        status: "pending",
        payment_method,
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    // 2. Initiate M-Pesa payment (non-blocking — don't fail if M-Pesa is unavailable)
    if (payment_method === "mpesa" && mpesa_phone) {
      try {
        await initiateMpesaPayment(mpesa_phone, total, order.id);
      } catch (mpesaErr) {
        console.error("M-Pesa error:", mpesaErr);
        // Order is still saved — payment can be retried
      }
    }

    // 3. Notify owner via WhatsApp (non-blocking)
    try {
      await notifyOwnerViaWhatsApp({
        id: order.id,
        items: order.items,
        total: order.total,
        shipping_address: order.shipping_address,
      });
    } catch (waErr) {
      console.error("WhatsApp notify error:", waErr);
    }

    return NextResponse.json({ order_id: order.id }, { status: 201 });

  } catch (error: unknown) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

// GET — fetch orders (admin only)
export async function GET(req: NextRequest) {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
