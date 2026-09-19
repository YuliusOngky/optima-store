'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { createClient } from '@/lib/supabase';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;
const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const SHIPPING_FEE = 15000;

  const [form, setForm] = useState({
    recipientName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    courier: 'JNE',
  });

  if (!items.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <p className="text-gray-500 mb-4">Keranjang kamu kosong.</p>
        <Link href="/" className="bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">Belanja Dulu</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth/login'); return; }

      const payload = {
        items: items.map(i => ({ productId: i.productId, quantity: i.qty, price: i.price })),
        ...form,
        shippingFee: SHIPPING_FEE,
      };

      const res = await axios.post(`${API}/orders`, payload, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      sessionStorage.setItem('snapToken', res.data.snapToken);
      sessionStorage.setItem('orderId', String(res.data.id));
      clearCart();
      router.push('/checkout/payment');
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message || err.message : String(err);
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, placeholder: string) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        required={key !== 'courier' && key !== 'postalCode'}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-6">📦 Informasi Pengiriman</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6 space-y-4">
          {field('recipientName', 'Nama Penerima', 'Nama lengkap penerima')}
          {field('phone', 'No. HP', '08xxxxxxxxxx')}
          {field('address', 'Alamat Lengkap', 'Jl. Contoh No. 1, RT/RW, Kelurahan')}
          <div className="grid grid-cols-2 gap-4">
            {field('city', 'Kota / Kabupaten', 'Jakarta Selatan')}
            {field('postalCode', 'Kode Pos', '12345')}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kurir</label>
            <select
              value={form.courier}
              onChange={e => setForm(f => ({ ...f, courier: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="JNE">JNE</option>
              <option value="J&T">J&amp;T Express</option>
              <option value="SiCepat">SiCepat</option>
              <option value="Anteraja">Anteraja</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Ringkasan</h2>
            <div className="space-y-2 text-sm mb-4 max-h-48 overflow-y-auto">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between gap-2">
                  <span className="text-gray-600 line-clamp-1 flex-1">{item.name} ×{item.qty}</span>
                  <span className="font-semibold shrink-0">{fmt(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{fmt(totalPrice())}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Ongkir</span><span>{fmt(SHIPPING_FEE)}</span></div>
              <div className="flex justify-between font-black text-base pt-1 border-t">
                <span>Total</span><span className="text-blue-700">{fmt(totalPrice() + SHIPPING_FEE)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition"
            >
              {loading ? 'Memproses...' : '💳 Lanjut ke Pembayaran'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
