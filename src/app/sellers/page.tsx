'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSellers } from '@/hooks/useProducts';

export default function SellersPage() {
  const [query, setQuery] = useState('');
  const { data: sellers, isLoading } = useSellers(query || undefined);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">🏪 Semua Toko</h1>
        <div className="relative">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari toko..."
            className="border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 pl-8"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-36 animate-pulse" />
          ))}
        </div>
      ) : !sellers?.length ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🏪</div>
          <p className="text-gray-500">Toko tidak ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {sellers.map(s => (
            <Link
              key={s.id}
              href={`/sellers/${s.id}`}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md p-5 text-center transition group border border-transparent hover:border-blue-200"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl mx-auto mb-3">
                🏪
              </div>
              <p className="font-bold text-sm line-clamp-2">{s.name}</p>
              <p className="text-xs text-gray-400 mt-1">{s.city}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <span className="text-yellow-500 text-xs">⭐</span>
                <span className="text-xs font-semibold">{s.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
