export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🛍️</span>
            <div>
              <div className="text-white font-black text-lg leading-none">Optima Store</div>
              <div className="text-gray-500 text-xs">Platform E-Commerce Multi-Vendor</div>
            </div>
          </div>
          <p className="text-sm text-gray-400">PT Optima Digital Selaras</p>
          <p className="text-sm text-gray-400">Jakarta, Indonesia</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Layanan</h4>
          <ul className="space-y-2 text-sm">
            {['Jual di Optima', 'Optima Mall', 'Optima Bisnis', 'Optima Logistik'].map(l => (
              <li key={l}><a href="#" className="hover:text-white transition">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Bantuan</h4>
          <ul className="space-y-2 text-sm">
            {['Pusat Bantuan', 'Cara Berbelanja', 'Cara Berjualan', 'Kebijakan Privasi'].map(l => (
              <li key={l}><a href="#" className="hover:text-white transition">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Metode Pembayaran</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {['💳 VISA', '💳 Mastercard', '🟢 GoPay', '🔵 OVO', '⬛ QRIS'].map(m => (
              <span key={m} className="bg-gray-800 text-xs px-2 py-1 rounded">{m}</span>
            ))}
          </div>
          <h4 className="text-white font-bold mb-3 mt-4">Ekspedisi</h4>
          <div className="flex flex-wrap gap-2">
            {['JNE', 'J&T', 'SiCepat', 'Anteraja'].map(e => (
              <span key={e} className="bg-gray-800 text-xs px-2 py-1 rounded">{e}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 px-4 py-4 text-center text-xs text-gray-500">
        © 2024 PT Optima Digital Selaras. All rights reserved.
      </div>
    </footer>
  );
}
