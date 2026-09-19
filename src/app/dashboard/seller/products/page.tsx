'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;
const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

interface Category { id: number; name: string; slug: string }
interface Product {
  id: number; name: string; price: number; origPrice?: number;
  stock: number; isActive: boolean; totalSold: number;
  imageUrls: string[]; category: { name: string } | null;
  badge?: string; description?: string; weight: number; categoryId: number;
}

const BADGES = [
  { value: '', label: 'Tidak ada' },
  { value: 'new', label: '🆕 Baru' },
  { value: 'hot', label: '🔥 Terlaris' },
  { value: 'disc', label: '💸 Diskon' },
];

type FormState = {
  name: string; description: string; price: string; origPrice: string;
  stock: string; weight: string; imageUrls: string; badge: string; categoryId: string; isActive: boolean;
};

const emptyForm: FormState = {
  name: '', description: '', price: '', origPrice: '', stock: '',
  weight: '200', imageUrls: '', badge: '', categoryId: '', isActive: true,
};

function productToForm(p: Product): FormState {
  return {
    name: p.name, description: p.description ?? '', price: String(p.price),
    origPrice: p.origPrice ? String(p.origPrice) : '', stock: String(p.stock),
    weight: String(p.weight), imageUrls: p.imageUrls.join('\n'),
    badge: p.badge ?? '', categoryId: String(p.categoryId), isActive: p.isActive,
  };
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const getToken = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? '';
  };

  const loadProducts = useCallback(async () => {
    const token = await getToken();
    const [prodRes, catRes] = await Promise.all([
      axios.get(`${API}/seller-dashboard/products`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API}/categories`),
    ]);
    setProducts(prodRes.data.products);
    setCategories(catRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal('add'); setError(''); };
  const openEdit = (p: Product) => { setEditing(p); setForm(productToForm(p)); setModal('edit'); setError(''); };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const token = await getToken();
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        origPrice: form.origPrice ? Number(form.origPrice) : undefined,
        stock: Number(form.stock),
        weight: Number(form.weight),
        imageUrls: form.imageUrls.split('\n').map(s => s.trim()).filter(Boolean),
        badge: form.badge || undefined,
        categoryId: Number(form.categoryId),
        isActive: form.isActive,
      };
      if (modal === 'add') {
        await axios.post(`${API}/seller-dashboard/products`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else if (editing) {
        await axios.patch(`${API}/seller-dashboard/products/${editing.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      closeModal();
      await loadProducts();
    } catch (e: unknown) {
      const msg = axios.isAxiosError(e) ? e.response?.data?.message || e.message : String(e);
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Nonaktifkan produk ini?')) return;
    const token = await getToken();
    await axios.delete(`${API}/seller-dashboard/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    await loadProducts();
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Memuat produk...</div>;

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-black">📦 Produk Saya</h1>
        <button onClick={openAdd} className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-sm transition">
          + Tambah Produk
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
          <div className="text-5xl mb-3">📦</div>
          <p className="font-semibold">Belum ada produk</p>
          <button onClick={openAdd} className="mt-4 text-blue-600 font-bold text-sm">Tambahkan produk pertama →</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Produk</th>
                <th className="px-4 py-3 text-right">Harga</th>
                <th className="px-4 py-3 text-right">Stok</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {p.imageUrls?.[0]
                          ? <img src={p.imageUrls[0]} alt={p.name} className="w-full h-full object-cover" />
                          : <span className="flex items-center justify-center h-full">🛍️</span>
                        }
                      </div>
                      <div>
                        <p className="font-semibold line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.category?.name ?? '—'} · {p.totalSold} terjual</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold">{fmt(p.price)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={p.stock === 0 ? 'text-red-500 font-bold' : ''}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => openEdit(p)} className="text-blue-600 font-bold mr-3 text-xs hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-400 font-bold text-xs hover:underline">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-black text-lg">{modal === 'add' ? '+ Tambah Produk' : 'Edit Produk'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { key: 'name' as const, label: 'Nama Produk', placeholder: 'Nama produk' },
                { key: 'price' as const, label: 'Harga (Rp)', placeholder: '50000', type: 'number' },
                { key: 'origPrice' as const, label: 'Harga Coret (opsional)', placeholder: '75000', type: 'number' },
                { key: 'stock' as const, label: 'Stok', placeholder: '10', type: 'number' },
                { key: 'weight' as const, label: 'Berat (gram)', placeholder: '200', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">{f.label}</label>
                  <input
                    type={f.type ?? 'text'}
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Kategori</label>
                <select
                  value={form.categoryId}
                  onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih kategori</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Badge</label>
                <select
                  value={form.badge}
                  onChange={e => setForm(prev => ({ ...prev, badge: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {BADGES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">URL Gambar (satu per baris)</label>
                <textarea
                  rows={3}
                  value={form.imageUrls}
                  onChange={e => setForm(prev => ({ ...prev, imageUrls: e.target.value }))}
                  placeholder="https://example.com/img.jpg"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Deskripsi produk..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-blue-600"
                />
                Produk aktif (tampil di toko)
              </label>
              {error && <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">{error}</p>}
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={closeModal} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold">Batal</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold rounded-xl text-sm transition"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
