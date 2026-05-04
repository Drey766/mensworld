"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, FileText,
  Users, TrendingUp, Plus, Edit, Trash2, Eye,
  Loader2, LogOut, Search, Check, X
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, cn } from "@/lib/utils";
import { Product, Order, BlogPost } from "@/types";
import toast from "react-hot-toast";

type AdminTab = "overview" | "products" | "orders" | "blogs" | "users";

export default function AdminPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("overview");

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== "admin")) {
      router.replace("/");
    }
  }, [user, profile, authLoading, router]);

  if (authLoading || !profile) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-gold" />
      </div>
    );
  }

  if (profile.role !== "admin") return null;

  const NAV = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "blogs", label: "Blog Posts", icon: FileText },
    { id: "users", label: "Customers", icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-brand-black flex">
      {/* SIDEBAR */}
      <aside className="w-56 flex-shrink-0 bg-brand-dark border-r border-brand-mid flex flex-col">
        <div className="p-5 border-b border-brand-mid">
          <p className="font-display text-lg font-bold text-brand-gold">Men&apos;s World</p>
          <p className="text-xs text-brand-muted">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id as AdminTab)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors",
                tab === id
                  ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                  : "text-brand-muted hover:text-brand-light hover:bg-brand-dark2"
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-brand-mid">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-brand-muted hover:text-red-400 hover:bg-brand-dark2 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {tab === "overview" && <OverviewTab />}
          {tab === "products" && <ProductsTab />}
          {tab === "orders" && <OrdersTab />}
          {tab === "blogs" && <BlogsTab />}
          {tab === "users" && <UsersTab />}
        </div>
      </main>
    </div>
  );
}

// ── OVERVIEW TAB ──────────────────────────────────────
function OverviewTab() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, customers: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: products }, { count: orders }, { count: customers }, { data: orderData }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total").eq("payment_status", "paid"),
      ]);
      const revenue = (orderData ?? []).reduce((sum, o) => sum + (o.total ?? 0), 0);
      setStats({ products: products ?? 0, orders: orders ?? 0, revenue, customers: customers ?? 0 });
    };
    fetchStats();
  }, []);

  const STAT_CARDS = [
    { label: "Total Products", value: stats.products, icon: Package, color: "text-blue-400" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingCart, color: "text-green-400" },
    { label: "Total Revenue", value: formatPrice(stats.revenue), icon: TrendingUp, color: "text-brand-gold" },
    { label: "Customers", value: stats.customers, icon: Users, color: "text-purple-400" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-white mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-brand-muted uppercase tracking-wider">{label}</p>
              <Icon size={18} className={color} />
            </div>
            <p className="font-display text-2xl font-bold text-brand-white">{value}</p>
          </div>
        ))}
      </div>
      <RecentOrdersTable />
    </div>
  );
}

function RecentOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5).then(({ data }) => setOrders(data ?? []));
  }, []);

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-brand-mid">
        <h2 className="font-medium text-brand-white">Recent Orders</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-brand-mid text-brand-muted text-left">{["Order ID", "Customer", "Total", "Status", "Date"].map((h) => <th key={h} className="px-4 py-3 font-medium text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-brand-mid/50 hover:bg-brand-dark2/50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-brand-gold">{order.id.slice(0, 8)}…</td>
                <td className="px-4 py-3 text-brand-light">{order.shipping_address?.full_name ?? "—"}</td>
                <td className="px-4 py-3 text-brand-light">{formatPrice(order.total)}</td>
                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-4 py-3 text-brand-muted text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-brand-muted text-sm">No orders yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── PRODUCTS TAB ──────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    let q = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (search) q = q.ilike("name", `%${search}%`);
    const { data } = await q;
    setProducts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast.success("Product deleted");
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-brand-white">Products</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input pl-9" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-brand-mid text-brand-muted text-left">{["Product", "Category", "Price", "Stock", "Actions"].map((h) => <th key={h} className="px-4 py-3 font-medium text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-brand-dark2 rounded animate-pulse" /></td></tr>)
                : products.map((p) => (
                  <tr key={p.id} className="border-b border-brand-mid/50 hover:bg-brand-dark2/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-light">{p.name}</p>
                      <p className="text-xs text-brand-muted">{p.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-brand-muted capitalize">{p.category}</td>
                    <td className="px-4 py-3 text-brand-gold font-medium">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-1 rounded-sm font-medium", p.in_stock ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
                        {p.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(p); setShowForm(true); }} className="btn-ghost p-1.5 text-brand-muted hover:text-brand-gold"><Edit size={14} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="btn-ghost p-1.5 text-brand-muted hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && products.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-brand-muted text-sm">No products found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <ProductFormModal product={editing} onClose={() => setShowForm(false)} onSave={() => { setShowForm(false); fetchProducts(); }} />}
    </div>
  );
}

