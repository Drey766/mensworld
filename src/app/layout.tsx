// =====================================================
// ROOT LAYOUT — app/layout.tsx
// =====================================================
// In Next.js App Router, layout.tsx is the persistent shell that wraps
// EVERY page. It only renders once and stays mounted as you navigate.
// This is where we put things that should always be visible:
//   • Fonts
//   • Global providers (Cart, Wishlist, Auth)
//   • Navbar and Footer
//   • Toast notifications

import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

// Context Providers
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";

// Layout Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { Toaster } from "react-hot-toast";

// ── GOOGLE FONTS ──
// Next.js downloads these at BUILD TIME and self-hosts them.
// This means no external request at runtime = faster + no privacy issues.
// `subsets: ["latin"]` only downloads the characters we need (not Cyrillic etc.)
// `variable` creates a CSS custom property we map in tailwind.config.ts
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "700", "900"],
  display: "swap", // Shows fallback font while loading = no invisible text
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

// ── SEO METADATA ──
// Next.js uses this to set <title>, <meta description>, and Open Graph tags.
// Open Graph = the preview card when you share a link on WhatsApp / Twitter.
export const metadata: Metadata = {
  title: {
    default: "Men's World Kenya | Premium Menswear in Nairobi",
    // `template` is used by individual pages: "Shop | Men's World Kenya"
    template: "%s | Men's World Kenya",
  },
  description:
    "Shop premium Turkish suits, shirts, shoes, trousers and more. Located at Yala Towers, Nairobi CBD. Nationwide delivery across all 47 counties.",
  keywords: [
    "menswear Kenya", "suits Nairobi", "Turkish suits", "men's clothing Kenya",
    "Yala Towers shop", "men's shoes Nairobi", "shirts Kenya",
  ],
  openGraph: {
    title: "Men's World Kenya | Premium Menswear",
    description: "Premium menswear at Yala Towers, Nairobi. Nationwide delivery.",
    type: "website",
    locale: "en_KE",
    siteName: "Men's World Kenya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Men's World Kenya",
    description: "Premium menswear. Nationwide delivery.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ── ROOT LAYOUT COMPONENT ──
// `children` = the current page being rendered (e.g. HomePage, ShopPage, etc.)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // These CSS variable classes make our custom fonts available
      // as Tailwind classes (font-display, font-body)
      className={`${playfairDisplay.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-brand-black">
        {/*
         * PROVIDER NESTING
         * ================
         * We nest providers from outermost to innermost.
         * Any component inside AuthProvider can call useAuth().
         * Any component inside CartProvider can call useCart().
         * etc.
         *
         * ORDER MATTERS: AuthProvider is outermost because Cart/Wishlist
         * might need to know the current user (e.g. to sync wishlist to DB).
         */}
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>

              {/* NAVBAR — shown on every page */}
              <Navbar />

              {/* CART DRAWER — slides in from the right when cart is opened */}
              <CartDrawer />

              {/*
               * MAIN CONTENT
               * `flex-1` makes the main area grow to fill available space,
               * pushing the footer to the bottom of the page even on short pages.
               */}
              <main className="flex-1">
                {children}
              </main>

              {/* FOOTER — shown on every page */}
              <Footer />

              {/*
               * TOAST NOTIFICATIONS
               * ====================
               * react-hot-toast shows non-intrusive pop-up messages
               * (e.g. "Added to cart!", "Order placed!")
               * Call toast("message") from any component.
               */}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "#252525",
                    color: "#E8E2D9",
                    border: "1px solid #3A3A3A",
                    borderRadius: "2px",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "14px",
                  },
                  success: {
                    iconTheme: { primary: "#C9A84C", secondary: "#0E0E0E" },
                  },
                }}
              />

            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
