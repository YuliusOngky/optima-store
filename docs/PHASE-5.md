# Phase 5 — Seller Dashboard
> **Status:** ⏳ Planned  
> **Durasi estimasi:** 2–3 minggu  
> **Depends on:** Phase 4 selesai

## Tujuan
Seller punya dashboard lengkap untuk manage toko, produk, dan order.

---

## Tasks

### 5.1 Dashboard Overview
- [ ] Summary: total produk, total order, pendapatan bulan ini
- [ ] Grafik penjualan 30 hari (Recharts / Chart.js)
- [ ] Order terbaru (5 terakhir)
- [ ] Produk stok menipis (< 5 unit)

### 5.2 Manajemen Produk
- [ ] List produk dengan search + filter status (aktif/nonaktif)
- [ ] Form tambah produk:
  - Nama, deskripsi, kategori
  - Upload foto (multiple, drag & drop) → Supabase Storage
  - Harga, harga coret, diskon
  - Stok, berat, dimensi
  - Varian (warna/ukuran — optional)
- [ ] Edit produk
- [ ] Nonaktifkan/hapus produk
- [ ] Bulk action (nonaktifkan/hapus multiple)

### 5.3 Manajemen Order
- [ ] List order dengan filter status
- [ ] Detail order: info pembeli, produk, alamat kirim
- [ ] Input nomor resi + kurir
- [ ] Cetak label pengiriman (PDF)
- [ ] Notifikasi order baru (toast + badge)

### 5.4 Keuangan
- [ ] Saldo toko (mock: pendapatan - fee platform 2%)
- [ ] Riwayat transaksi
- [ ] Withdraw request (mock)

### 5.5 Pengaturan Toko
- [ ] Edit profil toko (nama, kota, deskripsi, foto banner, foto profil)
- [ ] Jam operasional
- [ ] Kebijakan toko (estimasi kirim, retur)

### 5.6 Review & Rating
- [ ] Lihat semua ulasan produk
- [ ] Balas ulasan pembeli

---

## Deliverable Phase 5
- Seller dashboard production-ready
- Seller bisa kelola toko secara mandiri tanpa admin
