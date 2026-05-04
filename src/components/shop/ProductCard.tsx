"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, calculateDiscount, cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    // `stopPropagation` prevents the click from also triggering the Link navigation
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist ♥");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick-add uses first available size/color
    const size = product.sizes[0] ?? "One Size";
    const color = product.colors[0] ?? "Default";
    addItem(product, size, color);
    toast.success("Added to cart!");
  };

  const discount = product.original_price
    ? calculateDiscount(product.price, product.original_price)
    : null;

  return (
    /*
     * `group` on the card wrapper lets us use `group-hover:` on children.
     * So when you hover the card, the image zooms in and action buttons appear.
     */
    <Link href={`/shop/${product.slug}`} className={cn("card card-hover group block", className)}>

      {/* PRODUCT IMAGE */}
      <div className="relative overflow-hidden aspect-[3/4] bg-brand-dark2">
        <Image
          src={product.images[0] ?? "https://placehold.co/400x530/252525/C9A84C?text=No+Image"}
          alt={product.name}
          fill
          // `object-cover` fills the container, cropping if needed
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* BADGES — top-left corner */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_new && <span className="badge-new">New</span>}
          {discount && <span className="badge-sale">-{discount}%</span>}
          {!product.in_stock && (
            <span className="inline-block text-[10px] font-semibold tracking-[0.1em] uppercase bg-brand-mid text-brand-muted px-2 py-0.5 rounded-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* WISHLIST BUTTON — top-right */}
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center",
            "transition-all duration-200",
            // Always visible on mobile; fades in on hover on desktop
            "opacity-100 lg:opacity-0 group-hover:opacity-100",
            inWishlist
              ? "bg-brand-gold text-brand-black"
              : "bg-brand-black/60 text-brand-light hover:bg-brand-gold hover:text-brand-black"
          )}
        >
          <Heart size={14} fill={inWishlist ? "currentColor" : "none"} />
        </button>

        {/* ADD TO CART — slides up from bottom on hover */}
        {product.in_stock && (
          <button
            onClick={handleAddToCart}
            className={cn(
              "absolute bottom-0 left-0 right-0",
              "bg-brand-gold text-brand-black",
              "flex items-center justify-center gap-2",
              "py-3 text-xs font-semibold tracking-widest uppercase",
              // `translate-y-full` hides it below; `group-hover:translate-y-0` slides it up
              "translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            )}
          >
            <ShoppingBag size={14} />
            Quick Add
          </button>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="p-4">
        <p className="text-[10px] text-brand-muted tracking-[0.15em] uppercase mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-medium text-brand-light leading-snug mb-2 line-clamp-2">
          {/* `line-clamp-2` truncates text to 2 lines — prevents cards from varying in height */}
          {product.name}
        </h3>

        {/* RATING */}
        {product.review_count > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < Math.round(product.rating) ? "text-brand-gold fill-brand-gold" : "text-brand-mid"}
                />
              ))}
            </div>
            <span className="text-[10px] text-brand-muted">({product.review_count})</span>
          </div>
        )}

        {/* PRICE */}
        <div className="flex items-baseline gap-2">
          <span className="font-display text-base font-bold text-brand-gold">
            {formatPrice(product.price)}
          </span>
          {product.original_price && (
            <span className="text-xs text-brand-muted line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
