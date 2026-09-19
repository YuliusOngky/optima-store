'use client';
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

function Countdown() {
  const getTarget = () => {
    const t = new Date();
    t.setHours(t.getHours() + 4, 0, 0, 0);
    return t;
  };
  const [target] = useState(getTarget);
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    const tick = () => setDiff(Math.max(0, target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-1 bg-gray-900/20 px-3 py-1 rounded-full">
      {[pad(h), pad(m), pad(s)].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-white text-red-600 font-black text-sm px-1.5 py-0.5 rounded">{v}</span>
          {i < 2 && <span className="text-white font-bold text-sm">:</span>}
        </span>
      ))}
    </div>
  );
}

export default function FlashSaleSection() {
  const { data: products, isLoading } = useProducts({ cat: 'elektronik' });
  const flashItems = (products ?? []).slice(0, 6);

  return (
    <section className="bg-white rounded-2xl shadow-sm p-5 mb-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <h2 className="text-lg font-black text-gray-900">Flash Sale</h2>
            </div>
            <p className="text-xs text-gray-500">Berakhir dalam</p>
          </div>
          <Countdown />
        </div>
        <a href="/?cat=elektronik" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
          Lihat Semua →
        </a>
      </div>

      {/* Products */}
      {isLoading ? (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-52 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {flashItems.map(p => (
            <ProductCard key={p.id} product={p} compact />
          ))}
        </div>
      )}
    </section>
  );
}
