# Phase 4 — Transaksi + Payment
> **Status:** ⏳ Planned  
> **Durasi estimasi:** 2–3 minggu  
> **Depends on:** Phase 3 selesai

## Tujuan
Order flow lengkap dari keranjang → pembayaran → konfirmasi.

---

## Tasks

### 4.1 Order Flow
- [ ] Cart persistence (database, bukan localStorage)
- [ ] Checkout: alamat pengiriman (simpan multiple alamat)
- [ ] Hitung ongkir via RajaOngkir API
- [ ] Generate order number (format: `OPT-YYYYMMDD-XXXXX`)
- [ ] Order status: `PENDING → PAID → PROCESSING → SHIPPED → DELIVERED → DONE`

### 4.2 Database
```prisma
model Order {
  id          String      @id @default(uuid())
  orderNumber String      @unique
  userId      String
  user        User        @relation(...)
  items       OrderItem[]
  totalAmount Int
  shippingFee Int
  status      OrderStatus @default(PENDING)
  paymentId   String?
  createdAt   DateTime    @default(now())
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   String
  productId Int
  quantity  Int
  price     Int     // harga saat beli (snapshot)
}

enum OrderStatus {
  PENDING PAID PROCESSING SHIPPED DELIVERED DONE CANCELLED
}
```

### 4.3 Midtrans Integration
- [ ] Daftar Midtrans Sandbox account
- [ ] Install `midtrans-client` di NestJS
- [ ] `POST /payments/create` — buat transaksi, return `snap_token`
- [ ] Midtrans Snap popup di frontend
- [ ] Webhook handler: `POST /payments/webhook` — update order status
- [ ] Test semua payment method: VA, GoPay, OVO, QRIS, Kartu Kredit

### 4.4 Halaman
- [ ] `/checkout` — form alamat + pilih kurir + payment
- [ ] `/orders` — riwayat order user
- [ ] `/orders/:id` — detail order + tracking status
- [ ] Email konfirmasi order (Resend / Nodemailer)

### 4.5 Seller Order Management
- [ ] Notifikasi order masuk (real-time via Supabase Realtime)
- [ ] Seller konfirmasi & input nomor resi
- [ ] Update status otomatis

---

## Deliverable Phase 4
- End-to-end transaksi berjalan di Sandbox
- User bisa bayar dan lihat status order
- Seller bisa konfirmasi dan update pengiriman
