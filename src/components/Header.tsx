'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/components/auth/AuthProvider';

const CATEGORIES = [
  { label: 'Elektronik', slug: 'elektronik' },
  { label: 'Fashion', slug: 'fashion' },
  { label: 'Rumah Tangga', slug: 'rumah-tangga' },
  { label: 'Olahraga', slug: 'olahraga' },
  { label: 'Kecantikan', slug: 'kecantikan' },
  { label: 'Otomotif', slug: 'otomotif' },
  { label: 'Makanan', slug: 'makanan' },
  { label: 'Buku', slug: 'buku' },
];

export default function Header() {
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const itemCount = useCartStore(s => s.items.reduce((sum, i) => sum + i.qty, 0));
  const { user, loading, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/?q=${encodeURIComponent(query.trim())}`);
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <header className="sticky top-0 z-50 bg-[#0b4f9c] shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
          <span className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-black text-sm tracking-tight">
            OS
          </span>
          <div className="text-white leading-none hidden xs:block sm:block">
            <div className="font-black text-[15px] sm:text-lg leading-none tracking-tight">Optima</div>
            <div className="text-blue-100/80 text-[10px] sm:text-xs font-medium">Store</div>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 min-w-0 max-w-2xl">
          <div className="flex rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-black/5">
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cari produk, toko, kategori..."
              className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-400"
              aria-label="Cari produk"
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 px-3.5 sm:px-4 py-2.5 text-[#0b4f9c] font-bold text-sm transition shrink-0"
              aria-label="Cari"
            >
              Cari
            </button>
          </div>
        </form>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {user?.role === 'SELLER' ? (
            <Link
              href="/dashboard/seller"
              className="hidden md:inline-flex bg-amber-400 hover:bg-amber-300 text-[#0b4f9c] font-bold text-xs px-3 py-2 rounded-xl transition whitespace-nowrap"
            >
              Toko Saya
            </Link>
          ) : (
            <Link
              href="/seller-onboarding"
              className="hidden md:inline-flex bg-amber-400 hover:bg-amber-300 text-[#0b4f9c] font-bold text-xs px-3 py-2 rounded-xl transition whitespace-nowrap"
            >
              Jadi Seller
            </Link>
          )}

          <Link
            href="/cart"
            className="relative flex flex-col items-center justify-center text-white hover:text-amber-200 transition w-11 h-11 rounded-xl hover:bg-white/10"
            aria-label={`Keranjang${itemCount ? `, ${itemCount} item` : ''}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-12L6 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M6 6 5 3H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="9" cy="20" r="1.2" fill="currentColor" />
              <circle cx="18" cy="20" r="1.2" fill="currentColor" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-white hover:bg-white/10 rounded-xl px-1.5 py-1 transition"
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white/80" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-[#0b4f9c] font-black text-sm flex items-center justify-center border-2 border-white/80">
                    {initials}
                  </div>
                )}
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-bold leading-none truncate max-w-[88px]">{user.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-blue-100/80 leading-none capitalize mt-0.5">{user.role.toLowerCase()}</div>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50" role="menu">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Dashboard</Link>
                    <Link href="/orders" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Pesanan Saya</Link>
                    <Link href="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Profil</Link>
                    {user.role === 'BUYER' && (
                      <Link href="/seller-onboarding" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-blue-700 hover:bg-blue-50" role="menuitem">Jadi Seller</Link>
                    )}
                    {user.role === 'SELLER' && (
                      <Link href="/dashboard/seller" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-green-700 hover:bg-green-50" role="menuitem">Dashboard Toko</Link>
                    )}
                    {user.role === 'ADMIN' && (
                      <Link href="/dashboard/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" role="menuitem">Admin Panel</Link>
                    )}
                  </div>
                  <div className="border-t py-1">
                    <button
                      type="button"
                      onClick={() => { setDropdownOpen(false); signOut(); }}
                      className="block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      role="menuitem"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center h-9 px-3 sm:px-3.5 rounded-xl border border-white/35 text-white text-xs sm:text-sm font-semibold hover:bg-white hover:text-[#0b4f9c] transition whitespace-nowrap"
              aria-busy={loading}
            >
              Masuk
            </Link>
          )}
        </div>
      </div>

      <div className="bg-[#083d7a] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <nav className="flex items-center gap-0.5 overflow-x-auto no-scrollbar py-1.5" aria-label="Kategori">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/?cat=${cat.slug}`}
                className="flex-shrink-0 px-3 py-1.5 text-xs text-blue-100/90 hover:text-white hover:bg-white/10 rounded-lg transition font-medium whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/sellers"
              className="flex-shrink-0 px-3 py-1.5 text-xs text-amber-200 hover:text-white hover:bg-white/10 rounded-lg transition font-semibold whitespace-nowrap ml-1 border border-amber-300/30"
            >
              Semua Toko
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
