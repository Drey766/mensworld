-- =====================================================
-- MEN'S WORLD KENYA — SUPABASE DATABASE SCHEMA
-- =====================================================
-- Run this entire file in your Supabase project:
--   Dashboard → SQL Editor → New Query → Paste → Run
--
-- This creates all the tables the app needs:
--   • profiles   (extended user info)
--   • products   (the shop inventory)
--   • orders     (customer orders)
--   • order_items (line items per order)
--   • blog_posts  (the blog)
--   • reviews    (product reviews)
--   • newsletter_subscribers

-- ── PROFILES ─────────────────────────────────────────
-- Extends Supabase's built-in auth.users table with extra fields.
-- A trigger below auto-creates a profile when a user signs up.
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT DEFAULT '',
  phone       TEXT DEFAULT '',
  avatar_url  TEXT,
  role        TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create a profile row when a new user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── PRODUCTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  slug           TEXT UNIQUE NOT NULL,
  description    TEXT DEFAULT '',
  price          INTEGER NOT NULL,          -- In Kenya Shillings (Ksh)
  original_price INTEGER,                   -- Set this to show a sale price
  images         TEXT[] DEFAULT '{}',       -- Array of image URLs
  category       TEXT NOT NULL,
  sizes          TEXT[] DEFAULT '{}',
  colors         TEXT[] DEFAULT '{}',
  in_stock       BOOLEAN DEFAULT TRUE,
  is_featured    BOOLEAN DEFAULT FALSE,     -- Show on homepage
  is_new         BOOLEAN DEFAULT FALSE,     -- Show "NEW" badge
  rating         NUMERIC(3,2) DEFAULT 0,
  review_count   INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── ORDERS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  items                  JSONB NOT NULL DEFAULT '[]',   -- Snapshot of cart items
  shipping_address       JSONB NOT NULL DEFAULT '{}',
  subtotal               INTEGER NOT NULL,
  shipping_fee           INTEGER DEFAULT 0,
  total                  INTEGER NOT NULL,
  status                 TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
  payment_method         TEXT DEFAULT 'mpesa',
  payment_status         TEXT DEFAULT 'pending'
    CHECK (payment_status IN ('pending','paid','failed')),
  mpesa_transaction_id   TEXT,
  notes                  TEXT,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ── BLOG POSTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT DEFAULT '',
  content      TEXT DEFAULT '',
  cover_image  TEXT DEFAULT '',
  category     TEXT DEFAULT 'Style Tips',
  author_name  TEXT DEFAULT 'Men''s World Kenya',
  author_avatar TEXT,
  published    BOOLEAN DEFAULT FALSE,
  read_time    INTEGER DEFAULT 3,           -- Estimated minutes
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── REVIEWS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id        UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name         TEXT NOT NULL,
  rating            INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment           TEXT DEFAULT '',
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── NEWSLETTER ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY (RLS) ─────────────────────────
-- RLS ensures users can only see/edit their OWN data.
-- Supabase enforces these rules automatically on every query.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read/update only their own profile
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- PRODUCTS: Anyone can read; only admins can write
CREATE POLICY "Anyone can read products" ON public.products FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ORDERS: Users see only their own orders; admins see all
CREATE POLICY "Users can see own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can see all orders" ON public.orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- BLOG POSTS: Published posts are public; admins manage all
CREATE POLICY "Anyone can read published posts" ON public.blog_posts FOR SELECT USING (published = TRUE);
CREATE POLICY "Admins can manage all posts" ON public.blog_posts FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- REVIEWS: Anyone can read; auth users can write
CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Auth users can write reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ── SEED DATA — Sample products ───────────────────────
INSERT INTO public.products (name, slug, description, price, original_price, category, sizes, colors, in_stock, is_featured, is_new, rating, review_count)
VALUES
  ('Premium Turkish 2-Piece Suit', 'premium-turkish-2-piece-suit', 'Finest Turkish wool blend. Slim fit. Perfect for weddings, meetings and formal events.', 8500, 12000, 'suits', ARRAY['38','40','42','44','46'], ARRAY['Charcoal','Navy','Black'], TRUE, TRUE, TRUE, 4.8, 24),
  ('Classic White Dress Shirt', 'classic-white-dress-shirt', 'Premium cotton poplin. Wrinkle-resistant. French cuffs available.', 2500, 3200, 'shirts', ARRAY['S','M','L','XL','XXL'], ARRAY['White','Light Blue','Black'], TRUE, TRUE, FALSE, 4.6, 18),
  ('Premium Leather Oxford Shoes', 'premium-leather-oxford-shoes', 'Genuine leather upper with cushioned insole. Classic brogue detailing.', 5500, NULL, 'shoes', ARRAY['39','40','41','42','43','44','45'], ARRAY['Black','Dark Brown'], TRUE, TRUE, FALSE, 4.7, 31),
  ('Slim Fit Khaki Chinos', 'slim-fit-khaki-chinos', 'Stretch cotton blend. Tapered leg. Versatile for office and casual wear.', 2800, NULL, 'trousers', ARRAY['28','30','32','34','36','38'], ARRAY['Khaki','Navy','Olive','Black'], TRUE, TRUE, TRUE, 4.5, 12),
  ('Casual Bomber Jacket', 'casual-bomber-jacket', 'Premium polyester shell with warm lining. Ribbed cuffs and hem.', 4300, 5500, 'jackets', ARRAY['S','M','L','XL'], ARRAY['Black','Olive','Navy'], TRUE, TRUE, FALSE, 4.4, 9),
  ('Shirt + Trouser Combo Deal', 'shirt-trouser-combo-deal', 'Pick any shirt and trouser from our collection at a discounted bundle price.', 4300, 5700, 'shirts', ARRAY['S','M','L','XL','XXL'], ARRAY['Various'], TRUE, TRUE, FALSE, 4.9, 45),
  ('Crewneck Wool Sweater', 'crewneck-wool-sweater', 'Soft merino wool blend. Classic fit. Perfect for Nairobi evenings.', 3200, NULL, 'sweaters', ARRAY['S','M','L','XL'], ARRAY['Burgundy','Navy','Camel','Black'], TRUE, FALSE, TRUE, 4.3, 7),
  ('Premium V-Neck T-Shirt', 'premium-v-neck-t-shirt', '100% combed cotton. Pre-shrunk. Available in 8 colours.', 1200, NULL, 't-shirts', ARRAY['S','M','L','XL','XXL'], ARRAY['White','Black','Grey','Navy','Burgundy'], TRUE, FALSE, FALSE, 4.2, 33);

-- ── SAMPLE BLOG POST ──────────────────────────────────
INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author_name, published, read_time)
VALUES (
  '5 Ways to Style a Turkish Suit for Any Occasion',
  '5-ways-to-style-a-turkish-suit',
  'From boardroom meetings to weddings — learn how to get maximum versatility from your Men''s World suit.',
  '<p>A well-fitted Turkish suit is the most versatile item in a gentleman''s wardrobe...</p>',
  'Style Tips',
  'Men''s World Kenya',
  TRUE,
  4
);


-- ── STORAGE BUCKET FOR PRODUCT & BLOG IMAGES ─────────
-- Run this AFTER creating your schema to set up image uploads.
-- In Supabase dashboard: Storage → New bucket → name it "products" → make it PUBLIC
-- Then run this to set the upload policy:

INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read images (they're public product photos)
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Allow authenticated users (admins) to upload images
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their uploads
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
);
