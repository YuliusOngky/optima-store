# Community eCommerce (Optima Store) — landing + aplikasi

**Canonical product repo** untuk marketplace multi-vendor Optima.

Claude / agent: edit di repo ini (`main`). Branch `master` di GitHub adalah prototipe HTML lama — jangan pakai.

## Struktur

| Path | Peran | Live URL |
|------|--------|----------|
| `landing/` | Landing marketing | `https://optimadigitalselaras.com/products/community-ecommerce/` |
| `src/` | Aplikasi Next.js 14 | `https://ecommerce.optimadigitalselaras.com/` (:3035) |
| `deploy/docker-compose.cap.yml` | Compose CAP (image) | container `optima-store` |
| `Dockerfile` | Build image standalone | `optima-store:latest` / `:analytics` |

## Backend

API NestJS: **https://github.com/YuliusOngky/optima-api**  
Live: `https://api.optimadigitalselaras.com/` (:3036) + Postgres `optima-db`.

Frontend memakai `NEXT_PUBLIC_API_URL` + Supabase auth.

## Deploy CAP

1. **Landing** — salin `landing/*` ke  
   `C:\deploy\optima-sites\optimadigitalselaras\products\community-ecommerce\`  
   (atau lewat `Website` / `repo-main-full` `scripts/deploy-optima-web.ps1` dengan `OPTIMA_STORE_ROOT`).
2. **App** — build image dari repo ini, tag `optima-store:latest`, jalankan compose di CAP  
   (port **3035→3000**). Tunnel: `ecommerce.optimadigitalselaras.com` (jangan ubah cloudflared tanpa persetujuan).

Corporate website hanya menautkan; sumber landing ada di sini.
