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

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadUser = useCallback(async (sess: Session | null) => {
    if (!sess?.user) { setUser(null); setSession(null); return; }
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
    // Initial session
    supabase.auth.getSession().then(({ data }) => {
      loadUser(data.session).finally(() => setLoading(false));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      loadUser(sess).finally(() => setLoading(false));
    });

    return () => subscription.unsubscribe();
  }, [loadUser, supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    window.location.href = '/';
  };

  const refresh = async () => {
    const { data } = await supabase.auth.getSession();
    await loadUser(data.session);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut: handleSignOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
