'use client';
import Link from 'next/link';
import { useSellers } from '@/hooks/useProducts';

export default function TopSellers() {
  const { data: sellers, isLoading } = useSellers();
  const top = (sellers ?? []).slice(0, 6);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
        <div className="h-5 w-32 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="flex gap-3 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-24 h-28 bg-gray-100 rounded-xl animate-pulse shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (!top.length) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-black text-gray-900">🏪 Toko Terpopuler</h2>
        <Link href="/sellers" className="text-blue-600 text-sm font-semibold hover:underline">Semua Toko →</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {top.map(s => (
          <Link
            key={s.id}
            href={`/sellers/${s.id}`}
            className="shrink-0 w-28 bg-gray-50 hover:bg-blue-50 rounded-xl p-3 text-center transition group border border-gray-100 hover:border-blue-200"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl mx-auto mb-2">
              🏪
            </div>
            <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">{s.name}</p>
            <p className="text-xs text-gray-400 mt-1">{s.city}</p>
            <p className="text-xs text-yellow-500 font-bold mt-0.5">⭐ {s.rating}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
