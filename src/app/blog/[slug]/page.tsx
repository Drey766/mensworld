"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Clock, Calendar, ArrowLeft, Share2, Heart, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BlogPost } from "@/types";
import toast from "react-hot-toast";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (!data) { setLoading(false); return; }
      setPost(data);

      // Fetch related posts from same category
      const { data: relatedData } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(3);

      setRelated(relatedData ?? []);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post?.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-brand-black">
      <div className="container-site py-16 animate-pulse space-y-6 max-w-4xl">
        <div className="h-4 bg-brand-dark2 rounded w-24" />
        <div className="h-10 bg-brand-dark2 rounded w-3/4" />
        <div className="h-4 bg-brand-dark2 rounded w-1/3" />
        <div className="aspect-video bg-brand-dark2 rounded-sm" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 bg-brand-dark2 rounded" />
        ))}
      </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center text-center p-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-brand-white mb-3">Post not found</h2>
        <p className="text-brand-muted mb-6">This article may have been removed or the link is incorrect.</p>
        <Link href="/blog" className="btn-primary">Back to Blog</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-black">

      {/* HERO IMAGE */}
      <div className="relative h-[50vh] min-h-[320px] bg-brand-dark2">
        <Image
          src={post.cover_image || "https://placehold.co/1200x600/252525/C9A84C?text=Men%27s+World+Kenya"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        {/* Dark gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-0 right-0">
          <div className="container-site">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-brand-light/80 hover:text-brand-gold transition-colors bg-brand-black/40 backdrop-blur-sm px-4 py-2 rounded-sm"
            >
              <ArrowLeft size={14} /> Back to Blog
            </Link>
          </div>
        </div>
      </div>

      {/* ARTICLE CONTENT */}
      <div className="container-site max-w-4xl py-10">

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="badge-gold">{post.category}</span>
          <span className="flex items-center gap-1.5 text-xs text-brand-muted">
            <Calendar size={12} />
            {new Date(post.created_at).toLocaleDateString("en-KE", {
              day: "numeric", month: "long", year: "numeric"
            })}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-brand-muted">
            <Clock size={12} /> {post.read_time} min read
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl lg:text-5xl font-black text-brand-white leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author + actions row */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 mb-8 border-b border-brand-mid">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center">
              <span className="text-sm font-bold text-brand-gold">
                {post.author_name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-brand-light">{post.author_name}</p>
              <p className="text-xs text-brand-muted">Men&apos;s World Kenya</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setLiked(!liked); if (!liked) toast.success("Added to favourites!"); }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-sm text-sm transition-all ${
                liked
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : "border-brand-mid text-brand-muted hover:border-brand-gold hover:text-brand-gold"
              }`}
            >
              <Heart size={14} fill={liked ? "currentColor" : "none"} />
              {liked ? "Liked" : "Like"}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-brand-mid text-brand-muted hover:border-brand-gold hover:text-brand-gold rounded-sm text-sm transition-all"
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* ARTICLE BODY */}
        {/* prose-article is our custom class defined below in globals.css */}
        <div
          className="prose-article"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap mt-10 pt-8 border-t border-brand-mid">
          <Tag size={14} className="text-brand-muted" />
          {["Men's Fashion", "Style Tips", "Kenya", post.category].map((tag, i) => (
            <span key={`${tag}-${i}`} className="text-xs px-3 py-1 bg-brand-dark2 border border-brand-mid rounded-sm text-brand-muted">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-10 bg-brand-dark border border-brand-gold/20 rounded-sm p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <p className="text-xs text-brand-gold tracking-widest uppercase mb-2">Shop the Look</p>
            <h3 className="font-display text-xl font-bold text-brand-white mb-2">
              Ready to upgrade your wardrobe?
            </h3>
            <p className="text-sm text-brand-muted">
              Visit Men&apos;s World Kenya at Yala Towers or order online with delivery to all 47 counties.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/shop" className="btn-primary">Shop Now</Link>
            <a
              href="https://wa.me/254716057611"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-brand-white mb-6">
              More from the Blog
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group card card-hover overflow-hidden"
                >
                  <div className="relative aspect-video bg-brand-dark2">
                    <Image
                      src={rel.cover_image || "https://placehold.co/400x225/252525/C9A84C?text=Blog"}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-brand-gold mb-1">{rel.category}</p>
                    <h4 className="text-sm font-medium text-brand-light group-hover:text-brand-gold transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-brand-muted mt-2 flex items-center gap-1">
                      <Clock size={10} /> {rel.read_time} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
