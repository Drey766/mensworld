// =====================================================
// UTILITY / HELPER FUNCTIONS
// =====================================================
// Small reusable functions used across the project.
// Having them in one place means you fix a bug once
// and it's fixed everywhere.

import { clsx, type ClassValue } from "clsx";

// cn() — Class Name helper
// -------------------------
// Tailwind sometimes needs conditional classes:
//   className={isActive ? "bg-brand-gold text-black" : "bg-transparent text-white"}
//
// `cn()` makes this cleaner by accepting any mix of strings, arrays, and
// objects where the key is the class and value is a boolean:
//   cn("base-class", isActive && "text-gold", { "opacity-50": isDisabled })
//
// It also merges conflicting Tailwind classes correctly
// (e.g. `cn("p-4", "p-8")` → "p-8", keeping only the last one).
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// formatPrice() — Format numbers as Kenyan Shillings
// ---------------------------------------------------
// Usage: formatPrice(8500) → "Ksh 8,500"
// The `toLocaleString` method adds the comma separators automatically.
export function formatPrice(amount: number): string {
  return `Ksh ${amount.toLocaleString("en-KE")}`;
}

// calculateDiscount() — Get percentage saved
// ------------------------------------------
// Usage: calculateDiscount(8500, 12000) → 29 (percent)
export function calculateDiscount(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// slugify() — Convert a product name to a URL-safe slug
// -------------------------------------------------------
// Usage: slugify("Turkish Slim Suit") → "turkish-slim-suit"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-")     // Replace spaces with hyphens
    .replace(/-+/g, "-")      // Collapse multiple hyphens
    .trim();
}

// truncate() — Shorten long strings with "..."
// --------------------------------------------
// Usage: truncate("Very long product description...", 50)
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + "...";
}

// estimateReadTime() — Blog post read time
// -----------------------------------------
// Average adult reads ~200 words per minute
export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

// KENYA COUNTIES — for delivery address dropdowns
export const KENYA_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet",
  "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
  "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
  "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu",
  "Vihiga", "Wajir", "West Pokot",
] as const;

// PRODUCT CATEGORIES
export const PRODUCT_CATEGORIES = [
  { slug: "suits", label: "Suits & Blazers" },
  { slug: "shirts", label: "Shirts" },
  { slug: "shoes", label: "Shoes" },
  { slug: "trousers", label: "Trousers & Khakis" },
  { slug: "sweaters", label: "Sweaters" },
  { slug: "t-shirts", label: "T-Shirts" },
  { slug: "jackets", label: "Jackets & Hoodies" },
  { slug: "accessories", label: "Accessories" },
] as const;

// SHIPPING FEES by county type
export function getShippingFee(county: string): number {
  const nairobiCounties = ["Nairobi", "Kiambu", "Machakos", "Kajiado"];
  if (nairobiCounties.includes(county)) return 200;
  return 400; // Upcountry
}
