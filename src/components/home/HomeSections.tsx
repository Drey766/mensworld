"use client";

// =====================================================
// HOME PAGE SECTIONS (combined file for clarity)
// Each section is its own exported component.
// =====================================================

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Quote, Package, MessageCircle, Store } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/types";
import { PRODUCT_CATEGORIES } from "@/lib/utils";
import img1 from "@/../public/images/pexels-tima-miroshnichenko-6766361.jpg";

// ── MARQUEE BAR ──────────────────────────────────────
// Scrolling ticker strip between hero and categories.
// We duplicate the content so the loop looks seamless.
const MARQUEE_ITEMS = [
  "Turkish Suits",
  "Premium Shirts",
  "Quality Shoes",
  "Khaki Trousers",
  "Blazers",
  "Hoodies & Sweaters",
  "Nationwide Delivery",
  "Yala Towers, Nairobi",
];

export function MarqueeBar() {
  return (
    <div className="bg-brand-gold py-3 overflow-hidden whitespace-nowrap">
      {/*
       * We render the items TWICE (via [...arr, ...arr]) so the animation
       * loops seamlessly. When the first copy scrolls off-screen, the
       * second copy is already in view, making it look infinite.
       *
       * `animate-marquee` is defined in tailwind.config.ts
       */}
      <div className="inline-flex animate-marquee gap-10">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-10">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-black">
              {item}
            </span>
            <span className="text-brand-black/30 text-lg">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── CATEGORY GRID ─────────────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  suits: "🧥",
  shirts: "👔",
  shoes: "👟",
  trousers: "👖",
  sweaters: "🧣",
  "t-shirts": "👕",
  jackets: "🧤",
  accessories: "⌚",
};

export function CategoryGrid() {
  return (
    <section className="section-padding bg-brand-dark">
      <div className="container-site">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-tag">Browse by Category</p>
            <h2 className="section-title">Find Your Style</h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold-light transition-colors"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {/*
         * RESPONSIVE GRID
         * grid-cols-2: 2 columns on mobile (small cards)
         * sm:grid-cols-4: 4 columns on tablet
         * lg:grid-cols-8: 8 columns on large desktop (one per category)
         *
         * For 8 categories on desktop we use 4 cols to keep cards readable:
         */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              // `group` enables child hover effects
              className="group card card-hover p-5 text-center flex flex-col items-center gap-3"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                {CATEGORY_ICONS[cat.slug] ?? "👔"}
              </span>
              <div>
                <p className="text-sm font-medium text-brand-light group-hover:text-brand-gold transition-colors">
                  {cat.label}
                </p>
              </div>
              {/* Gold underline that grows on hover */}
              <div className="h-px w-0 bg-brand-gold group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FEATURED PRODUCTS ─────────────────────────────────
interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="section-padding bg-brand-black">
      <div className="container-site">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-tag">Handpicked for You</p>
            <h2 className="section-title">Best Sellers</h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold-light transition-colors"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>

        {products.length === 0 ? (
          // Placeholder grid while loading or when no products exist yet
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                {/* Skeleton loader — grey blocks that mimic the card layout */}
                <div className="aspect-[3/4] bg-brand-dark2" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-brand-dark2 rounded w-1/3" />
                  <div className="h-4 bg-brand-dark2 rounded w-full" />
                  <div className="h-4 bg-brand-dark2 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile "view all" link */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop" className="btn-outline">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── PROMO / BANNER SECTION ────────────────────────────
export function PromoSection() {
  return (
    <section className="section-padding bg-brand-dark">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Main promo */}
          <div className="relative overflow-hidden rounded-sm bg-brand-dark2 border border-brand-mid p-8 lg:p-12 flex flex-col justify-between min-h-[320px]">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div>
              <p className="section-tag mb-4">Limited Time</p>
              <h3 className="font-display text-3xl lg:text-4xl font-bold text-brand-white leading-tight mb-4">
                Combo Deals
                <br />
                <span className="italic text-brand-gold">Starting Ksh 4,300</span>
              </h3>
              <p className="text-brand-muted text-sm leading-relaxed mb-6 max-w-xs">
                Shirt + Trouser combos, Suit packages and more. Look sharp
                without breaking the bank.
              </p>
            </div>
            <Link href="/shop?tag=combo" className="btn-primary self-start">
              Shop Deals <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right: Two smaller feature cards */}
          <div className="flex flex-col gap-4">
            {/* Delivery card */}
            <div className="flex gap-5 items-center bg-brand-dark2 border border-brand-mid rounded-sm p-6">
              <div className="w-12 h-12 rounded-sm bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
                <Package size={20} className="text-brand-gold" />
              </div>
              <div>
                <h4 className="font-medium text-brand-light mb-1">Nationwide Delivery</h4>
                <p className="text-sm text-brand-muted">
                  We ship to all 47 counties. Order by 2PM for same-day dispatch.
                </p>
              </div>
            </div>

            {/* WhatsApp order card */}
            <div className="flex gap-5 items-center bg-brand-dark2 border border-brand-mid rounded-sm p-6">
              <div className="w-12 h-12 rounded-sm bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} className="text-green-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-brand-light mb-1">Order via WhatsApp</h4>
                <p className="text-sm text-brand-muted mb-3">
                  Chat directly with us to place your order: 0716 057 611
                </p>
                <a
                  href="https://wa.me/254716057611"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs font-medium px-4 py-2 rounded-sm transition-colors"
                >
                  Chat Now
                </a>
              </div>
            </div>

            {/* Walk-in card */}
            <div className="flex gap-5 items-center bg-brand-dark2 border border-brand-mid rounded-sm p-6">
              <div className="w-12 h-12 rounded-sm bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
                <Store size={20} className="text-brand-gold" />
              </div>
              <div>
                <h4 className="font-medium text-brand-light mb-1">Visit Our Store</h4>
                <p className="text-sm text-brand-muted">
                  Yala Towers, Shop 101, Biashara Street, Nairobi CBD.
                  Mon–Sat 8AM–8PM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 1,
    name: "James Mwangi",
    location: "Kisumu",
    rating: 5,
    text: "Ordered a Turkish suit for my wedding. The quality was outstanding and delivery arrived in Kisumu within 2 days. Will definitely order again!",
  },
  {
    id: 2,
    name: "Brian Kariuki",
    location: "Nairobi",
    rating: 5,
    text: "Best prices in Nairobi CBD for quality menswear. I've been a regular customer for over a year. The combo deals are unbeatable value.",
  },
  {
    id: 3,
    name: "David Otieno",
    location: "Mombasa",
    rating: 5,
    text: "Ordered via WhatsApp and my shoes arrived in Mombasa in perfect condition. Great communication throughout. Highly recommended!",
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-brand-black">
      <div className="container-site">
        <div className="text-center mb-12">
          <p className="section-tag justify-center">What Customers Say</p>
          <h2 className="section-title">Trusted by Gentlemen Across Kenya</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="card p-6 relative">
              {/* Quote icon */}
              <Quote size={28} className="text-brand-gold/20 absolute top-5 right-5" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-brand-gold fill-brand-gold" />
                ))}
              </div>

              <p className="text-sm text-brand-muted leading-relaxed mb-5 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-brand-gold">
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-light">{t.name}</p>
                  <p className="text-xs text-brand-muted">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── INSTAGRAM FEED TEASER ─────────────────────────────
// Shows a static grid with a "Follow us" CTA.
// Replace with real images once the shop is live.
export function InstagramFeed() {
  const placeholders = Array.from({ length: 6 });

  return (
    <section className="section-padding bg-brand-dark border-t border-brand-mid">
      <div className="container-site">
        <div className="text-center mb-8">
          <p className="section-tag justify-center">Follow Along</p>
          <h2 className="section-title mb-2">@mensworldkenya</h2>
          <p className="text-brand-muted text-sm">
            See our latest styles and customer looks on Instagram
          </p>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {placeholders.map((_, i) => (
            <a
              key={i}
              href="https://www.instagram.com/mensworldkenya"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square bg-brand-dark2 hover:opacity-80 transition-opacity overflow-hidden rounded-sm"
            >
              <Image
                src={img1}
                alt="Instagram post"
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </a>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://www.instagram.com/mensworldkenya"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
