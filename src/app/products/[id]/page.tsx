// app/products/[id]/page.tsx — Product Detail Page
import { Metadata } from 'next';

export const revalidate = 60; // ISR: revalidate every 60 seconds

interface Props { params: { id: string } }

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=50&page=1`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const products: { id: number }[] = Array.isArray(data) ? data : (data.data ?? []);
    return products.map((p) => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`);
  if (!res.ok) return { title: 'Produk tidak ditemukan — Optima Store' };
  const product = await res.json();
  return {
    title: `${product.name} — Optima Store`,
    description: product.description,
    openGraph: { title: product.name, images: product.imageUrls?.[0] ? [product.imageUrls[0]] : [] },
  };
}

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-bold">Produk tidak ditemukan</h1>
        </div>
      </div>
    );
  }

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-8xl">
            {product.imageUrls?.[0]
              ? <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover rounded-xl" />
              : '🛍️'}
          </div>

          {/* Info */}
          <div>
            {product.badge && (
              <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                {product.badge === 'disc' ? 'DISKON' : product.badge === 'new' ? 'BARU' : 'HOT'}
              </span>
            )}
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-2xl font-black text-blue-700">{fmt(product.price)}</span>
              {product.origPrice && (
                <span className="text-sm line-through text-gray-400">{fmt(product.origPrice)}</span>
              )}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              ⭐ {product.rating} · Terjual {product.totalSold.toLocaleString('id-ID')}
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="font-semibold">{product.seller?.name}</p>
              <p className="text-sm text-gray-500">{product.seller?.city}</p>
            </div>
            {product.description && (
              <p className="text-sm text-gray-600 mb-6">{product.description}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gray-100 hover:bg-gray-200 font-semibold py-3 rounded-xl transition">
                🛒 Keranjang
              </button>
              <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition">
                ⚡ Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-lg mb-4">Ulasan ({product.reviews.length})</h2>
          {product.reviews.map((r: any) => (
            <div key={r.id} className="border-b last:border-0 py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm">{r.user?.name}</span>
                <span className="text-yellow-500">{'⭐'.repeat(r.rating)}</span>
              </div>
              {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
