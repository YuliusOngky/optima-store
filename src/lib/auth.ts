// lib/auth.ts — Auth helpers & types
import { createClient } from './supabase';

export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  sellerId?: number;
}

// ─── Sign up dengan email & password ───────────────────────
export async function signUp(email: string, password: string, name: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role: 'BUYER' },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

// ─── Sign in dengan email & password ───────────────────────
export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

// ─── Sign in dengan Google OAuth ───────────────────────────
export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

// ─── Sign out ───────────────────────────────────────────────
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

// ─── Get current user (client side) ────────────────────────
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name ?? user.email!.split('@')[0],
    role: (user.user_metadata?.role ?? 'BUYER') as UserRole,
    avatar: user.user_metadata?.avatar_url,
  };
}
