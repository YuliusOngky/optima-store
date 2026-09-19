'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;
const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

interface Stats {
  seller: { name: string; rating: number; totalSales: number };
  totalProducts: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: { label: string; revenue: number }[];
  topProducts: { id: number; name: string; imageUrls: string[]; price: number; totalSold: number; stock: number }[];
}

const StatCard = ({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
    <p className="text-2xl font-black">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

export default function SellerOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await axios.get(`${API}/seller-dashboard/stats`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        setStats(res.data);
      } catch {
        setError('Gagal memuat statistik.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Memuat statistik...</div>;
  if (error)   return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!stats)  return null;

  const maxRev = Math.max(...stats.monthlyRevenue.map(m => m.revenue), 1);

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black">👋 Halo, {stats.seller.name}!</h1>
        <p className="text-gray-500 text-sm mt-1">Berikut ringkasan performa toko kamu</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="💰" label="Total Pendapatan" value={fmt(stats.totalRevenue)} sub={`${stats.paidOrders} transaksi lunas`} />
        <StatCard icon="📦" label="Total Produk" value={String(stats.totalProducts)} />
        <StatCard icon="🛍️" label="Total Order" value={String(stats.totalOrders)} sub={`${stats.pendingOrders} menunggu bayar`} />
        <StatCard icon="⭐" label="Rating Toko" value={stats.seller.rating.toFixed(1)} sub={`${stats.seller.totalSales} penjualan`} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly revenue bar chart */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-bold mb-4">Pendapatan 6 Bulan</h2>
          <div className="flex items-end gap-2 h-36">
            {stats.monthlyRevenue.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-500 rounded-t-lg transition-all"
                  style={{ height: `${Math.round((m.revenue / maxRev) * 120)}px`, minHeight: m.revenue > 0 ? '4px' : '0' }}
                />
                <p className="text-xs text-gray-400 leading-tight text-center">{m.label}</p>
              </div>
            ))}
          </div>
          {stats.monthlyRevenue.every(m => m.revenue === 0) && (
            <p className="text-center text-gray-400 text-sm mt-2">Belum ada data pendapatan</p>
          )}
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-bold mb-4">Produk Terlaris</h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">Belum ada produk.</p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-sm font-black text-gray-300 w-5 text-center">{i + 1}</span>
                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {p.imageUrls?.[0]
                      ? <img src={p.imageUrls[0]} alt={p.name} className="w-full h-full object-cover" />
                      : <span className="flex items-center justify-center h-full text-lg">🛍️</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-1">{p.name}</p>
                    <p className="text-xs text-gray-400">{fmt(p.price)} · {p.totalSold} terjual · stok {p.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
