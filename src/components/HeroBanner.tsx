'use client';
import { useState, useEffect } from 'react';
import { useBanners } from '@/hooks/useProducts';
import { Banner } from '@/types';

const GRADIENTS = [
  'from-blue-900 via-blue-700 to-blue-500',
  'from-purple-900 via-purple-700 to-pink-500',
  'from-red-900 via-red-700 to-orange-500',
];

function HeroSlide({ banner, active }: { banner: Banner; active: boolean }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {banner.imageUrl ? (
        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full bg-gradient-to-r ${GRADIENTS[0]}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex items-center px-8 md:px-16">
        <div className="text-white max-w-lg">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">🔥 Sale Spesial</div>
          <h2 className="text-2xl md:text-4xl font-black leading-tight mb-3">{banner.title}</h2>
          {banner.subtitle && <p className="text-sm md:text-base text-white/80 mb-6">{banner.subtitle}</p>}
          {banner.ctaText && (
            <button className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-full text-sm transition">
              {banner.ctaText} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const FALLBACK_BANNERS: Banner[] = [
  { id: 1, type: 'HERO', title: 'Harbolnas 12.12 Sale Gila-Gilaan!', subtitle: 'Diskon hingga 90% + Cashback 50%', ctaText: 'Belanja Sekarang', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200', isActive: true, sortOrder: 1 },
  { id: 2, type: 'HERO', title: 'Flash Sale Elektronik Setiap Hari', subtitle: 'Harga spesial mulai Rp 99.000', ctaText: 'Lihat Flash Sale', imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c228f8c6be?w=1200', isActive: true, sortOrder: 2 },
  { id: 3, type: 'HERO', title: 'Fashion Week Sale Up To 70%', subtitle: 'Brand lokal & internasional terbaik', ctaText: 'Shop Now', imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200', isActive: true, sortOrder: 3 },
];

export default function HeroBanner() {
  const { data: allBanners } = useBanners('HERO');
  const heroBanners = (allBanners ?? FALLBACK_BANNERS).filter(b => b.isActive);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % heroBanners.length), 4500);
    return () => clearInterval(t);
  }, [heroBanners.length]);

  if (!heroBanners.length) return null;

  return (
    <div className="relative w-full h-52 md:h-80 rounded-2xl overflow-hidden bg-gray-200">
      {heroBanners.map((b, i) => (
        <HeroSlide key={b.id} banner={b} active={i === current} />
      ))}
      {/* Dots */}
      {heroBanners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {heroBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
