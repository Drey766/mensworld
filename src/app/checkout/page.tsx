"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, CheckCircle, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, getShippingFee, KENYA_COUNTIES } from "@/lib/utils";
import toast from "react-hot-toast";

type Step = "address" | "payment" | "confirm";

export default function CheckoutPage() {
  const { state, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [step, setStep] = useState<Step>("address");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [address, setAddress] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    county: "",
    town: "",
    street_address: "",
  });

  const [mpesaPhone, setMpesaPhone] = useState(profile?.phone ?? "");

  const shippingFee = address.county ? getShippingFee(address.county) : 0;
  const total = subtotal + shippingFee;

  // PLACE ORDER — calls our API route which:
  // 1. Saves the order to Supabase
  // 2. Sends M-Pesa STK Push to customer
  // 3. Sends WhatsApp notification to owner
  const placeOrder = async () => {
    if (!address.county || !address.town || !address.street_address) {
      toast.error("Please fill in all address fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items,
          shipping_address: address,
          subtotal,
          shipping_fee: shippingFee,
          total,
          payment_method: "mpesa",
          mpesa_phone: mpesaPhone,
          user_id: user?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Order failed");
      setOrderId(data.order_id);
      clearCart();
      setStep("confirm");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0 && step !== "confirm") {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-center p-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-white mb-4">Your cart is empty</h2>
          <Link href="/shop" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  // ORDER CONFIRMED STATE
  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-6">
        <div className="card max-w-md w-full p-8 text-center">
          <CheckCircle size={56} className="text-brand-gold mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-brand-white mb-2">Order Placed!</h2>
          <p className="text-brand-muted mb-2">Order ID: <span className="text-brand-gold font-mono">{orderId}</span></p>
          <p className="text-brand-muted text-sm mb-6 leading-relaxed">
            Check your phone for an M-Pesa payment prompt. Once confirmed, we&apos;ll
            process your order. A confirmation will be sent via WhatsApp.
          </p>
          <div className="space-y-3">
            <Link href="/account/orders" className="btn-primary w-full text-center">Track My Order</Link>
            <Link href="/shop" className="btn-ghost w-full text-center">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="bg-brand-dark border-b border-brand-mid py-8">
        <div className="container-site">
          <h1 className="font-display text-3xl font-bold text-brand-white">Checkout</h1>
          {/* Step indicator */}
          <div className="flex items-center gap-3 mt-4">
            {(["address", "payment"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === s || (s === "address" && step === "payment") ? "bg-brand-gold text-brand-black" : "bg-brand-mid text-brand-muted"}`}>
                  {i + 1}
                </div>
                <span className={`text-xs uppercase tracking-wider ${step === s ? "text-brand-gold" : "text-brand-muted"}`}>
                  {s === "address" ? "Delivery" : "Payment"}
                </span>
                {i < 1 && <div className="w-12 h-px bg-brand-mid" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === "address" && (
              <div className="card p-6 space-y-5">
                <h2 className="font-display text-lg font-bold text-brand-white">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label">Full Name</label><input className="input" value={address.full_name} onChange={(e) => setAddress({ ...address, full_name: e.target.value })} required /></div>
                  <div><label className="label">Phone</label><input className="input" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required /></div>
                </div>
                <div>
                  <label className="label">County</label>
                  <select className="input" value={address.county} onChange={(e) => setAddress({ ...address, county: e.target.value })} required>
                    <option value="">Select your county</option>
                    {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label">Town / Area</label><input className="input" value={address.town} onChange={(e) => setAddress({ ...address, town: e.target.value })} required /></div>
                  <div><label className="label">Street / Building</label><input className="input" value={address.street_address} onChange={(e) => setAddress({ ...address, street_address: e.target.value })} /></div>
                </div>
                <button onClick={() => { if (!address.county) { toast.error("Select a county"); return; } setStep("payment"); }} className="btn-primary w-full">Continue to Payment</button>
              </div>
            )}

            {step === "payment" && (
              <div className="card p-6 space-y-5">
                <h2 className="font-display text-lg font-bold text-brand-white">Payment</h2>
                <div className="border border-brand-gold/30 bg-brand-gold/5 rounded-sm p-4">
                  <p className="text-sm font-medium text-brand-gold mb-1">M-Pesa Payment (STK Push)</p>
                  <p className="text-xs text-brand-muted">Enter your M-Pesa phone number. You&apos;ll receive a payment prompt on your phone.</p>
                </div>
                <div>
                  <label className="label">M-Pesa Phone Number</label>
                  <input className="input" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} placeholder="0712 345 678" />
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-muted">
                  <Lock size={12} /> Payments are secure and encrypted
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep("address")} className="btn-ghost flex-1">← Back</button>
                  <button onClick={placeOrder} disabled={loading} className="btn-primary flex-1">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : `Pay ${formatPrice(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="card p-5 h-fit space-y-4">
            <h2 className="font-display text-base font-bold text-brand-white">Your Order</h2>
            <div className="divide-y divide-brand-mid">
              {state.items.map((item) => (
                <div key={`${item.product.id}-${item.selected_size}`} className="py-3 flex gap-3 items-start">
                  <div className="relative w-14 h-16 flex-shrink-0 rounded-sm overflow-hidden bg-brand-dark2">
                    <Image src={item.product.images[0] ?? "https://placehold.co/56x64/252525/C9A84C"} alt={item.product.name} fill className="object-cover" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-gold text-brand-black text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-brand-light line-clamp-2">{item.product.name}</p>
                    <p className="text-xs text-brand-muted">{item.selected_size} · {item.selected_color}</p>
                  </div>
                  <p className="text-xs font-bold text-brand-gold whitespace-nowrap">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-brand-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-brand-muted">Shipping</span><span>{shippingFee ? formatPrice(shippingFee) : "—"}</span></div>
              <div className="divider" />
              <div className="flex justify-between font-bold text-base">
                <span className="text-brand-light">Total</span>
                <span className="text-brand-gold">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
