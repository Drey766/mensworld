"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { state, removeItem, updateQuantity, closeCart, itemCount, subtotal } = useCart();

  return (
    <>
      {/* BACKDROP — darkens the page behind the drawer */}
      {state.isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={closeCart}
        />
      )}

      {/* DRAWER PANEL */}
      {/*
       * `translate-x-full` = hidden off-screen to the right
       * `translate-x-0` = slid into view
       * The transition animates between these two states
       */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-50
          w-full max-w-md
          bg-brand-dark border-l border-brand-mid
          flex flex-col
          transition-transform duration-300 ease-out
          ${state.isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-brand-mid">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-brand-gold" />
            <h2 className="font-display text-lg font-bold text-brand-white">
              Your Cart
            </h2>
            {itemCount > 0 && (
              <span className="bg-brand-gold text-brand-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="btn-ghost p-1.5" aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        {/* CART ITEMS — scrollable middle section */}
        <div className="flex-1 overflow-y-auto py-4">
          {state.items.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-brand-dark2 flex items-center justify-center">
                <ShoppingBag size={24} className="text-brand-muted" />
              </div>
              <div>
                <p className="font-medium text-brand-light mb-1">Your cart is empty</p>
                <p className="text-sm text-brand-muted">
                  Discover our premium menswear collection
                </p>
              </div>
              <Link href="/shop" onClick={closeCart} className="btn-primary mt-2">
                Shop Now
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-brand-mid">
              {state.items.map((item) => (
                <li
                  key={`${item.product.id}-${item.selected_size}-${item.selected_color}`}
                  className="flex gap-4 p-4 hover:bg-brand-dark2/50 transition-colors"
                >
                  {/* Product image thumbnail */}
                  <div className="relative w-20 h-24 flex-shrink-0 rounded-sm overflow-hidden bg-brand-dark2">
                    <Image
                      src={item.product.images[0] ?? "https://placehold.co/80x96/252525/C9A84C"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Item details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-light line-clamp-2 mb-1">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-brand-muted mb-2">
                      {item.selected_size} · {item.selected_color}
                    </p>
                    <p className="text-sm font-bold text-brand-gold">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selected_size,
                            item.selected_color,
                            item.quantity - 1
                          )
                        }
                        className="w-7 h-7 border border-brand-mid rounded-sm flex items-center justify-center text-brand-muted hover:border-brand-gold hover:text-brand-gold transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium text-brand-light w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selected_size,
                            item.selected_color,
                            item.quantity + 1
                          )
                        }
                        className="w-7 h-7 border border-brand-mid rounded-sm flex items-center justify-center text-brand-muted hover:border-brand-gold hover:text-brand-gold transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>

                      {/* Remove button */}
                      <button
                        onClick={() =>
                          removeItem(
                            item.product.id,
                            item.selected_size,
                            item.selected_color
                          )
                        }
                        className="ml-auto text-brand-muted hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* FOOTER — order summary + checkout */}
        {state.items.length > 0 && (
          <div className="border-t border-brand-mid p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-muted">Subtotal</span>
              <span className="font-display text-lg font-bold text-brand-gold">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-brand-muted">
              Shipping calculated at checkout based on your county.
            </p>

            {/* CTA buttons */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-outline w-full text-center"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
