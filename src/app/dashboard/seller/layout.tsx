'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

const NAV = [
  { href: '/dashboard/seller', label: 'Overview', icon: '📊', exact: true },
  { href: '/dashboard/seller/products', label: 'Produk', icon: '📦' },
  { href: '/dashboard/seller/orders', label: 'Pesanan', icon: '🛍️' },
];

export default function SellerDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/auth/login'); return; }
      // Role check via JWT metadata
      const role = (session.user.user_metadata?.role ?? 'BUYER') as string;
      if (role !== 'SELLER' && role !== 'ADMIN') {
        router.replace('/seller-onboarding');
        return;
      }
      setLoading(false);
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Memverifikasi akun seller...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-100 min-h-screen hidden md:flex flex-col pt-6">
        <div className="px-5 mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seller Dashboard</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV.map(item => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100 mt-4">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
            ← Kembali ke Toko
          </Link>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 flex">
        {NAV.map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 text-xs font-semibold ${
                active ? 'text-blue-700' : 'text-gray-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
