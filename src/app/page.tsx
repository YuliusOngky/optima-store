'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import HeroBanner from '@/components/HeroBanner';
import SideBanners from '@/components/SideBanners';
import FlashSaleSection from '@/components/FlashSaleSection';
import TopSellers from '@/components/TopSellers';
import ProductGrid from '@/components/ProductGrid';

const CATEGORIES = [
  { label: 'Semua', icon: '🏠', slug: '' },
  { label: 'Elektronik', icon: '📱', slug: 'elektronik' },
  { label: 'Fashion', icon: '👗', slug: 'fashion' },
  { label: 'Rumah Tangga', icon: '🏠', slug: 'rumah-tangga' },
  { label: 'Olahraga', icon: '⚽', slug: 'olahraga' },
  { label: 'Kecantikan', icon: '💄', slug: 'kecantikan' },
  { label: 'Otomotif', icon: '🚗', slug: 'otomotif' },
  { label: 'Makanan', icon: '🍜', slug: 'makanan' },
  { label: 'Buku', icon: '📚', slug: 'buku' },
];

function HomeContent() {
  const params = useSearchParams();
  const cat = params.get('cat') ?? undefined;
  const q = params.get('q') ?? undefined;
  const isFiltered = !!(cat || q);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Banner area — only on homepage */}
      {!isFiltered && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <HeroBanner />
          </div>
          <div className="md:col-span-1">
            <SideBanners />
          </div>
        </div>
      )}

      {/* Quick Category Chips (mobile-friendly) */}
      {!isFiltered && (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
          {CATEGORIES.map(c => (
            <a
              key={c.slug}
              href={c.slug ? `/?cat=${c.slug}` : '/'}
              className={`flex flex-col items-center shrink-0 bg-white rounded-xl p-3 shadow-sm hover:shadow-md border transition w-16 ${!cat && !c.slug ? 'border-blue-500' : 'border-transparent'}`}
            >
              <span className="text-2xl mb-1">{c.icon}</span>
              <span className="text-xs text-gray-600 text-center leading-tight">{c.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* Flash Sale — only on homepage */}
      {!isFiltered && <FlashSaleSection />}

      {/* Top Sellers — only on homepage */}
      {!isFiltered && <TopSellers />}

      {/* Product Grid */}
      <Suspense fallback={<div className="bg-white rounded-2xl p-8 text-center animate-pulse">Memuat produk...</div>}>
        <ProductGrid cat={cat} q={q} />
      </Suspense>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
