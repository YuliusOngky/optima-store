'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

const MENU_BUYER = [
  { icon: '📦', label: 'Pesanan Saya', href: '/orders', desc: 'Lacak & riwayat pesanan' },
  { icon: '❤️', label: 'Wishlist', href: '/wishlist', desc: 'Produk yang disimpan' },
  { icon: '👤', label: 'Profil Saya', href: '/profile', desc: 'Edit data diri' },
  { icon: '📍', label: 'Alamat', href: '/profile/address', desc: 'Kelola alamat pengiriman' },
  { icon: '🏪', label: 'Buka Toko', href: '/seller-onboarding', desc: 'Mulai jualan di Optima' },
  { icon: '⭐', label: 'Ulasan Saya', href: '/reviews', desc: 'Ulasan yang pernah ditulis' },
];

const MENU_SELLER = [
  { icon: '📊', label: 'Dashboard Toko', href: '/dashboard/seller', desc: 'Statistik & laporan' },
  { icon: '📦', label: 'Kelola Produk', href: '/dashboard/seller/products', desc: 'Tambah & edit produk' },
  { icon: '🛒', label: 'Pesanan Masuk', href: '/dashboard/seller/orders', desc: 'Kelola pesanan pembeli' },
  { icon: '💰', label: 'Keuangan', href: '/dashboard/seller/finance', desc: 'Penarikan & saldo' },
  { icon: '📦', label: 'Pesanan Saya', href: '/orders', desc: 'Sebagai pembeli' },
  { icon: '👤', label: 'Profil', href: '/profile', desc: 'Edit data diri' },
];

const MENU_ADMIN = [
  { icon: '⚙️', label: 'Admin Panel', href: '/dashboard/admin', desc: 'Kelola platform' },
  { icon: '👥', label: 'Pengguna', href: '/dashboard/admin/users', desc: 'Manajemen user' },
  { icon: '🏪', label: 'Toko', href: '/dashboard/admin/sellers', desc: 'Manajemen seller' },
  { icon: '📊', label: 'Analitik', href: '/dashboard/admin/analytics', desc: 'Laporan platform' },
  { icon: '📦', label: 'Semua Pesanan', href: '/dashboard/admin/orders', desc: 'Monitor pesanan' },
  { icon: '👤', label: 'Profil', href: '/profile', desc: 'Edit data diri' },
];

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login?next=/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const menus = user.role === 'ADMIN' ? MENU_ADMIN : user.role === 'SELLER' ? MENU_SELLER : MENU_BUYER;

  const roleLabel = user.role === 'ADMIN' ? 'Administrator' : user.role === 'SELLER' ? 'Penjual' : 'Pembeli';
  const roleBadgeColor = user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : user.role === 'SELLER' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6 flex items-center gap-5">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-black flex-shrink-0">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-gray-900 truncate">{user.name}</h1>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${roleBadgeColor}`}>
                {roleLabel}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          </div>
          <button
            onClick={signOut}
            className="text-sm text-red-500 hover:text-red-700 font-semibold flex-shrink-0"
          >
            Keluar
          </button>
        </div>

        {/* Quick Stats (Buyer) */}
        {user.role === 'BUYER' && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Pesanan Aktif', value: '0', icon: '🚚' },
              { label: 'Selesai', value: '0', icon: '✅' },
              { label: 'Wishlist', value: '0', icon: '❤️' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border shadow-sm p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats (Seller) */}
        {user.role === 'SELLER' && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Produk', value: '0', icon: '📦' },
              { label: 'Pesanan Baru', value: '0', icon: '🛒' },
              { label: 'Pendapatan', value: 'Rp 0', icon: '💰' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border shadow-sm p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Menu Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {menus.map(menu => (
            <Link
              key={menu.href}
              href={menu.href}
              className="bg-white rounded-2xl border shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="text-3xl mb-2">{menu.icon}</div>
              <div className="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition">
                {menu.label}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{menu.desc}</div>
            </Link>
          ))}
        </div>

        {/* Back to shop */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Kembali Belanja
          </Link>
        </div>
      </div>
    </div>
  );
}
