'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    imageUrls: string[];
  };
}

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  shippingFee: number;
  status: string;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  courier?: string;
  trackingNumber?: string;
  createdAt: string;
  items: OrderItem[];
  user: {
    name: string;
    email: string;
  };
}

const STATUS_OPTIONS = [
  { value: 'PROCESSING', label: 'Diproses' },
  { value: 'SHIPPED', label: 'Dikirim' },
  { value: 'DELIVERED', label: 'Terkirim' },
  { value: 'DONE', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
];

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-700' },
  PAID: { label: 'Dibayar', color: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'Diproses', color: 'bg-purple-100 text-purple-700' },
  SHIPPED: { label: 'Dikirim', color: 'bg-indigo-100 text-indigo-700' },
  DELIVERED: { label: 'Terkirim', color: 'bg-teal-100 text-teal-700' },
  DONE: { label: 'Selesai', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

  const supabase = createClient();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(
        `${API_URL}/seller-dashboard/orders?page=${page}&limit=${LIMIT}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      if (!res.ok) throw new Error('Gagal memuat pesanan');
      const data = await res.json();
      setOrders(data.data ?? data);
      setTotal(data.total ?? data.length);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [page]);

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.trackingNumber ?? '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    setUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const body: Record<string, string> = { status: newStatus };
      if (trackingNumber) body.trackingNumber = trackingNumber;
      const res = await fetch(
        `${API_URL}/seller-dashboard/orders/${selectedOrder.id}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error('Gagal update status');
      setSelectedOrder(null);
      loadOrders();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Terjadi kesalahan');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = filterStatus
    ? orders.filter((o) => o.status === filterStatus)
    : orders;

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manajemen Pesanan</h1>

      {/* Filter */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${filterStatus === '' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Semua
        </button>
        {Object.entries(STATUS_LABEL).map(([val, { label, color }]) => (
          <button
            key={val}
            onClick={() => setFilterStatus(val)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${filterStatus === val ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500 text-center py-12">Memuat...</p>}
      {error && <p className="text-red-500 text-center py-12">{error}</p>}

      {!loading && filteredOrders.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>Belum ada pesanan</p>
        </div>
      )}

      {!loading && filteredOrders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const s = STATUS_LABEL[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-700' };
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.user?.name} • {order.user?.email}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.color}`}>{s.label}</span>
                </div>

                <div className="space-y-2 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.product.imageUrls?.[0] && (
                        <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-10 h-10 object-cover rounded" />
                      )}
                      <p className="text-sm text-gray-700 flex-1">{item.product.name}</p>
                      <p className="text-sm text-gray-500">×{item.quantity}</p>
                      <p className="text-sm font-medium text-gray-800">{formatRupiah(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Pengiriman: {order.courier?.toUpperCase() ?? '-'}</p>
                    {order.trackingNumber && (
                      <p className="text-sm text-gray-500">Resi: {order.trackingNumber}</p>
                    )}
                    <p className="font-semibold text-orange-600 mt-1">{formatRupiah(order.totalAmount)}</p>
                  </div>
                  <button
                    onClick={() => openDetail(order)}
                    className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {total > LIMIT && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-40 hover:bg-gray-200">
            ← Sebelumnya
          </button>
          <span className="px-4 py-2 text-gray-600 text-sm">Hal. {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * LIMIT >= total}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-40 hover:bg-gray-200">
            Berikutnya →
          </button>
        </div>
      )}

      {/* Update Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Update Status Pesanan</h2>
            <p className="text-sm text-gray-500 mb-4">#{selectedOrder.orderNumber}</p>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Tujuan Pengiriman</p>
              <p className="text-sm text-gray-600">{selectedOrder.recipientName}</p>
              <p className="text-sm text-gray-600">{selectedOrder.address}, {selectedOrder.city} {selectedOrder.postalCode}</p>
              <p className="text-sm text-gray-600">📞 {selectedOrder.phone}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Baru</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {(newStatus === 'SHIPPED' || newStatus === 'DELIVERED') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Resi</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Masukkan nomor resi pengiriman"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleUpdateStatus} disabled={updating}
                className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
                {updating ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
