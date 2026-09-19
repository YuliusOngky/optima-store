'use client';
import { useState } from 'react';
import Link from 'next/link';
import { signUp } from '@/lib/auth';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Password dan konfirmasi tidak cocok');
      return;
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, name);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-2xl font-black mb-2">Cek Email Kamu!</h1>
          <p className="text-gray-500 mb-6">
            Kami kirimkan link verifikasi ke <strong>{email}</strong>.<br />
            Klik link di email untuk mengaktifkan akun.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-blue-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-800 transition"
          >
            Kembali ke Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-4xl">🛍️</span>
            <div className="text-left">
              <div className="text-2xl font-black text-blue-700 leading-none">Optima</div>
              <div className="text-sm text-gray-400">Store</div>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h1 className="text-xl font-black mb-1">Buat Akun Baru</h1>
          <p className="text-sm text-gray-500 mb-6">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">
              Masuk sekarang
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nama kamu"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Konfirmasi Password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Ulangi password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Memproses...' : 'Daftar Sekarang →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Dengan mendaftar, kamu setuju dengan{' '}
          <a href="#" className="underline">Syarat & Ketentuan</a> dan{' '}
          <a href="#" className="underline">Kebijakan Privasi</a> Optima Store.
        </p>
      </div>
    </div>
  );
}
