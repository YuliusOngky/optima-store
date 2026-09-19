'use client';
import { useBanners } from '@/hooks/useProducts';
import { Banner } from '@/types';

const FALLBACK: Banner[] = [
  { id: 4, type: 'SIDE', title: 'Cashback GoPay 30%', subtitle: 'Min. transaksi Rp 100.000', ctaText: 'Pakai GoPay', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600', isActive: true, sortOrder: 1 },
  { id: 5, type: 'SIDE', title: 'Gratis Ongkir Seluruh Indonesia', subtitle: 'Min. belanja Rp 50.000', ctaText: 'Belanja Gratis Ongkir', imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600', isActive: true, sortOrder: 2 },
];

export default function SideBanners() {
  const { data } = useBanners('SIDE');
  const banners = (data ?? FALLBACK).filter(b => b.isActive);

  return (
    <div className="flex flex-row md:flex-col gap-3">
      {banners.map(b => (
        <div key={b.id} className="relative flex-1 h-24 md:h-28 rounded-xl overflow-hidden bg-gray-200 cursor-pointer group">
          {b.imageUrl && (
            <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-3">
            <p className="text-white font-bold text-xs leading-tight">{b.title}</p>
            {b.subtitle && <p className="text-white/70 text-xs mt-0.5 hidden md:block">{b.subtitle}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
