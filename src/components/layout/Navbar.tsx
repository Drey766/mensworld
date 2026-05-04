"use client";

// =====================================================
// NAVBAR COMPONENT
// =====================================================
// The top navigation bar. It is a Client Component ("use client")
// because it needs interactivity — the mobile menu toggle, cart
// drawer opener, and auth state all require browser-side JavaScript.

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, Search, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import AuthModal from "@/components/ui/AuthModal";

// The nav links array — easy to add new pages without touching JSX
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname(); // Current URL path — used to highlight active link
  const { toggleCart, itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, profile, signOut } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Change navbar background when user scrolls down
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, []);

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      {/* Small bar above the main nav with a promo message */}
      <div className="bg-brand-gold text-brand-black text-center py-2 px-4 text-xs font-medium tracking-widest uppercase">
        🚚 Free delivery on orders over Ksh 10,000 — Nationwide
      </div>

      {/* ── MAIN NAVBAR ── */}
      {/*
       * `sticky top-0 z-50` — sticks to the top of the viewport while scrolling.
       * z-50 keeps it above all other content.
       *
       * The background transitions from transparent (on hero) to dark (after scroll).
       * `transition-all duration-300` animates this change smoothly.
       */}
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-brand-black/95 backdrop-blur-md border-b border-brand-mid shadow-lg shadow-black/50"
            : "bg-brand-black border-b border-brand-mid"
        )}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* ── LOGO ── */}
            <Link href="/" className="flex-shrink-0 group">
              {/*
               * `group` on the parent lets us style children on hover using
               * `group-hover:` prefix — e.g. `group-hover:text-brand-gold`
               */}
              <span className="font-display text-xl lg:text-2xl font-black tracking-tight">
                <span className="text-brand-gold group-hover:text-brand-gold-light transition-colors">
                  Men&apos;s
                </span>
                <span className="text-brand-white"> World</span>
              </span>
              <div className="text-[9px] tracking-[0.3em] uppercase text-brand-muted -mt-0.5">
                Kenya
              </div>
            </Link>

            {/* ── DESKTOP NAV LINKS ── */}
            {/* `hidden lg:flex` = hidden on small screens, flex on large screens */}
            <ul className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium tracking-wider uppercase transition-colors duration-200 relative pb-1",
                      "after:absolute after:bottom-0 after:left-0 after:h-px after:bg-brand-gold",
                      "after:transition-all after:duration-300",
                      // Active link: gold colour + underline
                      pathname === link.href
                        ? "text-brand-gold after:w-full"
                        : "text-brand-muted hover:text-brand-light after:w-0 hover:after:w-full"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* ── ICON ACTIONS (right side) ── */}
            <div className="flex items-center gap-1 lg:gap-2">

              {/* Search button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="btn-ghost p-2 rounded-sm"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="btn-ghost p-2 rounded-sm relative"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  // Badge — the red dot with a count
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-gold text-brand-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="btn-ghost p-2 rounded-sm relative"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-gold text-brand-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* Auth / User menu */}
              {user ? (
                // User is logged in — show avatar + dropdown
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 btn-ghost px-3 py-2 rounded-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center">
                      <User size={14} className="text-brand-gold" />
                    </div>
                    <span className="text-sm text-brand-light">
                      {profile?.full_name?.split(" ")[0] ?? "Account"}
                    </span>
                    <ChevronDown size={14} className="text-brand-muted" />
                  </button>

                  {/* Dropdown menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-brand-dark border border-brand-mid rounded-sm shadow-xl shadow-black/50 py-1 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-brand-mid">
                        <p className="text-sm font-medium text-brand-light">{profile?.full_name}</p>
                        <p className="text-xs text-brand-muted truncate">{user.email}</p>
                      </div>
                      <Link href="/account/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-muted hover:text-brand-light hover:bg-brand-dark2 transition-colors">
                        My Orders
                      </Link>
                      <Link href="/wishlist" className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-muted hover:text-brand-light hover:bg-brand-dark2 transition-colors">
                        Wishlist
                      </Link>
                      {profile?.role === "admin" && (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-gold hover:bg-brand-dark2 transition-colors">
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-brand-mid mt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-brand-muted hover:text-red-400 hover:bg-brand-dark2 transition-colors"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Not logged in — show Sign In button
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="hidden lg:flex btn-outline py-2 px-4 text-xs"
                >
                  Sign In
                </button>
              )}

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden btn-ghost p-2"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* ── SEARCH BAR (expands below nav) ── */}
          {searchOpen && (
            <div className="pb-4 animate-slideUp">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  type="text"
                  placeholder="Search suits, shirts, shoes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                  autoFocus
                  className="input pl-10"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── MOBILE MENU ── */}
        {/* `lg:hidden` = only shows on screens smaller than lg (1024px) */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-brand-mid bg-brand-dark animate-slideUp">
            <div className="container-site py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 text-sm font-medium tracking-wider uppercase rounded-sm transition-colors",
                    pathname === link.href
                      ? "text-brand-gold bg-brand-gold/10"
                      : "text-brand-muted hover:text-brand-light hover:bg-brand-dark2"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-brand-mid">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-brand-muted"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => { setAuthModalOpen(true); setMobileOpen(false); }}
                    className="w-full btn-primary mt-2"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal — rendered here so it can be triggered from any part of the nav */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Close user menu when clicking outside */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
}
