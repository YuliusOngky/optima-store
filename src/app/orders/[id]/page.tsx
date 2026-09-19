'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;
const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const STATUS_LABEL: Record<string, { label: string; color: string; icon: string }> = {
  PENDING:    { label: 'Menunggu Bayar',      color: 'text-yellow-600', icon: '⏳' },
  PAID:       { label: 'Pembayaran Diterima', color: 'text-blue-600',   icon: '✅' },
  PROCESSING: { label: 'Sedang Diproses',     color: 'text-indigo-600', icon: '⚙️' },
  SHIPPED:    { label: 'Dalam Pengiriman',    color: 'text-purple-600', icon: '🚚' },
  DELIVERED:  { label: 'Pesanan Diterima',    color: 'text-green-600',  icon: '🎉' },
  DONE:       { label: 'Selesai',             color: 'text-emerald-600',icon: '⭐' },
  CANCELLED:  { label: 'Dibatalkan',          color: 'text-red-600',    icon: '❌' },
};

interface OrderDetail {
  id: string;
  status: string;
  totalAmount: number;
  shippingFee: number;
  recipientName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  courier?: string;
  trackingNumber?: string;
  snapToken?: string;
  createdAt: string;
  seller: { id: number; name: string; city: string };
  items: {
    id: number;
    quantity: number;
    price: number;
    product: { id: number; name: string; imageUrls: string[]; price: number };
  }[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push('/auth/login'); return; }
        const res = await axios.get(`${API}/orders/${params.id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        setOrder(res.data);
      } catch {
        setError('Pesanan tidak ditemukan.');
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id, router]);

  const handlePayNow = () => {
    if (!order?.snapToken) return;
    sessionStorage.setItem('snapToken', order.snapToken);
    sessionStorage.setItem('orderId', order.id);
    router.push('/checkout/payment');
  };

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">Memuat...</div>;
  if (error || !order) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center text-red-500">
      {error || 'Pesanan tidak ditemukan.'}
    </div>
  );

  const st = STATUS_LABEL[order.status] ?? { label: order.status, color: 'text-gray-600', icon: '📦' };
  const itemsTotal = order.totalAmount - order.shippingFee;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/orders" className="text-gray-400 hover:text-gray-600">← Pesanan</Link>
      </div>

      {/* Status */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{st.icon}</span>
          <div>
            <p className="text-xs text-gray-400">
              #{order.id.substring(0, 8)} · {new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className={`font-black text-lg ${st.color}`}>{st.label}</p>
          </div>
        </div>
        {order.status === 'PENDING' && order.snapToken && (
          <button
            onClick={handlePayNow}
            className="mt-4 w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition"
          >
            💳 Bayar Sekarang
          </button>
        )}
        {order.trackingNumber && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
            <span className="font-semibold">No. Resi ({order.courier}):</span> {order.trackingNumber}
          </div>
        )}
      </div>

      {/* Seller */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <p className="text-xs text-gray-400 mb-1">Toko</p>
        <p className="font-semibold">{order.seller.name} <span className="text-gray-400 font-normal">· {order.seller.city}</span></p>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="font-bold mb-4">Produk</h2>
        <div className="space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                {item.product.imageUrls?.[0]
                  ? <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  : <span className="flex items-center justify-center h-full text-2xl">🛍️</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm line-clamp-2">{item.product.name}</p>
                <div className="flex justify-between items-end mt-1">
                  <span className="text-xs text-gray-500">{fmt(item.price)} × {item.quantity}</span>
                  <span className="font-bold text-sm">{fmt(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="font-bold mb-3">Alamat Pengiriman</h2>
        <p className="font-semibold">{order.recipientName}</p>
        <p className="text-sm text-gray-500">{order.phone}</p>
        <p className="text-sm text-gray-500 mt-1">
          {order.address}{order.city ? `, ${order.city}` : ''}{order.postalCode ? ` ${order.postalCode}` : ''}
        </p>
        {order.courier && <p className="text-sm text-gray-400 mt-1">Kurir: {order.courier}</p>}
      </div>

      {/* Payment Summary */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="font-bold mb-3">Rincian Pembayaran</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{fmt(itemsTotal)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Ongkir</span><span>{fmt(order.shippingFee)}</span></div>
          <div className="flex justify-between font-black text-base pt-2 border-t">
            <span>Total</span><span className="text-blue-700">{fmt(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
