// lib/supabase.ts — Supabase client singletons
import { createBrowserClient } from '@supabase/ssr';
import { createServerClient } from '@supabase/ssr';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ─── Browser client (untuk Client Components) ─────────────
export function createClient() {
  return createBrowserClient(url, anon);
}

// ─── Server client (untuk Server Components / Route Handlers) ──
export async function createServerSupabase() {
  // Dynamic import to avoid module-level evaluation of next/headers
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}
