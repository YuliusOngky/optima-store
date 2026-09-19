// app/sellers/[id]/page.tsx
import { Metadata } from 'next';

export const revalidate = 60;

interface Props { params: { id: string } }

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/sellers?limit=50`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const sellers: { id: number }[] = Array.isArray(data) ? data : (data.data ?? []);
    return sellers.map((s) => ({ id: String(s.id) }));
  } catch {
    return [];
  }
}

async function getSeller(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sellers/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seller = await getSeller(params.id);
  if (!seller) return { title: 'Toko tidak ditemukan — Optima Store' };
  return {
    title: `${seller.name} — Optima Store`,
    description: seller.description ?? `Toko ${seller.name} di ${seller.city}`,
  };
}

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export default async function SellerPage({ params }: Props) {
  const seller = await getSeller(params.id);

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏪</div>
          <h1 className="text-xl font-bold">Toko tidak ditemukan</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Store Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl shrink-0">
            🏪
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black">{seller.name}</h1>
              {seller.isVerified && (
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">✓ Terverifikasi</span>
              )}
            </div>
            <p className="text-gray-500 mt-1">📍 {seller.city}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-yellow-500 font-bold">⭐ {seller.rating}</span>
              <span className="text-gray-400">{seller.totalSales?.toLocaleString('id-ID')} produk terjual</span>
            </div>
          </div>
        </div>
        {seller.description && (
          <p className="mt-4 text-sm text-gray-600 border-t pt-4">{seller.description}</p>
        )}
      </div>

      {/* Products */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-lg mb-4">Produk ({seller.products?.length ?? 0})</h2>
        {seller.products?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {seller.products.map((p: any) => (
              <a key={p.id} href={`/products/${p.id}`} className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition">
                <div className="h-36 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {p.imageUrls?.[0]
                    ? <img src={p.imageUrls[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    : <span className="text-4xl">🛍️</span>
                  }
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold line-clamp-2 mb-1">{p.name}</p>
                  <p className="text-blue-700 font-black text-sm">{fmt(p.price)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">⭐ {p.rating} · {p.totalSold.toLocaleString('id-ID')} terjual</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">Belum ada produk</div>
        )}
      </div>
    </div>
  );
}
