# Phase 3 — Auth + User Management
> **Status:** ⏳ Planned  
> **Durasi estimasi:** 1–2 minggu  
> **Depends on:** Phase 2 selesai

## Tujuan
Login/register pembeli dan seller. Role-based access.

---

## Tasks

### 3.1 Auth Setup
- [ ] Supabase Auth (email/password + Google OAuth)
- [ ] NextAuth.js adapter untuk Next.js
- [ ] JWT refresh token strategy di NestJS
- [ ] Protected routes middleware

### 3.2 User Roles
```
BUYER    → browse, cart, checkout, order history, ulasan
SELLER   → semua BUYER + seller dashboard, manage produk
ADMIN    → semua + manage banner, manage user
```

### 3.3 Halaman Auth
- [ ] `/login` — form login (email/pw + Google)
- [ ] `/register` — form register + pilih role (pembeli/seller)
- [ ] `/forgot-password` — reset via email
- [ ] Profile page (`/profile`) — edit data, foto profil

### 3.4 Seller Onboarding
- [ ] Form registrasi toko (nama, kota, kategori utama, foto banner)
- [ ] Upload foto profil toko ke Supabase Storage
- [ ] Verifikasi toko (admin approval — simple toggle)

### 3.5 Database Tambahan
```prisma
model User {
  id       String  @id @default(uuid())
  email    String  @unique
  name     String
  role     Role    @default(BUYER)
  sellerId Int?
  seller   Seller? @relation(fields: [sellerId], references: [id])
}

enum Role {
  BUYER
  SELLER
  ADMIN
}
```

---

## Deliverable Phase 3
- User bisa register, login, logout
- Seller bisa onboard dan punya dashboard dasar
- Admin bisa manage user via panel
