"use client";

// =====================================================
// HOME PAGE — app/page.tsx
// =====================================================
// Converted to a Client Component to avoid server-side
// fetch failures when environment variables aren't
// available during SSR (common in local development).
// Data is fetched in the browser using the same Supabase
// client that works everywhere else in the app.

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import HeroSection from "@/components/home/HeroSection";
import {
  MarqueeBar,
  CategoryGrid,
  FeaturedProducts,
  PromoSection,
  Testimonials,
  InstagramFeed,
} from "@/components/home/HomeSections";
import { Product } from "@/types";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch featured products client-side — same as admin/shop pages do
    supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .eq("in_stock", true)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching featured products:", error.message);
          return;
        }
        setFeaturedProducts(data ?? []);
      });
  }, []);

  return (
    <>
      <HeroSection />
      <MarqueeBar />
      <CategoryGrid />
      <FeaturedProducts products={featuredProducts} />
      <PromoSection />
      <Testimonials />
      <InstagramFeed />
    </>
  );
}
