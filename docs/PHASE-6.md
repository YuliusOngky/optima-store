# Phase 6 — Scale + Mobile
> **Status:** ⏳ Planned  
> **Durasi estimasi:** 3–4 minggu  
> **Depends on:** Phase 5 selesai

## Tujuan
Siap production: performa, SEO, dan mobile app.

---

## Tasks

### 6.1 Performance & SEO
- [ ] Next.js Image Optimization (next/image) — replace semua `<img>`
- [ ] Lazy loading + Suspense boundaries
- [ ] ISR (Incremental Static Regeneration) untuk halaman produk
- [ ] Metadata dinamis per produk (Open Graph, Twitter Card)
- [ ] Sitemap.xml otomatis
- [ ] Core Web Vitals target: LCP < 2.5s, CLS < 0.1, FID < 100ms

### 6.2 Search Enhancement
- [ ] Full-text search via PostgreSQL `tsvector` atau Algolia
- [ ] Autocomplete suggestion (debounced)
- [ ] Filter kombinasi (multi-kategori + harga + rating)
- [ ] Halaman hasil pencarian `/search?q=...`

### 6.3 Notifikasi Real-time
- [ ] Supabase Realtime untuk order status
- [ ] Push notification (Web Push API)
- [ ] In-app notification center

### 6.4 Admin Panel Web
- [ ] `/admin` — dashboard platform
- [ ] Manage semua user & seller
- [ ] Manage banner (UI yang sudah ada di Phase 1 → migrate ke web)
- [ ] Laporan penjualan platform
- [ ] Approve/suspend seller

### 6.5 Mobile App (Flutter)
- [ ] Reuse backend API dari Phase 2–5
- [ ] Screens: Home, Search, Product Detail, Cart, Checkout, Orders, Profile
- [ ] Seller app (subset dari seller dashboard)
- [ ] Push notification via Firebase Cloud Messaging
- [ ] Konsisten dengan desain web (warna, tipografi)

### 6.6 Monitoring & Observability
- [ ] Error tracking: Sentry
- [ ] Analytics: Posthog atau Plausible
- [ ] Uptime monitoring: Better Uptime
- [ ] Database monitoring: Supabase dashboard

---

## Deliverable Phase 6
- Platform siap publik (production)
- Flutter mobile app (Android APK)
- Monitoring aktif
