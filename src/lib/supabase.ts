// =====================================================
// SUPABASE CLIENT SETUP
// =====================================================
// Supabase is our backend — it gives us:
//   • A PostgreSQL database (stores products, orders, blogs, users)
//   • Authentication (email/password login, Google OAuth)
//   • Storage (product images)
//   • Realtime updates (optional — e.g. live order status)
//
// We need TWO different clients:
//   1. Browser client  — used inside React components (client-side)
//   2. Server client   — used inside API routes & Server Components
//
// WHY TWO? Security. The server client can use the "service role" key
// which bypasses all security rules (for admin actions). We NEVER
// send that key to the browser. The browser client uses the safe "anon" key.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// BROWSER CLIENT
// The `!` at the end of env vars tells TypeScript "trust me, this won't be undefined".
// In production make sure these are set in your Vercel environment variables.
// `NEXT_PUBLIC_` prefix means this value is safe to expose to the browser.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SERVER CLIENT (for API routes only — never import this in a React component)
export const supabaseAdmin = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
