'use client';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export default function CartPage() {
  const { items, removeItem, updateQty, totalItems, totalPrice, clearCart } = useCartStore();

  if (!items.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-xl font-bold mb-2">Keranjang Kosong</h1>
        <p className="text-gray-500 mb-6">Yuk mulai belanja dan temukan produk favoritmu!</p>
        <Link href="/" className="bg-blue-700 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-800 transition">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">🛒 Keranjang ({totalItems()} item)</h1>
        <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm font-semibold">
          Hapus Semua
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.productId} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  : <span className="text-3xl">🛍️</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm line-clamp-2 mb-1">{item.name}</p>
                <p className="text-blue-700 font-black">{fmt(item.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                    <button onClick={() => updateQty(item.productId, item.qty - 1)} className="px-3 py-1 hover:bg-gray-100 font-bold">−</button>
                    <span className="px-3 py-1 text-sm font-bold">{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.qty + 1)} className="px-3 py-1 hover:bg-gray-100 font-bold">+</button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600 text-xs">🗑️ Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({totalItems()} item)</span>
                <span className="font-semibold">{fmt(totalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ongkos Kirim</span>
                <span className="text-green-600 font-semibold">Gratis</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-black text-base">
                <span>Total</span>
                <span className="text-blue-700">{fmt(totalPrice())}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition text-center"
            >
              ⚡ Beli Sekarang
            </Link>
            <p className="text-xs text-gray-400 text-center mt-3">
              🔒 Transaksi dijamin aman
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