// Product add/edit modal
function ProductFormModal({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: () => void }) {
  const isEdit = !!product;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    original_price: product?.original_price ?? "",
    category: product?.category ?? "suits",
    sizes: product?.sizes?.join(", ") ?? "",
    colors: product?.colors?.join(", ") ?? "",
    in_stock: product?.in_stock ?? true,
    is_featured: product?.is_featured ?? false,
    is_new: product?.is_new ?? false,
  });

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      ...form,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      slug: form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    };
    if (isEdit) {
      await supabase.from("products").update(payload).eq("id", product!.id);
    } else {
      await supabase.from("products").insert({ ...payload, images: [], rating: 0, review_count: 0 });
    }
    toast.success(isEdit ? "Product updated!" : "Product added!");
    setLoading(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-brand-dark border border-brand-mid rounded-sm w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-brand-dark border-b border-brand-mid p-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand-white">{isEdit ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="btn-ghost p-1"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div><label className="label">Product Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Description</label><textarea className="input resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Price (Ksh)</label><input type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
            <div><label className="label">Original Price (optional)</label><input type="number" className="input" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} /></div>
          </div>
          <div><label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["suits","shirts","shoes","trousers","sweaters","t-shirts","jackets","accessories"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="label">Sizes (comma separated)</label><input className="input" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="S, M, L, XL" /></div>
          <div><label className="label">Colors (comma separated)</label><input className="input" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Black, Navy, Grey" /></div>
          <div className="flex gap-4 flex-wrap">
            {[
              { key: "in_stock", label: "In Stock" },
              { key: "is_featured", label: "Featured on Home" },
              { key: "is_new", label: "Show New Badge" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <div className={cn("w-4 h-4 rounded-sm border flex items-center justify-center transition-colors", form[key as keyof typeof form] ? "bg-brand-gold border-brand-gold" : "border-brand-mid")} onClick={() => setForm({ ...form, [key]: !form[key as keyof typeof form] })}>
                  {form[key as keyof typeof form] && <Check size={10} className="text-brand-black" />}
                </div>
                <span className="text-sm text-brand-muted">{label}</span>
              </label>
            ))}
          </div>
          <button onClick={handleSave} disabled={loading} className="btn-primary w-full">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : (isEdit ? "Save Changes" : "Add Product")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ORDERS TAB ────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setOrders(data ?? []);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: status as Order["status"] } : o));
    toast.success("Order status updated");
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-white mb-6">Orders</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-brand-mid text-brand-muted text-left">{["Order", "Customer", "Items", "Total", "Payment", "Status", "Actions"].map((h) => <th key={h} className="px-4 py-3 text-xs uppercase tracking-wider font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={7}><div className="h-10 bg-brand-dark2 animate-pulse m-2 rounded" /></td></tr>)
                : orders.map((order) => (
                  <tr key={order.id} className="border-b border-brand-mid/50 hover:bg-brand-dark2/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-brand-gold">{order.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3">
                      <p className="text-brand-light text-xs font-medium">{order.shipping_address?.full_name}</p>
                      <p className="text-brand-muted text-xs">{order.shipping_address?.county}</p>
                    </td>
                    <td className="px-4 py-3 text-brand-muted text-xs">{order.items?.length ?? 0} items</td>
                    <td className="px-4 py-3 text-brand-gold font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-1 rounded-sm font-medium", order.payment_status === "paid" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400")}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="bg-brand-dark2 border border-brand-mid text-brand-light text-xs rounded-sm px-2 py-1 cursor-pointer">
                        {["pending","confirmed","processing","shipped","delivered","cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button className="btn-ghost p-1.5 text-brand-muted hover:text-brand-gold"><Eye size={14} /></button>
                    </td>
                  </tr>
                ))}
              {!loading && orders.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-brand-muted">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── BLOGS TAB ─────────────────────────────────────────
function BlogsTab() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data ?? []);
  };

  useEffect(() => { fetchPosts(); }, []);

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("Post deleted");
    fetchPosts();
  };

  const togglePublished = async (id: string, published: boolean) => {
    await supabase.from("blog_posts").update({ published: !published }).eq("id", id);
    fetchPosts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-white">Blog Posts</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus size={16} /> New Post</button>
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="card p-4 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-brand-light truncate">{post.title}</p>
              <p className="text-xs text-brand-muted">{post.category} · {new Date(post.created_at).toLocaleDateString()}</p>
            </div>
            <span className={cn("text-xs px-2 py-1 rounded-sm", post.published ? "bg-green-500/10 text-green-400" : "bg-brand-mid text-brand-muted")}>
              {post.published ? "Published" : "Draft"}
            </span>
            <div className="flex gap-2">
              <button onClick={() => togglePublished(post.id, post.published)} className="btn-ghost p-1.5 text-brand-muted hover:text-brand-gold text-xs">{post.published ? "Unpublish" : "Publish"}</button>
              <button onClick={() => { setEditing(post); setShowForm(true); }} className="btn-ghost p-1.5 text-brand-muted hover:text-brand-gold"><Edit size={14} /></button>
              <button onClick={() => deletePost(post.id)} className="btn-ghost p-1.5 text-brand-muted hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <div className="text-center py-12 text-brand-muted">No blog posts yet</div>}
      </div>
      {showForm && <BlogFormModal post={editing} onClose={() => setShowForm(false)} onSave={() => { setShowForm(false); fetchPosts(); }} />}
    </div>
  );
}

function BlogFormModal({ post, onClose, onSave }: { post: BlogPost | null; onClose: () => void; onSave: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    category: post?.category ?? "Style Tips",
    author_name: post?.author_name ?? "Men's World Kenya",
    published: post?.published ?? false,
    cover_image: post?.cover_image ?? "",
    read_time: post?.read_time ?? 3,
  });

  const handleSave = async () => {
    setLoading(true);
    const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const payload = { ...form, slug };
    if (post) {
      await supabase.from("blog_posts").update(payload).eq("id", post.id);
    } else {
      await supabase.from("blog_posts").insert(payload);
    }
    toast.success(post ? "Post updated!" : "Post created!");
    setLoading(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-brand-dark border border-brand-mid rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-brand-dark border-b border-brand-mid p-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand-white">{post ? "Edit Post" : "New Blog Post"}</h2>
          <button onClick={onClose} className="btn-ghost p-1"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div><label className="label">Title</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label">Excerpt (shown in blog list)</label><textarea className="input resize-none" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
          <div><label className="label">Content (supports HTML)</label><textarea className="input resize-none" rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Category</label><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div><label className="label">Read Time (mins)</label><input type="number" className="input" value={form.read_time} onChange={(e) => setForm({ ...form, read_time: Number(e.target.value) })} /></div>
          </div>
          <div><label className="label">Cover Image URL</label><input className="input" value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} /></div>
          <label className="flex items-center gap-2 cursor-pointer">
            <div className={cn("w-4 h-4 rounded-sm border flex items-center justify-center transition-colors", form.published ? "bg-brand-gold border-brand-gold" : "border-brand-mid")} onClick={() => setForm({ ...form, published: !form.published })}>
              {form.published && <Check size={10} className="text-brand-black" />}
            </div>
            <span className="text-sm text-brand-muted">Publish immediately</span>
          </label>
          <button onClick={handleSave} disabled={loading} className="btn-primary w-full">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : (post ? "Save Changes" : "Create Post")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── USERS TAB ─────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState<{ id: string; full_name: string; email: string; role: string; created_at: string }[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("id, full_name, email, role, created_at").order("created_at", { ascending: false }).then(({ data }) => setUsers(data ?? []));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-white mb-6">Customers</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-brand-mid text-brand-muted text-left">{["Name", "Email", "Role", "Joined"].map((h) => <th key={h} className="px-4 py-3 text-xs uppercase tracking-wider font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-brand-mid/50 hover:bg-brand-dark2/50">
                <td className="px-4 py-3 text-brand-light font-medium">{u.full_name || "—"}</td>
                <td className="px-4 py-3 text-brand-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-xs px-2 py-1 rounded-sm font-medium", u.role === "admin" ? "bg-brand-gold/10 text-brand-gold" : "bg-brand-mid text-brand-muted")}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-brand-muted text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-brand-muted">No customers yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── HELPER ────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400",
    confirmed: "bg-blue-500/10 text-blue-400",
    processing: "bg-purple-500/10 text-purple-400",
    shipped: "bg-indigo-500/10 text-indigo-400",
    delivered: "bg-green-500/10 text-green-400",
    cancelled: "bg-red-500/10 text-red-400",
  };
  return <span className={cn("text-xs px-2 py-1 rounded-sm font-medium capitalize", colors[status] ?? "bg-brand-mid text-brand-muted")}>{status}</span>;
}
