"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/shop/ProductCard";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const moveAllToCart = () => {
    items.forEach((item) => {
      addItem(item.product, item.product.sizes[0] ?? "One Size", item.product.colors[0] ?? "Default");
    });
    toast.success("All items moved to cart!");
  };

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="bg-brand-dark border-b border-brand-mid py-8">
        <div className="container-site flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="section-tag">Saved Items</p>
            <h1 className="font-display text-3xl font-bold text-brand-white">
              My Wishlist ({items.length})
            </h1>
          </div>
          {items.length > 0 && (
            <button onClick={moveAllToCart} className="btn-primary flex items-center gap-2">
              <ShoppingBag size={16} /> Move All to Cart
            </button>
          )}
        </div>
      </div>

      <div className="container-site py-10">
        {items.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={48} className="text-brand-muted mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-brand-white mb-2">No saved items</h2>
            <p className="text-brand-muted mb-6">Browse our collection and save items you love</p>
            <Link href="/shop" className="btn-primary">Browse Shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {items.map(({ product }) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
