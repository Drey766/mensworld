# Men's World Kenya — E-Commerce Website

A full-stack Next.js 14 e-commerce website built for Men's World Kenya.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS (custom brand tokens) |
| State | React Context API (Cart, Wishlist, Auth) |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| Payments | M-Pesa Daraja API (STK Push) |
| Notifications | WhatsApp Business Cloud API |
| Deployment | Vercel |

## Pages

| Page | Route | Access |
|---|---|---|
| Home | `/` | Public |
| Shop | `/shop` | Public |
| Product Detail | `/shop/[slug]` | Public |
| Blog | `/blog` | Public |
| Blog Post | `/blog/[slug]` | Public |
| Contact | `/contact` | Public |
| Cart | `/cart` | Public |
| Wishlist | `/wishlist` | Public |
| Checkout | `/checkout` | Auth required |
| Admin | `/admin` | Admin only |

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
# Fill in your Supabase, M-Pesa and WhatsApp credentials
```

### 3. Set up Supabase database
1. Go to [supabase.com](https://supabase.com) and create a free project
2. In your project: **SQL Editor → New Query**
3. Paste the entire contents of `supabase-schema.sql` and click **Run**
4. This creates all tables, policies, and seed data

### 4. Get your Supabase credentials
- Go to **Settings → API** in your Supabase dashboard
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Setting Up M-Pesa Payments

1. Go to [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create an account and create an app
3. Get your **Consumer Key** and **Consumer Secret**
4. Get your **Business Short Code** and **Passkey** (use sandbox values for testing)
5. Set your callback URL to `https://your-domain.vercel.app/api/mpesa/callback`

> **Note:** Use sandbox credentials during development. Switch to production keys when going live.

## Setting Up WhatsApp Order Notifications

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create an app → Add WhatsApp product
3. Get your **Phone Number ID** and **Access Token**
4. Add the owner's phone number as a test recipient (sandbox) or verified number (production)

## Making Someone an Admin

After the user creates an account:
```sql
-- Run in Supabase SQL Editor
UPDATE profiles SET role = 'admin' WHERE email = 'owner@example.com';
```

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Settings → Environment Variables → Add all from .env.local.example
```

## Adding Real Product Images

1. In Supabase dashboard: **Storage → Create bucket** named `products` (make it public)
2. Upload product images through the Admin dashboard → Products → Edit Product
3. The image URL format will be: `https://[project].supabase.co/storage/v1/object/public/products/[filename]`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home page
│   ├── shop/               # Shop + product detail
│   ├── blog/               # Blog list + post detail
│   ├── cart/               # Cart page
│   ├── wishlist/           # Wishlist page
│   ├── checkout/           # Checkout + payment
│   ├── contact/            # Contact page
│   ├── admin/              # Admin dashboard (owner only)
│   └── api/                # Server-side API routes
│       ├── orders/         # Order creation + WhatsApp + M-Pesa
│       ├── products/       # Product CRUD
│       └── mpesa/callback  # M-Pesa payment confirmation
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── home/               # Hero, Categories, Featured, etc.
│   ├── shop/               # ProductCard
│   ├── cart/               # CartDrawer
│   ├── admin/              # Admin components
│   └── ui/                 # AuthModal, shared UI
├── context/                # React Context (Cart, Wishlist, Auth)
├── lib/                    # Supabase client, utility functions
└── types/                  # TypeScript type definitions
```
