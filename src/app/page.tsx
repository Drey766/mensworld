// =====================================================
// HOME PAGE — app/page.tsx
// =====================================================
// This is a SERVER COMPONENT (no "use client" at the top).
// Server Components run on the server and fetch data BEFORE
// sending HTML to the browser. This means:
//   • Faster initial page load (data is already in the HTML)
//   • Better SEO (search engines see the content)
//   • No loading spinners for the initial content
//
// The child components that need interactivity (like the marquee
// animation or cart buttons) are Client Components.

import type { Metadata } from "next";
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

// Page-specific metadata (overrides the default in layout.tsx)
export const metadata: Metadata = {
  title: "Men's World Kenya | Premium Menswear in Nairobi",
  description:
    "Shop premium Turkish suits, shirts, shoes & more. Yala Towers, Nairobi CBD. Nationwide delivery across all 47 counties.",
};

// `revalidate` tells Next.js how often to re-fetch this page's data.
// 3600 seconds = 1 hour. After 1 hour, the next visitor triggers a re-build.
// This is called ISR (Incremental Static Regeneration) — the page is
// fast like a static site but still gets fresh data periodically.
export const revalidate = 3600;

// FETCH FEATURED PRODUCTS
// This runs on the server before the page renders.
async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("in_stock", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Error fetching featured products:", error.message);
    return [];
  }

  return data ?? [];
}

// THE PAGE COMPONENT
// `async` allows us to use `await` to fetch data before rendering.
export default async function HomePage() {
  // Fetch data on the server — no loading state needed!
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* Each section is its own component for maintainability */}
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
