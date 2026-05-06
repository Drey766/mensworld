"use client";

// =====================================================
// SHOP PAGE
// =====================================================
// useSearchParams() reads URL query params like ?category=suits
// In Next.js App Router, any component using useSearchParams()
// MUST be wrapped in a <Suspense> boundary. Without it, the
// production build fails because Next.js tries to pre-render
// the page on the server where URL params don't exist yet.
//
// The fix: split into two components:
//   1. ShopPage (default export) — just renders the Suspense wrapper
//   2. ShopContent — the actual shop UI that uses useSearchParams

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, Search, X, ChevronDown, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product, ProductFilters } from "@/types";
import { PRODUCT_CATEGORIES, cn } from "@/lib/utils";
import ProductCard from "@/components/shop/ProductCard";

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest First" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular",    label: "Most Popular" },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

// ── LOADING SKELETON ──────────────────────────────────
function ShopSkeleton() {
  return (
    <div className="min-h-screen bg-brand-black">
      <div className="bg-brand-dark border-b border-brand-mid py-10">
        <div className="container-site">
          <div className="h-4 bg-brand-dark2 rounded w-32 mb-2 animate-pulse" />
          <div className="h-10 bg-brand-dark2 rounded w-48 animate-pulse" />
        </div>
      </div>
      <div className="container-site py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[3/4] bg-brand-dark2" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-brand-dark2 rounded w-1/3" />
                <div className="h-4 bg-brand-dark2 rounded" />
                <div className="h-4 bg-brand-dark2 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN SHOP CONTENT ────────────────────────────────
// This component is safe to use useSearchParams() in because
// it's always rendered inside a <Suspense> boundary below.
function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState<ProductFilters>({
    category:  searchParams.get("category") ?? undefined,
    search:    searchParams.get("search")   ?? undefined,
    sort:     (searchParams.get("sort") as ProductFilters["sort"]) ?? "newest",
    min_price: undefined,
    max_price: undefined,
    sizes:     [],
  });

  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("products").select("*", { count: "exact" });

    if (filters.category)       query = query.eq("category", filters.category);
    if (filters.search)         query = query.ilike("name", `%${filters.search}%`);
    if (filters.min_price)      query = query.gte("price", filters.min_price);
    if (filters.max_price)      query = query.lte("price", filters.max_price);
    if (filters.sizes?.length)  query = query.overlaps("sizes", filters.sizes);

    switch (filters.sort) {
      case "price_asc":  query = query.order("price",        { ascending: true  }); break;
      case "price_desc": query = query.order("price",        { ascending: false }); break;
      case "popular":    query = query.order("review_count", { ascending: false }); break;
      default:           query = query.order("created_at",   { ascending: false });
    }

    const { data, count } = await query;
    setProducts(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key: keyof ProductFilters, value: unknown) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => {
    setFilters({ sort: "newest", sizes: [] });
    setSearchInput("");
    router.push("/shop");
  };

  const hasActiveFilters = !!(
    filters.category  ||
    filters.search    ||
    filters.min_price ||
    filters.max_price ||
    filters.sizes?.length
  );

  const categoryLabel = filters.category
    ? PRODUCT_CATEGORIES.find((c) => c.slug === filters.category)?.label
    : null;

  return (
    <div className="min-h-screen bg-brand-black">

      {/* PAGE HEADER */}
      <div className="bg-brand-dark border-b border-brand-mid py-10">
        <div className="container-site">
          <p className="section-tag">Our Collection</p>
          <h1 className="font-display text-4xl font-bold text-brand-white">
            {categoryLabel ?? "All Products"}
          </h1>
          {!loading && (
            <p className="text-brand-muted text-sm mt-2">{total} products found</p>
          )}
        </div>
      </div>

      <div className="container-site py-8">

        {/* TOOLBAR */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">

          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  updateFilter("search", searchInput.trim() || undefined);
              }}
              className="input pl-9"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="input appearance-none pr-8 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              "btn-outline py-2.5 px-4 text-xs flex items-center gap-2",
              sidebarOpen && "bg-brand-gold text-brand-black border-brand-gold"
            )}
          >
            <SlidersHorizontal size={14} />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-gold" />
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-red-400 transition-colors"
            >
              <X size={14} /> Clear All
            </button>
          )}
        </div>

        <div className="flex gap-8">

          {/* FILTER SIDEBAR */}
          <aside className={cn(
            "w-56 flex-shrink-0 space-y-6",
            sidebarOpen ? "block" : "hidden lg:block"
          )}>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-light mb-3">
                Category
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => updateFilter("category", undefined)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-sm transition-colors",
                      !filters.category
                        ? "text-brand-gold bg-brand-gold/10"
                        : "text-brand-muted hover:text-brand-light hover:bg-brand-dark2"
                    )}
                  >
                    All Products
                  </button>
                </li>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      onClick={() => updateFilter("category", cat.slug)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-sm transition-colors",
                        filters.category === cat.slug
                          ? "text-brand-gold bg-brand-gold/10"
                          : "text-brand-muted hover:text-brand-light hover:bg-brand-dark2"
                      )}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-light mb-3">
                Price Range (Ksh)
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.min_price ?? ""}
                  onChange={(e) =>
                    updateFilter("min_price", e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="input text-sm py-2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.max_price ?? ""}
                  onChange={(e) =>
                    updateFilter("max_price", e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="input text-sm py-2"
                />
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-light mb-3">
                Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {SIZE_OPTIONS.map((size) => {
                  const isSelected = filters.sizes?.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        const current = filters.sizes ?? [];
                        updateFilter(
                          "sizes",
                          isSelected
                            ? current.filter((s) => s !== size)
                            : [...current, size]
                        );
                      }}
                      className={cn(
                        "min-w-[40px] px-2 h-9 text-xs rounded-sm border transition-all",
                        isSelected
                          ? "border-brand-gold bg-brand-gold text-brand-black font-bold"
                          : "border-brand-mid text-brand-muted hover:border-brand-gold hover:text-brand-gold"
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="aspect-[3/4] bg-brand-dark2" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-brand-dark2 rounded w-1/3" />
                      <div className="h-4 bg-brand-dark2 rounded" />
                      <div className="h-4 bg-brand-dark2 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <Package size={40} className="text-brand-muted mx-auto mb-3" />
                <p className="font-display text-2xl text-brand-light mb-2">No products found</p>
                <p className="text-brand-muted text-sm mb-6">Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DEFAULT EXPORT — wraps ShopContent in Suspense ────
// This is the fix for the build error:
// "useSearchParams() should be wrapped in a suspense boundary"
//
// Suspense lets Next.js render the ShopSkeleton immediately
// during SSR/static generation, then swap in ShopContent
// once the client-side JS loads and URL params are available.
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}
