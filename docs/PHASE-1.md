# Phase 1 — Frontend Foundation
> **Status:** 🔄 Aktif  
> **Durasi estimasi:** 1–2 minggu  
> **File utama:** `marketplace-v2.html`

## Tujuan
Polish dan lengkapi UI yang sudah ada sebelum migrasi ke multi-file. Semua perubahan masih di single HTML file.

---

## Tasks

### 1.1 Product Detail Modal
- [ ] Klik produk → modal slide-up (mobile) / center modal (desktop)
- [ ] Foto produk besar (pakai base64 yang sudah ada)
- [ ] Pilih varian (warna/ukuran)
- [ ] Tombol "Tambah ke Keranjang" + "Beli Sekarang"
- [ ] Rating & ulasan (mock data)
- [ ] Info toko + tombol "Kunjungi Toko"

### 1.2 Checkout Flow UI
- [ ] Step 1: Review keranjang
- [ ] Step 2: Form alamat pengiriman
- [ ] Step 3: Pilih kurir (JNE/J&T/SiCepat — mock)
- [ ] Step 4: Pilih pembayaran (Transfer/COD/VA — mock)
- [ ] Step 5: Konfirmasi order (order number generated)

### 1.3 Halaman Profil Toko (Seller Page)
- [ ] Banner toko + avatar + info
- [ ] Tab: Produk | Rating | Info
- [ ] Grid produk dari seller tersebut

### 1.4 Search & Filter Enhancement
- [ ] Search dengan debounce (300ms)
- [ ] Filter multi-kategori (checkbox)
- [ ] Filter rating minimum
- [ ] Sort: Harga Terendah / Terbaru / Terlaris

### 1.5 Notifikasi & UX Polish
- [ ] Wishlist / favorit (simpan ke localStorage)
- [ ] Recently Viewed (localStorage)
- [ ] Skeleton loading state untuk product cards
- [ ] Empty state illustrations

### 1.6 Responsive Fixes
- [ ] Test di 320px (iPhone SE)
- [ ] Test di 768px (tablet)
- [ ] Side banner di mobile: tampilkan sebagai horizontal scroll

---

## Deliverable Phase 1
- `marketplace-v2.html` yang sudah memiliki full user flow dari browse → detail → checkout
- Siap dijadikan referensi desain untuk migrasi Phase 2

---

## Cara Kerja di Cursor
```
Buka marketplace-v2.html
Ctrl+F untuk navigasi: cari "// === SECTION ===" untuk tiap bagian
```

Struktur JS di file:
- `PRODUCTS[]` — data produk (line ~600)
- `SELLERS[]` — data toko (line ~700)
- `BANNERS[]` — data banner (line ~760)
- `renderProducts()` — render grid produk
- `renderFsScroll()` — render flash sale
- `renderBanners()` — render hero + side banner
