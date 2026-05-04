// app/blog/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BlogPost } from "@/types";

export const revalidate = 3600;

async function getPosts(): Promise<BlogPost[]> {
  const { data } = await supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false });
  return data ?? [];
}

export default async function BlogPage() {
  const posts = await getPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="bg-brand-dark border-b border-brand-mid py-10">
        <div className="container-site">
          <p className="section-tag">Men&apos;s Style</p>
          <h1 className="font-display text-4xl font-bold text-brand-white">The Blog</h1>
          <p className="text-brand-muted mt-2">Style tips, fashion news & grooming advice</p>
        </div>
      </div>

      <div className="container-site py-12 space-y-12">
        {/* Featured post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-8 card card-hover overflow-hidden">
            <div className="relative aspect-video lg:aspect-auto lg:min-h-[320px] bg-brand-dark2">
              <Image src={featured.cover_image || "https://placehold.co/800x450/252525/C9A84C?text=Featured+Post"} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 lg:p-10 flex flex-col justify-center">
              <span className="badge-gold mb-4 self-start">{featured.category}</span>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-brand-white group-hover:text-brand-gold transition-colors mb-4">{featured.title}</h2>
              <p className="text-brand-muted leading-relaxed mb-6">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-brand-muted">
                <span className="flex items-center gap-1.5"><Calendar size={12} />{new Date(featured.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span className="flex items-center gap-1.5"><Clock size={12} />{featured.read_time} min read</span>
              </div>
            </div>
          </Link>
        )}

        {/* Post grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group card card-hover overflow-hidden">
                <div className="relative aspect-video bg-brand-dark2">
                  <Image src={post.cover_image || "https://placehold.co/600x340/252525/C9A84C?text=Blog"} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 badge-gold">{post.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-brand-white group-hover:text-brand-gold transition-colors mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-brand-muted line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-brand-muted">
                    <span className="flex items-center gap-1"><Clock size={11} />{post.read_time} min</span>
                    <span>{new Date(post.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-brand-light mb-2">No posts yet</p>
            <p className="text-brand-muted text-sm">Check back soon for style tips and news.</p>
          </div>
        )}
      </div>
    </div>
  );
}
