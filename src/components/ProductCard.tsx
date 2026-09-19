'use client';
import Link from 'next/link';
import { Product } from '@/types';
import { useCartStore } from '@/store/cart';

interface Props {
  product: Product;
  compact?: boolean;
}

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const BADGE_STYLES: Record<string, string> = {
  disc: 'bg-red-500',
  hot: 'bg-orange-500',
  new: 'bg-green-500',
};
const BADGE_LABELS: Record<string, string> = {
  disc: 'DISKON',
  hot: 'HOT',
  new: 'BARU',
};

export default function ProductCard({ product, compact = false }: Props) {
  const addItem = useCartStore(s => s.addItem);

  const handleAddCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrls?.[0] });
  };

  return (
    <Link href={`/products/${product.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Image */}
      <div className={`relative bg-gray-100 flex items-center justify-center overflow-hidden ${compact ? 'h-32' : 'h-44'}`}>
        {product.imageUrls?.[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl">🛍️</span>
        )}
        {product.badge && (
          <span className={`absolute top-2 left-2 ${BADGE_STYLES[product.badge] ?? 'bg-gray-500'} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
            {BADGE_LABELS[product.badge] ?? product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-500 mb-1 line-clamp-1">{product.seller?.name} · {product.seller?.city}</p>
        <p className={`font-semibold text-gray-900 mb-2 leading-snug ${compact ? 'text-sm line-clamp-1' : 'text-sm line-clamp-2'}`}>
          {product.name}
        </p>
        <div className="mt-auto">
          <p className="text-blue-700 font-black text-base">{fmt(product.price)}</p>
          {product.origPrice && (
            <p className="text-xs text-gray-400 line-through">{fmt(product.origPrice)}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">⭐ {product.rating} · {product.totalSold.toLocaleString('id-ID')} terjual</span>
            <button
              onClick={handleAddCart}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition"
            >
              + Keranjang
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
