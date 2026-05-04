"use client"

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-brand-black border-t border-brand-mid">
      {/* ── NEWSLETTER BANNER ── */}
      <div className="bg-brand-dark border-b border-brand-mid">
        <div className="container-site py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-bold text-brand-white">
                Stay in Style
              </h3>
              <p className="text-sm text-brand-muted mt-1">
                New arrivals, exclusive deals & style tips — straight to your inbox.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full md:w-auto gap-2"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="input flex-1 md:w-64"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER GRID ── */}
      <div className="container-site py-16">
        {/*
         * RESPONSIVE GRID
         * `grid-cols-1` = 1 column on mobile
         * `md:grid-cols-2` = 2 columns on tablets
         * `lg:grid-cols-4` = 4 columns on desktop
         */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-black">
                <span className="text-brand-gold">Men&apos;s</span>
                <span className="text-brand-white"> World</span>
              </span>
              <div className="text-[9px] tracking-[0.3em] uppercase text-brand-muted">Kenya</div>
            </Link>
            <p className="text-sm text-brand-muted leading-relaxed mb-6">
              Nairobi&apos;s destination for premium menswear. Quality Turkish suits,
              shirts, shoes and more — at prices every gentleman can afford.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/mensworldkenya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-brand-mid rounded-sm flex items-center justify-center text-brand-muted hover:border-brand-gold hover:text-brand-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 border border-brand-mid rounded-sm flex items-center justify-center text-brand-muted hover:border-brand-gold hover:text-brand-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/254716057611"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-brand-mid rounded-sm flex items-center justify-center text-brand-muted hover:border-green-500 hover:text-green-500 transition-colors"
                aria-label="WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop links */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-light mb-5">
              Shop
            </h4>
            <ul className="space-y-3">
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="text-sm text-brand-muted hover:text-brand-gold transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Information links */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-light mb-5">
              Information
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/blog", label: "Style Blog" },
                { href: "/contact", label: "Contact Us" },
                { href: "/about", label: "About Us" },
                { href: "/delivery", label: "Delivery Info" },
                { href: "/returns", label: "Returns Policy" },
                { href: "/size-guide", label: "Size Guide" },
                { href: "/faq", label: "FAQs" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-muted hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-light mb-5">
              Find Us
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={15} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <span className="text-sm text-brand-muted leading-relaxed">
                  Yala Towers, 1st Floor, Shop 101<br />
                  Biashara Street, Nairobi CBD
                </span>
              </li>
              <li className="flex gap-3">
                <Phone size={15} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <div className="text-sm text-brand-muted space-y-1">
                  <a href="tel:+254716057611" className="block hover:text-brand-gold transition-colors">
                    0716 057 611
                  </a>
                  <a href="tel:+254736557611" className="block hover:text-brand-gold transition-colors">
                    0736 557 611
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail size={15} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:orders@mensworldkenya.com"
                  className="text-sm text-brand-muted hover:text-brand-gold transition-colors"
                >
                  orders@mensworldkenya.com
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={15} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <div className="text-sm text-brand-muted space-y-1">
                  <span className="block">Mon–Sat: 8:00 AM – 8:00 PM</span>
                  <span className="block">Sunday: 10:00 AM – 6:00 PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-brand-mid">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-muted">
            © {new Date().getFullYear()} Men&apos;s World Kenya. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-brand-muted hover:text-brand-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-brand-muted hover:text-brand-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
