'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;
const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING:    { label: 'Menunggu Bayar', color: 'bg-yellow-100 text-yellow-800' },
  PAID:       { label: 'Dibayar',        color: 'bg-blue-100 text-blue-800' },
  PROCESSING: { label: 'Diproses',       color: 'bg-indigo-100 text-indigo-800' },
  SHIPPED:    { label: 'Dikirim',        color: 'bg-purple-100 text-purple-800' },
  DELIVERED:  { label: 'Diterima',       color: 'bg-green-100 text-green-800' },
  DONE:       { label: 'Selesai',        color: 'bg-emerald-100 text-emerald-800' },
  CANCELLED:  { label: 'Dibatalkan',     color: 'bg-red-100 text-red-800' },
};

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: { id: number; product: { name: string; imageUrls: string[] } }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setError('Silakan login terlebih dahulu.'); setLoading(false); return; }
        const res = await axios.get(`${API}/orders`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        setOrders(res.data);
      } catch {
        setError('Gagal memuat pesanan.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">Memuat pesanan...</div>;
  if (error)   return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-red-500">{error}</div>;

  if (!orders.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">📦</div>
        <h1 className="text-xl font-bold mb-2">Belum Ada Pesanan</h1>
        <p className="text-gray-500 mb-6">Yuk mulai belanja!</p>
        <Link href="/" className="bg-blue-700 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-800">Mulai Belanja</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-6">📦 Pesanan Saya</h1>
      <div className="space-y-4">
        {orders.map(order => {
          const st = STATUS_LABEL[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-800' };
          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400">#{order.id.substring(0, 8)} · {new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${st.color}`}>{st.label}</span>
              </div>
              <div className="flex gap-2 mb-3 overflow-hidden">
                {order.items.slice(0, 3).map(item => (
                  <div key={item.id} className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {item.product.imageUrls?.[0]
                      ? <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      : <span className="flex items-center justify-center h-full text-xl">🛍️</span>
                    }
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{order.items.length} produk</span>
                <span className="font-black text-blue-700">{fmt(order.totalAmount)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
