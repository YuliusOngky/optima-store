// middleware.ts — Auth middleware untuk protected routes
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Rute yang butuh login
const PROTECTED = ['/dashboard', '/checkout', '/orders', '/profile', '/seller-onboarding'];
// Rute khusus seller
const SELLER_ONLY = ['/dashboard/seller'];
// Rute khusus admin
const ADMIN_ONLY = ['/dashboard/admin'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Redirect ke login jika belum auth dan akses rute protected
  if (PROTECTED.some(p => path.startsWith(p)) && !user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', path);
    return NextResponse.redirect(loginUrl);
  }

  // Role check: seller-only routes
  if (SELLER_ONLY.some(p => path.startsWith(p))) {
    const role = user?.user_metadata?.role;
    if (role !== 'SELLER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Role check: admin-only routes
  if (ADMIN_ONLY.some(p => path.startsWith(p))) {
    const role = user?.user_metadata?.role;
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Jika sudah login dan akses halaman login/register, redirect ke dashboard
  if (user && (path === '/auth/login' || path === '/auth/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
