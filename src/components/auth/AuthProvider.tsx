'use client';
// components/auth/AuthProvider.tsx — Global auth context
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import type { AuthUser } from '@/lib/auth';
import type { Session } from '@supabase/supabase-js';

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refresh: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const AUTH_TIMEOUT_MS = 2500;

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (sess: Session | null) => {
    if (!sess?.user) {
      setUser(null);
      setSession(null);
      return;
    }
    const u = sess.user;
    setSession(sess);
    setUser({
      id: u.id,
      email: u.email!,
      name: u.user_metadata?.name ?? u.email!.split('@')[0],
      role: (u.user_metadata?.role ?? 'BUYER') as AuthUser['role'],
      avatar: u.user_metadata?.avatar_url,
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const failSafe = window.setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, AUTH_TIMEOUT_MS);

    let subscription: { unsubscribe: () => void } | undefined;

    try {
      const supabase = createClient();

      supabase.auth
        .getSession()
        .then(({ data }) => {
          if (cancelled) return;
          return loadUser(data.session);
        })
        .catch((err) => {
          console.warn('auth getSession failed', err);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });

      const { data } = supabase.auth.onAuthStateChange((_event, sess) => {
        loadUser(sess)
          .catch(() => undefined)
          .finally(() => {
            if (!cancelled) setLoading(false);
          });
      });
      subscription = data.subscription;
    } catch (err) {
      console.warn('auth client init failed', err);
      setLoading(false);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(failSafe);
      subscription?.unsubscribe();
    };
  }, [loadUser]);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('signOut failed', err);
    }
    setUser(null);
    setSession(null);
    window.location.href = '/';
  };

  const refresh = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      await loadUser(data.session);
    } catch (err) {
      console.warn('auth refresh failed', err);
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut: handleSignOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
