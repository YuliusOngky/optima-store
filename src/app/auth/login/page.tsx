'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn, signInWithGoogle } from '@/lib/auth';

export default function LoginPage() {
  const params = useSearchParams();
  const next = params.get('next') ?? '/dashboard';
  const errorParam = params.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(errorParam ? 'Terjadi kesalahan autentikasi. Coba lagi.' : '');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      window.location.href = next;
    } catch (err: any) {
      setError(err.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

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
          <h1 className="text-xl font-black mb-1">Masuk ke Akun</h1>
          <p className="text-sm text-gray-500 mb-6">Belum punya akun? <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">Daftar gratis</Link></p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Google SSO */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:bg-gray-50 py-3 rounded-xl font-semibold text-sm transition mb-4 disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Masuk dengan Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">atau dengan email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="text-right mt-1">
                <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">Lupa password?</Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Memproses...' : 'Masuk →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Dengan masuk, kamu setuju dengan{' '}
          <a href="#" className="underline">Syarat & Ketentuan</a> dan{' '}
          <a href="#" className="underline">Kebijakan Privasi</a> Optima Store.
        </p>
      </div>
    </div>
  );
}
