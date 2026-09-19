'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: unknown) => void;
        onPending: (result: unknown) => void;
        onError: (result: unknown) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'pending' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('snapToken');
    const id = sessionStorage.getItem('orderId');
    setOrderId(id);

    if (!token) {
      router.replace('/cart');
      return;
    }

    // Wait for Snap.js to load
    const trySnap = (retries = 10) => {
      if (window.snap) {
        setStatus('loading');
        window.snap.pay(token, {
          onSuccess: () => {
            sessionStorage.removeItem('snapToken');
            sessionStorage.removeItem('orderId');
            setStatus('success');
            setMessage('Pembayaran berhasil! Pesananmu sedang diproses.');
          },
          onPending: () => {
            setStatus('pending');
            setMessage('Menunggu konfirmasi pembayaran...');
          },
          onError: () => {
            setStatus('error');
            setMessage('Pembayaran gagal. Silakan coba lagi.');
          },
          onClose: () => {
            if (status === 'idle' || status === 'loading') {
              setStatus('pending');
              setMessage('Kamu menutup halaman pembayaran. Cek status pesanan di halaman Pesanan.');
            }
          },
        });
      } else if (retries > 0) {
        setTimeout(() => trySnap(retries - 1), 500);
      } else {
        setStatus('error');
        setMessage('Gagal memuat Snap.js. Refresh halaman dan coba lagi.');
      }
    };
    trySnap();
  }, [router]);

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-black mb-2 text-green-600">Pembayaran Berhasil!</h1>
        <p className="text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Link href="/orders" className="bg-blue-700 text-white font-bold px-6 py-3 rounded-xl">Lihat Pesanan</Link>
          <Link href="/" className="border border-gray-300 font-bold px-6 py-3 rounded-xl">Belanja Lagi</Link>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-black mb-2 text-red-600">Pembayaran Gagal</h1>
        <p className="text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          {orderId && <Link href={`/orders/${orderId}`} className="bg-blue-700 text-white font-bold px-6 py-3 rounded-xl">Coba Bayar Lagi</Link>}
          <Link href="/" className="border border-gray-300 font-bold px-6 py-3 rounded-xl">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-black mb-2 text-yellow-600">Menunggu Pembayaran</h1>
        <p className="text-gray-500 mb-6">{message}</p>
        <Link href="/orders" className="bg-blue-700 text-white font-bold px-6 py-3 rounded-xl">Cek Status Pesanan</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-4xl mb-4 animate-spin">⚙️</div>
      <p className="text-gray-500">Memuat halaman pembayaran...</p>
    </div>
  );
}
