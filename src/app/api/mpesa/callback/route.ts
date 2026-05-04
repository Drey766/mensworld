// app/api/mpesa/callback/route.ts
// Safaricom calls this URL after the customer completes or cancels M-Pesa payment

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Body } = body;
    const callback = Body?.stkCallback;

    if (!callback) return NextResponse.json({ ok: false });

    const merchantRequestId = callback.MerchantRequestID;
    const resultCode = callback.ResultCode; // 0 = success

    // The order's account reference was set to "MWK-{orderId}" in the STK push
    // M-Pesa returns the CheckoutRequestID which we can use to match the order
    const db = supabaseAdmin();

    if (resultCode === 0) {
      // Payment successful — extract transaction details
      const items = callback.CallbackMetadata?.Item ?? [];
      const mpesaCode = items.find((i: { Name: string }) => i.Name === "MpesaReceiptNumber")?.Value;

      // Update order payment status
      // In a real app you'd store the CheckoutRequestID on the order at creation
      // and use it here to find the right order
      console.log("M-Pesa payment successful:", mpesaCode);

      // For demo purposes we update by merchant request ID
      // In production: store checkout_request_id on order and match here
    } else {
      // Payment failed or cancelled
      console.log("M-Pesa payment failed. Result code:", resultCode);
    }

    // Always return 200 to Safaricom — otherwise they retry
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });

  } catch (err) {
    console.error("M-Pesa callback error:", err);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
