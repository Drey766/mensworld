"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { Star, Heart, ShoppingBag, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from("products").select("*").eq("slug", slug).single();
      if (!data) { setLoading(false); return; }
      setProduct(data);
      setSelectedSize(data.sizes[0] ?? "");
      setSelectedColor(data.colors[0] ?? "");
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) return (
    <div className="container-site py-16 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-brand-dark2 rounded-sm" />
        <div className="space-y-4">
          <div className="h-8 bg-brand-dark2 rounded w-3/4" />
          <div className="h-6 bg-brand-dark2 rounded w-1/3" />
          <div className="h-24 bg-brand-dark2 rounded" />
        </div>
      </div>
    </div>
  );

  if (!product) return notFound();

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    if (!selectedColor) { toast.error("Please select a color"); return; }
    addItem(product, selectedSize, selectedColor, quantity);
    toast.success("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="container-site py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* IMAGE GALLERY */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-brand-dark2 rounded-sm overflow-hidden">
              <Image
                src={product.images[selectedImage] ?? "https://placehold.co/600x600/252525/C9A84C"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.images.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage((i) => Math.max(0, i - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-black/60 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-black transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setSelectedImage((i) => Math.min(product.images.length - 1, i + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-black/60 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-black transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={cn("w-20 h-20 rounded-sm overflow-hidden border-2 transition-all", selectedImage === i ? "border-brand-gold" : "border-brand-mid hover:border-brand-muted")}>
                    <Image src={img} alt="" width={80} height={80} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-brand-muted tracking-[0.2em] uppercase mb-2">{product.category}</p>
              <h1 className="font-display text-3xl font-bold text-brand-white mb-4">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < Math.round(product.rating) ? "text-brand-gold fill-brand-gold" : "text-brand-mid"} />
                  ))}
                </div>
                <span className="text-sm text-brand-muted">({product.review_count} reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-black text-brand-gold">{formatPrice(product.price)}</span>
              {product.original_price && (
                <span className="text-lg text-brand-muted line-through">{formatPrice(product.original_price)}</span>
              )}
            </div>

            <p className="text-brand-muted leading-relaxed">{product.description}</p>

            {/* Size selector */}
            <div>
              <p className="label mb-3">Size <span className="text-brand-gold normal-case tracking-normal font-normal text-xs">— <a href="#" className="underline">Size Guide</a></span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={cn("px-4 py-2 text-sm border rounded-sm transition-all", selectedSize === size ? "border-brand-gold bg-brand-gold text-brand-black font-bold" : "border-brand-mid text-brand-muted hover:border-brand-gold hover:text-brand-gold")}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color selector */}
            {product.colors.length > 1 && (
              <div>
                <p className="label mb-3">Color: <span className="text-brand-light normal-case tracking-normal font-medium">{selectedColor}</span></p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={cn("px-4 py-2 text-sm border rounded-sm transition-all", selectedColor === color ? "border-brand-gold bg-brand-gold/10 text-brand-gold" : "border-brand-mid text-brand-muted hover:border-brand-gold")}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex gap-3">
              <div className="flex border border-brand-mid rounded-sm overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 flex items-center justify-center text-brand-muted hover:text-brand-gold hover:bg-brand-dark2 transition-colors">-</button>
                <span className="w-12 flex items-center justify-center text-brand-light font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 flex items-center justify-center text-brand-muted hover:text-brand-gold hover:bg-brand-dark2 transition-colors">+</button>
              </div>
              <button onClick={handleAddToCart} disabled={!product.in_stock} className="btn-primary flex-1">
                <ShoppingBag size={16} />
                {product.in_stock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button onClick={() => { inWishlist ? removeFromWishlist(product.id) : addToWishlist(product); }} className={cn("w-12 border rounded-sm flex items-center justify-center transition-all", inWishlist ? "border-brand-gold bg-brand-gold/10 text-brand-gold" : "border-brand-mid text-brand-muted hover:border-brand-gold hover:text-brand-gold")}>
                <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Trust features */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-brand-mid">
              {[{ icon: Truck, label: "Nationwide Delivery" }, { icon: Shield, label: "Quality Guaranteed" }, { icon: RotateCcw, label: "Easy Returns" }].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center">
                  <Icon size={18} className="text-brand-gold mx-auto mb-1.5" />
                  <p className="text-xs text-brand-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
