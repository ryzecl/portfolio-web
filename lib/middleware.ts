// lib/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Teruskan header x-pathname ke Server Components / Layouts
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 1. Inisialisasi Supabase Server Client khusus middleware
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      return NextResponse.redirect(redirectUrl);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 2. Ambil data user yang sedang login dari cookie sesi
  // PENTING: Gunakan getUser() alih-alih getSession() untuk validasi keamanan server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAccessingAdmin = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  // 3. Skenario A: Mencoba masuk ke /admin/* tanpa login -> Lempar ke /admin/login
  if (isAccessingAdmin && !isLoginPage && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin/login';
    // Simpan rute asal agar setelah login bisa langsung diarahkan kembali
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Skenario B: Sudah login tapi iseng buka /admin/login -> Lempar ke dashboard /admin
  if (isLoginPage && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin';
    return NextResponse.redirect(redirectUrl);
  }

  // 5. Kembalikan response yang sudah tersinkronisasi cookie-nya
  return supabaseResponse;
}
