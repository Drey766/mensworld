"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, Search, X, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product, ProductFilters } from "@/types";
import { PRODUCT_CATEGORIES, cn } from "@/lib/utils";
import ProductCard from "@/components/shop/ProductCard";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "38", "40", "42", "44", "46"];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters driven by URL search params — so they're shareable and bookmarkable
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get("category") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    sort: (searchParams.get("sort") as ProductFilters["sort"]) ?? "newest",
    min_price: undefined,
    max_price: undefined,
    sizes: [],
  });

  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  // Fetch products whenever filters change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("products").select("*", { count: "exact" });

    if (filters.category) query = query.eq("category", filters.category);
    if (filters.search) query = query.ilike("name", `%${filters.search}%`);
    if (filters.min_price) query = query.gte("price", filters.min_price);
    if (filters.max_price) query = query.lte("price", filters.max_price);
    if (filters.sizes?.length) query = query.overlaps("sizes", filters.sizes);

    switch (filters.sort) {
      case "price_asc": query = query.order("price", { ascending: true }); break;
      case "price_desc": query = query.order("price", { ascending: false }); break;
      case "popular": query = query.order("review_count", { ascending: false }); break;
      default: query = query.order("created_at", { ascending: false });
    }

    const { data, count } = await query;
    setProducts(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key: keyof ProductFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ sort: "newest", sizes: [] });
    setSearchInput("");
    router.push("/shop");
  };

  const hasActiveFilters = !!(filters.category || filters.search || filters.min_price || filters.max_price || filters.sizes?.length);

  return (
    <div className="min-h-screen bg-brand-black">
      {/* PAGE HEADER */}
      <div className="bg-brand-dark border-b border-brand-mid py-10">
        <div className="container-site">
          <p className="section-tag">Our Collection</p>
          <h1 className="font-display text-4xl font-bold text-brand-white">
            {filters.category
              ? PRODUCT_CATEGORIES.find((c) => c.slug === filters.category)?.label ?? "Shop"
              : "All Products"}
          </h1>
          {total > 0 && (
            <p className="text-brand-muted text-sm mt-2">{total} products found</p>
          )}
        </div>
      </div>

      <div className="container-site py-8">
        {/* TOOLBAR */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateFilter("search", searchInput || undefined);
              }}
              className="input pl-9"
            />
          </div>

          {/* Sort dropdown */}
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

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn("btn-outline py-2.5 px-4 text-xs flex items-center gap-2", sidebarOpen && "bg-brand-gold text-brand-black border-brand-gold")}
          >
            <SlidersHorizontal size={14} /> Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-brand-gold" />}
          </button>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-red-400 transition-colors">
              <X size={14} /> Clear All
            </button>
          )}
        </div>

        <div className="flex gap-8">
          {/* SIDEBAR FILTERS */}
          <aside className={cn(
            "w-60 flex-shrink-0 space-y-6",
            "lg:block",
            sidebarOpen ? "block" : "hidden"
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
                      !filters.category ? "text-brand-gold bg-brand-gold/10" : "text-brand-muted hover:text-brand-light hover:bg-brand-dark2"
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
                        filters.category === cat.slug ? "text-brand-gold bg-brand-gold/10" : "text-brand-muted hover:text-brand-light hover:bg-brand-dark2"
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
                  onChange={(e) => updateFilter("min_price", e.target.value ? Number(e.target.value) : undefined)}
                  className="input text-sm py-2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.max_price ?? ""}
                  onChange={(e) => updateFilter("max_price", e.target.value ? Number(e.target.value) : undefined)}
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
                        updateFilter("sizes", isSelected ? current.filter((s) => s !== size) : [...current, size]);
                      }}
                      className={cn(
                        "w-10 h-10 text-xs rounded-sm border transition-all",
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
                <p className="font-display text-2xl text-brand-light mb-2">No products found</p>
                <p className="text-brand-muted text-sm mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
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
