'use client';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

interface Props {
  cat?: string;
  q?: string;
}

const SORTS = [
  { label: 'Terbaru', value: 'newest' },
  { label: 'Terlaris', value: 'sold' },
  { label: 'Harga ↑', value: 'price-asc' },
  { label: 'Harga ↓', value: 'price-desc' },
  { label: 'Rating', value: 'rating' },
];

export default function ProductGrid({ cat, q }: Props) {
  const { data: products, isLoading, error } = useProducts({ cat, q });

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-gray-500">Gagal memuat produk. Coba lagi nanti.</p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-black text-gray-900 text-lg">
            {q ? `Hasil untuk "${q}"` : cat ? `Kategori: ${cat}` : 'Semua Produk'}
          </h2>
          {!isLoading && (
            <p className="text-xs text-gray-400">{products?.length ?? 0} produk ditemukan</p>
          )}
        </div>
        <div className="flex gap-1 flex-wrap">
          {SORTS.map(s => (
            <button key={s.value} className="text-xs border border-gray-200 hover:border-blue-500 hover:text-blue-600 px-3 py-1.5 rounded-full transition">
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : !products?.length ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 font-semibold">Produk tidak ditemukan</p>
          <p className="text-sm text-gray-400 mt-1">Coba kata kunci lain atau pilih kategori berbeda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
