import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Optima Store — Belanja Online Terpercaya',
  description: 'Platform e-commerce multi-vendor terbaik Indonesia. Ribuan produk dari seller terpercaya.',
  keywords: ['belanja online', 'marketplace', 'e-commerce', 'optima store'],
  openGraph: {
    title: 'Optima Store',
    description: 'Platform e-commerce multi-vendor terbaik Indonesia',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        {/* Midtrans Snap.js — ganti ke production URL saat go-live */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
