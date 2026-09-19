# Phase 3 — Frontend Auth Dependencies

Jalankan di folder `optima-store`:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Tambahkan variabel berikut ke `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Setup Google OAuth di Supabase
1. Buka Supabase Dashboard → Authentication → Providers → Google
2. Enable Google, isi Client ID & Client Secret dari Google Cloud Console
3. Tambahkan redirect URL: `https://[ref].supabase.co/auth/v1/callback`

### Wrap layout dengan AuthProvider
Di `src/app/layout.tsx`, wrap children dengan `<AuthProvider>`:
```tsx
import AuthProvider from '@/components/auth/AuthProvider';
// ...
<AuthProvider>{children}</AuthProvider>
```
