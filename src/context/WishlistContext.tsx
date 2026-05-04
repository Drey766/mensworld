"use client";

// =====================================================
// WISHLIST CONTEXT
// =====================================================
// Follows the same pattern as CartContext but simpler —
// wishlist items don't need size/color/quantity selection.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product, WishlistItem } from "@/types";
import { supabase } from "@/lib/supabase";

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("mensworld_wishlist");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem("mensworld_wishlist");
      }
    }
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem("mensworld_wishlist", JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: Product) => {
    // Don't add duplicates
    if (items.some((item) => item.product.id === product.id)) return;
    setItems((prev) => [
      ...prev,
      { product, added_at: new Date().toISOString() },
    ]);
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const isInWishlist = (productId: string) =>
    items.some((item) => item.product.id === productId);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        itemCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be inside <WishlistProvider>");
  return context;
}
