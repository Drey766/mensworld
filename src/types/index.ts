// =====================================================
// GLOBAL TYPE DEFINITIONS
// =====================================================
// TypeScript types act like a "contract" — they tell us exactly
// what shape our data should have. If you try to use a Product
// without an `id`, TypeScript will show a red error immediately
// instead of it crashing at runtime. Think of types as labels
// that describe what's inside a variable.

// --- PRODUCT ---
export interface Product {
  id: string;
  name: string;
  slug: string;           // URL-friendly name e.g. "turkish-slim-suit"
  description: string;
  price: number;          // In Kenyan Shillings (KES)
  original_price?: number; // If set, product is "on sale"
  images: string[];       // Array of image URLs from Supabase Storage
  category: string;       // e.g. "suits", "shirts", "shoes"
  sizes: string[];        // e.g. ["S", "M", "L", "XL"] or ["38", "40", "42"]
  colors: string[];       // e.g. ["Black", "Navy", "Charcoal"]
  in_stock: boolean;
  is_featured: boolean;   // Show on homepage
  is_new: boolean;        // Show "NEW" badge
  rating: number;         // Average 1–5
  review_count: number;
  created_at: string;
  updated_at: string;
}

// --- CART ITEM ---
// A product that's been added to the cart with size/color/quantity selected
export interface CartItem {
  product: Product;
  quantity: number;
  selected_size: string;
  selected_color: string;
}

// --- WISHLIST ITEM ---
export interface WishlistItem {
  product: Product;
  added_at: string;
}

// --- USER / AUTH ---
export interface UserProfile {
  id: string;             // Matches Supabase auth.users id
  email: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  role: "customer" | "admin"; // Admin gets access to the dashboard
  created_at: string;
}

// --- ADDRESS ---
export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  county: string;         // Kenya has 47 counties
  town: string;
  street_address: string;
  is_default: boolean;
}

// --- ORDER ---
export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  shipping_address: Address;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: OrderStatus;
  payment_method: "mpesa" | "card" | "cash_on_delivery";
  payment_status: "pending" | "paid" | "failed";
  mpesa_transaction_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;   // Snapshot — in case product is deleted later
  product_image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export type OrderStatus =
  | "pending"      // Just placed, awaiting payment
  | "confirmed"    // Payment received
  | "processing"   // Being packed
  | "shipped"      // In transit
  | "delivered"    // Customer received
  | "cancelled";

// --- BLOG POST ---
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;        // Short summary shown on the blog list page
  content: string;        // Full markdown/HTML content
  cover_image: string;
  category: string;       // e.g. "Style Tips", "Fashion News"
  author_name: string;
  author_avatar?: string;
  published: boolean;
  read_time: number;      // Estimated minutes to read
  created_at: string;
  updated_at: string;
}

// --- REVIEW ---
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;         // 1–5
  comment: string;
  verified_purchase: boolean;
  created_at: string;
}

// --- API RESPONSE WRAPPER ---
// A generic type <T> means "whatever type you pass in goes here".
// ApiResponse<Product> = { data: Product | null, error: string | null }
// ApiResponse<Product[]> = { data: Product[] | null, error: string | null }
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// --- FILTERS (Shop page) ---
export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  sizes?: string[];
  colors?: string[];
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  search?: string;
}
