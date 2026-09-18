# Phase 2 — Backend + Database
> **Status:** ⏳ Planned (mulai setelah Phase 1 selesai)  
> **Durasi estimasi:** 2–3 minggu

## Tujuan
Migrasi dari single HTML ke full-stack app. Semua data mock di-replace dengan API nyata.

---

## Stack
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** NestJS + Prisma ORM
- **Database:** PostgreSQL via Supabase
- **Storage:** Supabase Storage (foto produk)

---

## Tasks

### 2.1 Setup Project Structure
- [ ] Init Next.js 14: `npx create-next-app@latest optima-store --typescript --tailwind --app`
- [ ] Init NestJS: `nest new optima-store-api`
- [ ] Setup Prisma + koneksi Supabase PostgreSQL
- [ ] Setup Supabase Storage bucket `product-images`

### 2.2 Database Schema (Prisma)
```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  price       Int
  originalPrice Int?
  discount    Int?
  category    String
  sellerId    Int
  seller      Seller   @relation(fields: [sellerId], references: [id])
  images      ProductImage[]
  stock       Int      @default(0)
  rating      Float    @default(0)
  soldCount   Int      @default(0)
  createdAt   DateTime @default(now())
}

model Seller {
  id       Int       @id @default(autoincrement())
  name     String
  city     String
  rating   Float
  products Product[]
}

model Banner {
  id       Int     @id @default(autoincrement())
  type     String  // "hero" | "side"
  title    String
  subtitle String?
  discount Int?
  bgColor  String
  productId Int?
  active   Boolean @default(true)
  order    Int     @default(0)
}
```

### 2.3 API Endpoints (NestJS)
- [ ] `GET /products` — list dengan filter & pagination
- [ ] `GET /products/:id` — detail produk
- [ ] `GET /sellers` — list toko
- [ ] `GET /sellers/:id` — profil toko + produk
- [ ] `GET /banners` — list banner aktif
- [ ] `POST /banners` — tambah banner (admin)
- [ ] `PATCH /banners/:id` — edit banner (admin)
- [ ] `DELETE /banners/:id` — hapus banner (admin)

### 2.4 Frontend Migration
- [ ] Buat komponen dari `marketplace-v2.html` ke React components
- [ ] `<HeroSlider>` — banner slider
- [ ] `<ProductGrid>` — grid produk
- [ ] `<FlashSaleScroll>` — flash sale horizontal
- [ ] `<CartDrawer>` — cart drawer
- [ ] Fetch data dari API (react-query / SWR)
- [ ] Upload foto produk ke Supabase Storage (replace base64)

### 2.5 Seed Data
- [ ] Migrate 53 produk mock → database
- [ ] Upload 53 foto produk → Supabase Storage
- [ ] Migrate seller data
- [ ] Migrate banner data

---

## Deliverable Phase 2
- Next.js app yang fetch data dari NestJS API
- Supabase DB + Storage running
- Deployment: Vercel (frontend) + Railway (backend)
