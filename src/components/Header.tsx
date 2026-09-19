'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/components/auth/AuthProvider';

const CATEGORIES = [
  { label: '📱 Elektronik', slug: 'elektronik' },
  { label: '👕 Fashion', slug: 'fashion' },
  { label: '🏠 Rumah Tangga', slug: 'rumah-tangga' },
  { label: '⚽ Olahraga', slug: 'olahraga' },
  { label: '💄 Kecantikan', slug: 'kecantikan' },
  { label: '🚗 Otomotif', slug: 'otomotif' },
  { label: '🍜 Makanan', slug: 'makanan' },
  { label: '📚 Buku', slug: 'buku' },
];

export default function Header() {
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const itemCount = useCartStore(s => s.items.reduce((sum, i) => sum + i.qty, 0));
  const { user, loading, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
    <header className="sticky top-0 z-50 bg-blue-700 shadow-md">
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">🛍️</span>
          <div className="text-white leading-none">
            <div className="font-black text-lg leading-none">Optima</div>
            <div className="text-blue-200 text-xs">Store</div>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 flex gap-2 max-w-xl mx-auto">
          <div className="flex-1 flex rounded-xl overflow-hidden bg-white shadow-inner">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cari produk, toko, kategori..."
              className="flex-1 px-4 py-2 text-sm text-gray-700 outline-none bg-transparent"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 text-blue-900 font-bold text-sm transition"
            >
              🔍
            </button>
          </div>
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Cart */}
          <Link href="/cart" className="relative flex flex-col items-center text-white hover:text-yellow-300 transition">
            <span className="text-xl">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
            <span className="text-[10px] hidden sm:block">Keranjang</span>
          </Link>

          {/* Auth */}
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-blue-500 animate-pulse" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-white hover:text-yellow-300 transition"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-yellow-400 text-blue-900 font-black text-sm flex items-center justify-center border-2 border-white">
                    {initials}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold leading-none truncate max-w-[80px]">{user.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-blue-200 leading-none capitalize">{user.role.toLowerCase()}</div>
                </div>
                <span className="text-blue-200 text-xs">▾</span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border overflow-hidden z-50">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <span>🏠</span> Dashboard
                    </Link>
                    <Link href="/orders" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <span>📦</span> Pesanan Saya
                    </Link>
                    <Link href="/profile" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <span>👤</span> Profil
                    </Link>
                    {user.role === 'SELLER' && (
                      <Link href="/dashboard/seller" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition">
                        <span>🏪</span> Dashboard Toko
                      </Link>
                    )}
                    {user.role === 'ADMIN' && (
                      <Link href="/dashboard/admin" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 transition">
                        <span>⚙️</span> Admin Panel
                      </Link>
                    )}
                  </div>
                  <div className="border-t py-1">
                    <button
                      onClick={() => { setDropdownOpen(false); signOut(); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full text-left"
                    >
                      <span>🚪</span> Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex flex-col items-center text-white hover:text-yellow-300 transition"
            >
              <span className="text-xl">👤</span>
              <span className="text-[10px] hidden sm:block">Masuk</span>
            </Link>
          )}
        </div>
      </div>

      {/* Category bar */}
      <div className="bg-blue-800 border-t border-blue-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/?cat=${cat.slug}`}
                className="flex-shrink-0 px-3 py-1 text-xs text-blue-100 hover:text-white hover:bg-blue-700 rounded-full transition font-medium whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/sellers"
              className="flex-shrink-0 px-3 py-1 text-xs text-blue-100 hover:text-white hover:bg-blue-700 rounded-full transition font-medium whitespace-nowrap ml-2 border border-blue-500"
            >
              🏪 Semua Toko
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
