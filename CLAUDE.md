# CLAUDE.md — Optima Store
> Project brief untuk Claude di Cursor. Baca file ini sebelum memulai task apapun.

## Gambaran Proyek
**Optima Store** adalah platform e-commerce multi-vendor demo milik **PT Optima Digital Selaras**.
Saat ini berbentuk single-file HTML (`marketplace-v2.html`) yang akan dimigrasi ke full-stack web app.

- **Owner:** Yulius Ongky (yuliusongky@gmail.com)
- **Live Artifact:** https://claude.ai/artifact/URZFbyogjkLzhyJno57CkV
- **Repo target:** https://github.com/YuliusOngky (buat repo baru: `optima-store`)

---

## Status Saat Ini (V19 — Single HTML)
File `marketplace-v2.html` sudah berisi:
- ✅ Hero banner slider (3 hero + 2 side) dengan foto produk real (base64)
- ✅ Flash Sale horizontal scroll dengan foto produk real
- ✅ Product grid 53 produk (6 kategori) dengan foto real
- ✅ Cart drawer (add/remove/qty)
- ✅ Seller profiles & modal
- ✅ Admin panel (banner CRUD, toggle aktif/non-aktif)
- ✅ Dark mode (auto + manual toggle)
- ✅ Responsive mobile (≤700px)
- ✅ Category filter + search + sort

**Teknologi saat ini:** Vanilla HTML/CSS/JS, semua inline, no build tool, no backend.

---

## Roadmap Fase

| Fase | Fokus | Status |
|------|-------|--------|
| [Phase 1](docs/PHASE-1.md) | Frontend Foundation (polish + refactor) | 🔄 Aktif |
| [Phase 2](docs/PHASE-2.md) | Backend + Database | ⏳ Planned |
| [Phase 3](docs/PHASE-3.md) | Auth + User Management | ⏳ Planned |
| [Phase 4](docs/PHASE-4.md) | Transaksi + Payment | ⏳ Planned |
| [Phase 5](docs/PHASE-5.md) | Seller Dashboard | ⏳ Planned |
| [Phase 6](docs/PHASE-6.md) | Scale + Mobile | ⏳ Planned |

---

## Arsitektur Target (Phase 2+)

```
optima-store/
├── frontend/          # Next.js 14 (App Router)
│   ├── app/
│   ├── components/
│   └── public/
├── backend/           # NestJS
│   ├── src/
│   │   ├── products/
│   │   ├── sellers/
│   │   ├── orders/
│   │   └── auth/
│   └── prisma/
├── docs/              # File PHASE-*.md ini
└── CLAUDE.md
```

## Stack Target

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS, shadcn/ui |
| Backend | NestJS + Prisma ORM |
| Database | PostgreSQL (Supabase) |
| Auth | NextAuth.js / Supabase Auth |
| Payment | Midtrans |
| Storage | Supabase Storage (foto produk) |
| Deploy | Vercel (frontend) + Railway/Supabase (backend) |

---

## Konvensi Kode
- Bahasa komentar: **Indonesia**
- Nama variabel/fungsi: **camelCase English**
- Komponen React: **PascalCase**
- CSS: **Tailwind utility classes** (no custom CSS kecuali terpaksa)
- Commit message: `[Phase-X] feat: deskripsi singkat`

---

## Referensi Desain
- Warna primary: `#1D4ED8` (biru)
- Accent: `#F59E0B` (amber)
- Danger/harga: `#EF4444` (merah — seperti Tokopedia)
- Font: Plus Jakarta Sans
- Border radius: 12px (card), 8px (button), 14px (product card)

---

## File Penting
- `marketplace-v2.html` — source of truth UI saat ini (V19)
- `docs/PHASE-*.md` — detail task per fase
