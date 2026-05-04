// =====================================================
// CART PAGE — app/cart/page.tsx
// =====================================================
"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, getShippingFee } from "@/lib/utils";

export default function CartPage() {
  const { state, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={48} className="text-brand-muted mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-brand-white mb-2">Your cart is empty</h2>
          <p className="text-brand-muted mb-6">Discover our premium menswear collection</p>
          <Link href="/shop" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  const shippingFee = getShippingFee("Nairobi"); // Default until checkout address is set
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="bg-brand-dark border-b border-brand-mid py-8">
        <div className="container-site">
          <h1 className="font-display text-3xl font-bold text-brand-white">Your Cart ({itemCount} items)</h1>
        </div>
      </div>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div key={`${item.product.id}-${item.selected_size}-${item.selected_color}`} className="card p-4 flex gap-5">
                <div className="relative w-24 h-28 flex-shrink-0 rounded-sm overflow-hidden bg-brand-dark2">
                  <Image src={item.product.images[0] ?? "https://placehold.co/96x112/252525/C9A84C"} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-brand-light mb-1">{item.product.name}</h3>
                  <p className="text-xs text-brand-muted mb-3">{item.selected_size} · {item.selected_color}</p>
                  <p className="font-display text-lg font-bold text-brand-gold">{formatPrice(item.product.price)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-brand-mid rounded-sm overflow-hidden">
                      <button onClick={() => updateQuantity(item.product.id, item.selected_size, item.selected_color, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-brand-gold hover:bg-brand-dark2 transition-colors"><Minus size={12} /></button>
                      <span className="w-10 text-center text-sm font-medium text-brand-light">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.selected_size, item.selected_color, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-brand-gold hover:bg-brand-dark2 transition-colors"><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeItem(item.product.id, item.selected_size, item.selected_color)} className="text-brand-muted hover:text-red-400 transition-colors ml-auto"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="card p-6 h-fit space-y-4">
            <h2 className="font-display text-lg font-bold text-brand-white">Order Summary</h2>
            <div className="divider" />
            <div className="flex justify-between text-sm"><span className="text-brand-muted">Subtotal</span><span className="text-brand-light">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-brand-muted">Shipping (est.)</span><span className="text-brand-light">{formatPrice(shippingFee)}</span></div>
            <div className="divider" />
            <div className="flex justify-between">
              <span className="font-medium text-brand-light">Total</span>
              <span className="font-display text-xl font-bold text-brand-gold">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="btn-primary w-full text-center">
              Checkout <ArrowRight size={16} />
            </Link>
            <Link href="/shop" className="btn-ghost w-full text-center text-sm">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
