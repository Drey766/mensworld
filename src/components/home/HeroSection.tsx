"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Small trust badge shown in the hero
const TrustBadge = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <div className="flex items-center gap-2 text-brand-muted">
    <Icon size={14} className="text-brand-gold flex-shrink-0" />
    <span className="text-xs">{text}</span>
  </div>
);

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-black">

      {/* BACKGROUND PATTERN — subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(#C9A84C 1px, transparent 1px),
            linear-gradient(90deg, #C9A84C 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* GOLD ACCENT — decorative right-side panel */}
      <div className="absolute right-0 top-0 bottom-0 w-[45%] bg-brand-dark hidden lg:block" />
      <div className="absolute right-[45%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-gold/30 to-transparent hidden lg:block" />

      <div className="container-site relative z-10 py-20 lg:py-0">
        {/*
         * TWO-COLUMN LAYOUT
         * `grid-cols-1` on mobile (stacked), `lg:grid-cols-2` on desktop (side-by-side)
         * `gap-12` adds space between the columns
         */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT COLUMN — text content */}
          <div className="animate-slideUp">
            {/* Eyebrow label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-brand-gold" />
              <span className="text-xs font-medium tracking-[0.3em] uppercase text-brand-gold">
                Nairobi&apos;s Finest Menswear
              </span>
            </div>

            {/* Main heading */}
            {/*
             * `clamp` in Tailwind: `text-5xl lg:text-7xl`
             * = 3rem on mobile, 4.5rem on desktop
             * `leading-[1.05]` = very tight line height for display text
             */}
            <h1 className="font-display text-5xl lg:text-7xl font-black leading-[1.05] text-brand-white mb-6">
              Dress Like a
              <br />
              <span className="italic text-brand-gold">Gentleman.</span>
              <br />
              <span className="text-brand-light font-normal text-4xl lg:text-5xl">
                Feel the Difference.
              </span>
            </h1>

            <p className="text-brand-muted leading-relaxed max-w-md mb-8 text-base lg:text-lg">
              Premium Turkish suits, tailored shirts, quality shoes and more —
              all at prices that make sense. Walk in at Yala Towers or order
              with delivery to all 47 counties.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/shop" className="btn-primary group">
                Shop the Collection
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link href="/shop?category=suits" className="btn-outline">
                View Suits
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5">
              <TrustBadge icon={Truck} text="Nationwide Delivery" />
              <TrustBadge icon={Shield} text="Quality Guaranteed" />
              <TrustBadge icon={Star} text="5-Star Rated" />
            </div>
          </div>

          {/* RIGHT COLUMN — hero image */}
          <div className="relative flex items-center justify-center">
            {/* Main product image */}
            <div className="relative w-full max-w-sm lg:max-w-md aspect-[3/4] rounded-sm overflow-hidden">
              <Image
                src="https://placehold.co/480x640/252525/C9A84C?text=Hero+Product"
                alt="Premium menswear from Men's World Kenya"
                fill
                className="object-cover"
                priority // `priority` loads this image immediately — it's above the fold
              />
              {/* Overlay gradient at bottom */}
              <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-brand-black/60 to-transparent" />
            </div>

            {/* Floating stat cards */}
            {/* Top-left badge */}
            <div className="absolute -left-4 lg:-left-10 top-12 bg-brand-dark border border-brand-mid rounded-sm px-4 py-3 shadow-xl animate-slideUp">
              <p className="text-2xl font-display font-black text-brand-gold">500+</p>
              <p className="text-xs text-brand-muted tracking-wider uppercase">Styles</p>
            </div>

            {/* Bottom-right badge */}
            <div className="absolute -right-4 lg:-right-10 bottom-16 bg-brand-dark border border-brand-mid rounded-sm px-4 py-3 shadow-xl animate-slideUp" style={{ animationDelay: "0.15s" }}>
              <p className="text-2xl font-display font-black text-brand-gold">47</p>
              <p className="text-xs text-brand-muted tracking-wider uppercase">Counties Served</p>
            </div>

            {/* "New Arrivals" pill */}
            <div className="absolute top-6 right-4 flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-sm px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <span className="text-xs font-medium text-brand-gold">New Arrivals In Store</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
