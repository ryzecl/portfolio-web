# Fase 3: Panduan Lengkap Autentikasi & Proteksi Rute Admin (`/admin/login`)

Dokumen ini adalah panduan implementasi langkah-demi-langkah yang **100% lengkap dengan kode produksi**, penjelasan baris demi baris, alasan teknis di balik setiap keputusan arsitektur, serta **tautan prioritas ke dokumentasi resmi Next.js dan Supabase**.

---

## 📑 Daftar Isi
1. [Prinsip Desain & Alasan Arsitektur (The "Why")](#1-prinsip-desain--alasan-arsitektur-the-why)
2. [Server Component vs Client Component di Alur Login](#2-server-component-vs-client-component-di-alur-login)
3. [Langkah 1: Setup Akun Admin di Supabase Auth](#langkah-1-setup-akun-admin-di-supabase-auth)
4. [Langkah 2: Kode Lengkap `lib/middleware.ts` (Session & Redirect)](#langkah-2-kode-lengkap-libmiddlewarets-session--redirect)
5. [Langkah 3: Kode Lengkap Root `middleware.ts`](#langkah-3-kode-lengkap-root-middlewarets)
6. [Langkah 4: Kode Lengkap Server Actions (`app/admin/actions.ts`)](#langkah-4-kode-lengkap-server-actions-appadminactionsts)
7. [Langkah 5: Kode Lengkap Form Interaktif (`components/admin/login-form.tsx`)](#langkah-5-kode-lengkap-form-interaktif-componentsadminlogin-formtsx)
8. [Langkah 6: Kode Lengkap Halaman Login (`app/admin/login/page.tsx`)](#langkah-6-kode-lengkap-halaman-login-appadminloginpagetsx)
9. [Bedah Kode Kritis & Jebakan Umum (Gotchas)](#9-bedah-kode-kritis--jebakan-umum-gotchas)
10. [Daftar Referensi Dokumentasi Resmi](#10-daftar-referensi-dokumentasi-resmi)
11. [Checklist Pengujian Mandiri](#11-checklist-pengujian-mandiri)

---

## 1. Prinsip Desain & Alasan Arsitektur (The "Why")

### Kenapa Memilih `/admin/login` bukan `/auth`?
- **Domain Bounded**: Seluruh ekosistem admin (login, overview, projects, tech-stack) berada di bawah satu namespace URL: `/admin/*`.
- **Semantik Jujur**: Portofolio Anda tidak punya "user publik" (tidak ada pendaftaran member, Google login untuk pengunjung, atau keranjang belanja). Yang login **hanyalah Anda sendiri sebagai Administrator**.
- **Logika Middleware Bersih**: Cukup satu aturan: *"Semua yang berawalan `/admin/*` dikunci, KECUALI `/admin/login`"*.

### Kenapa Tombol Login Tidak Muncul di Navbar Publik?
- Menampilkan tombol *"Login"* di navbar portofolio memberi kesan template CMS murahan dan mengundang bot hacker untuk melakukan *brute force* tebak password.
- **Praktek Terbaik**: Disembunyikan (*Security through Obscurity*). Hanya Anda yang tahu URL login ini dengan mengetikkan langsung `/admin/login` di browser.

### Kenapa Proteksi di `middleware.ts`, Bukan di dalam `page.tsx`?
> 📖 **Dokumentasi Resmi Next.js**:  
> [Next.js Routing: Middleware Overview](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- **Jika proteksi di dalam `page.tsx`**: Browser harus mengunduh HTML/JS halaman admin terlebih dahulu, merender komponen di browser, baru kemudian mengecek sesi dan melakukan redirect. Pengunjung yang tidak sah bisa melihat "flicker" tampilan dashboard sekilas (*flash of unauthenticated content*).
- **Jika proteksi di `middleware.ts`**: Middleware berjalan di lapisan **Edge Network (sebelum request menyentuh server rendering Next.js)**. Jika tidak ada sesi login yang sah, request **langsung dicegat dan di-redirect ke `/admin/login`** tanpa pernah merender sebaris pun kode dashboard. Ini jauh lebih aman dan cepat.

---

## 2. Server Component vs Client Component di Alur Login

> 📖 **Dokumentasi Resmi Next.js**:  
> - [Next.js Rendering: Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)  
> - [Next.js Rendering: Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)  
> - [Next.js Composition Patterns: When to use Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#when-to-use-server-and-client-components)

Pemisahan tanggung jawab di halaman login ini mengikuti pola arsitektur **"Moving Client Components to the Leaves"**:

```text
[app/admin/login/page.tsx] (Server Component)
│  ├── Tidak ada JavaScript runtime tambahan yang dikirim ke browser (0kb JS bundle)
│  ├── Menetapkan metadata SEO { robots: { index: false } }
│  └── Merender kontainer statis & kartu pembungkus
│
└── [components/admin/login-form.tsx] (Client Component - 'use client')
   ├── Menangani interaktivitas: ketikan email & password
   ├── Menampilkan status tombol "Loading..." saat proses login
   └── Menampilkan pesan error reaktif jika password salah
```

---

## 3. Langkah 1: Setup Akun Admin di Supabase Auth

> 📖 **Dokumentasi Resmi Supabase**:  
> [Supabase Auth: User Management](https://supabase.com/docs/guides/auth/users)

Sebelum menulis baris kode apa pun, Anda wajib memiliki 1 akun admin di Supabase:

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) → Masuk ke project Anda.
2. Di sidebar kiri, klik icon orang 👥 (**Authentication**).
3. Klik tombol hijau **"Add user"** → pilih **"Create user"**.
4. Masukkan **Email** pribadi Anda dan **Password** yang kuat.
5. **Wajib centang "Auto Confirm User"** (agar akun langsung aktif tanpa perlu membuka link verifikasi email).
6. Klik **Create user**.

---

## 4. Langkah 2: Kode Lengkap `lib/middleware.ts` (Session & Redirect)

> 📖 **Dokumentasi Resmi Next.js & Supabase**:  
> - [Supabase SSR Guide: Next.js Middleware Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)  
> - [Next.js API Reference: NextResponse.redirect()](https://nextjs.org/docs/app/api-reference/functions/next-response#redirect)

Berkas ini bertugas membaca sesi token cookie, menyegarkannya (*refresh token*), dan mencegat akses ilegal sebelum halaman sempat dirender.

Buka dan perbarui seluruh isi berkas [`lib/middleware.ts`](file:///C:/Users/ferry/Documents/coding/web-porto-profesional/lib/middleware.ts) menjadi:

```typescript
// lib/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 1. Inisialisasi Supabase Server Client khusus middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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
            request,
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

  const pathname = request.nextUrl.pathname;
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
```

### 🔍 Penjelasan Kodingan `lib/middleware.ts`:
- **`request.nextUrl.clone()`**: Di Next.js, Anda tidak boleh langsung memodifikasi properti `request.nextUrl`. Meng-clone URL memastikan query parameter dan base host tetap utuh.
- **`supabase.auth.getUser()`**: Supabase secara resmi menyarankan `getUser()` ketimbang `getSession()` di middleware, karena `getUser()` memvalidasi ulang tanda tangan JWT ke server Supabase secara kriptografis, bukan hanya membaca isi cookie mentah di browser.

---

## 5. Langkah 3: Kode Lengkap Root `middleware.ts`

> 📖 **Dokumentasi Resmi Next.js**:  
> [Next.js Middleware: Matcher Configuration](https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher)

Next.js App Router mewajibkan berkas middleware utama berada langsung di folder root project.

Buat file baru di root: `middleware.ts`:

```typescript
// middleware.ts
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Jalankan middleware pada semua rute KECUALI:
     * - _next/static (file build JS & CSS)
     * - _next/image (optimasi gambar Next.js)
     * - favicon.ico, sitemap.xml, robots.txt
     * - File statis dengan ekstensi gambar (svg, png, jpg, webp, dll.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### 🔍 Penjelasan `matcher`:
Tanpa konfigurasi `matcher` ini, Next.js akan memanggil Supabase Auth pada **setiap kali gambar, favicon, atau berkas font diunduh browser**. Itu akan menyebabkan latensi tinggi. Regex di atas memastikan middleware hanya aktif saat pengguna mengakses halaman aplikasi.

---

## 6. Langkah 4: Kode Lengkap Server Actions (`app/admin/actions.ts`)

> 📖 **Dokumentasi Resmi Next.js**:  
> - [Next.js Data Fetching: Server Actions & Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)  
> - [Next.js API Reference: revalidatePath()](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)  
> - [Next.js API Reference: redirect()](https://nextjs.org/docs/app/api-reference/functions/redirect)

Server Actions adalah fungsi server yang dieksekusi langsung tanpa perlu membuat rute API terpisah (`route.ts`).

Buat file baru di `app/admin/actions.ts`:

```typescript
// app/admin/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';

export interface ActionResponse {
  error?: string;
  success?: boolean;
}

/**
 * Server Action untuk autentikasi login admin
 */
export async function loginAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirectTo') as string) || '/admin';

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error:
        error.message === 'Invalid login credentials'
          ? 'Email atau password yang Anda masukkan salah.'
          : error.message,
    };
  }

  // Bersihkan cache layout admin agar data user baru langsung dimuat
  revalidatePath('/admin', 'layout');

  // PENTING: Panggil redirect di luar blok penanganan error (lihat Gotcha 1)
  redirect(redirectTo);
}

/**
 * Server Action untuk proses logout admin
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  redirect('/admin/login');
}
```

### 🔍 Penjelasan Kodingan `actions.ts`:
- **`'use server'`**: Menandakan bahwa fungsi ini **hanya berjalan di lingkungan server**, tidak akan pernah bocor ke bundle JavaScript browser.
- **`createClient()` dari `@/lib/server`**: Membuat Supabase client yang otomatis menyimpan cookie session ke browser klien melalui Next.js `cookies()`.
- **`revalidatePath('/admin', 'layout')`**: Menghapus cache Server Component layout `/admin` agar Next.js langsung menyadari bahwa user sudah berstatus login.

---

## 7. Langkah 5: Kode Lengkap Form Interaktif (`components/admin/login-form.tsx`)

> 📖 **Dokumentasi Resmi React & Next.js**:  
> - [React Docs: useActionState](https://react.dev/reference/react/useActionState)  
> - [Next.js Guides: Server-side form validation with useActionState](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-side-form-validation)

Buat file baru di `components/admin/login-form.tsx`. Komponen ini menggunakan **`useActionState`** (hook standar React 19 / Next.js 15+ untuk menangani Server Action dengan status loading dan error secara reaktif):

```tsx
// components/admin/login-form.tsx
'use client';

import React, { useActionState } from 'react';
import { loginAction, ActionResponse } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = '/admin' }: LoginFormProps) {
  // useActionState mengikat Server Action dengan state error dan status pending
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    loginAction,
    null
  );

  return (
    <Card className="bg-surface border-border shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-bold text-foreground">
          Sign In
        </CardTitle>
        <CardDescription className="text-xs text-muted">
          Access the portfolio control dashboard
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          {/* Hidden input untuk menyimpan rute redirect */}
          <input type="hidden" name="redirectTo" value={redirectTo} />

          {/* Alert jika terjadi error */}
          {state?.error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-destructive/10 border border-destructive/20 text-destructive font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Input Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-mono text-muted uppercase tracking-wider block"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="ferry@example.com"
                disabled={isPending}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-surface-raised border border-border text-foreground placeholder:text-muted focus:outline-hidden focus:border-accent transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-mono text-muted uppercase tracking-wider block"
            >
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                disabled={isPending}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-surface-raised border border-border text-foreground placeholder:text-muted focus:outline-hidden focus:border-accent transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-foreground text-background font-medium text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Unlock Dashboard</span>
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
```

---

## 8. Langkah 6: Kode Lengkap Halaman Login (`app/admin/login/page.tsx`)

> 📖 **Dokumentasi Resmi Next.js**:  
> - [Next.js API Reference: generateMetadata / robots](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#robots)  
> - [Next.js Page searchParams Handling (Promise in v15+)](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional)

Buat file baru di `app/admin/login/page.tsx`:

```tsx
// app/admin/login/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/login-form';
import { DotBackground } from '@/components/ui/dot-background';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Authentication · Ferry Portfolio',
  robots: {
    index: false, // Melarang Google mengindeks halaman login ini
    follow: false,
  },
};

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  // Di Next.js 15+, searchParams adalah Promise
  const { redirectTo } = await searchParams;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background text-foreground overflow-hidden">
      {/* Background Titik Halus */}
      <DotBackground />

      <div className="w-full max-w-sm space-y-6 relative z-10">
        {/* Header Branding Minimalis */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto shadow-xs text-accent">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-mono">
            CONTROL CENTER
          </h1>
          <p className="text-xs text-muted font-mono">
            Ferry Noer Hendriawan Management System
          </p>
        </div>

        {/* Form Login */}
        <LoginForm redirectTo={redirectTo} />

        <div className="text-center">
          <p className="text-[11px] font-mono text-muted/60">
            Protected by Supabase Auth & Next.js Middleware
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 9. Bedah Kode Kritis & Jebakan Umum (Gotchas)

### ⚠️ Gotcha 1: `redirect()` di dalam Server Action
Di Next.js, fungsi `redirect()` bekerja dengan cara **melempar exception internal (`NEXT_REDIRECT`)**.  
Jika Anda meletakkan `redirect()` di dalam blok `try { ... } catch (err) { ... }`, fungsi redirect tersebut akan tertangkap sebagai error dan navigasi akan gagal.  
**Solusinya**: Panggil `redirect()` di luar blok `try-catch` seperti yang sudah kita tulis di `actions.ts`.  
*Sumber: [Next.js docs: redirect() throws an error](https://nextjs.org/docs/app/api-reference/functions/redirect#behavior)*

### ⚠️ Gotcha 2: Next.js 15+ `searchParams` adalah Promise
Di Next.js 15+, `searchParams` pada Server Component berbentuk `Promise`. Anda wajib menulis:
```tsx
const { redirectTo } = await searchParams;
```
Bukan `searchParams.redirectTo` secara synchronous.  
*Sumber: [Next.js 15 Upgrade Guide: Async Request APIs](https://nextjs.org/docs/app/building-your-application/upgrading/version-15#async-request-apis)*

---

## 10. Daftar Referensi Dokumentasi Resmi

Gunakan tautan resmi berikut sebagai rujukan utama:
- [Next.js App Router: Routing & Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js App Router: Server Actions & Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Next.js App Router: Server & Client Components Composition](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [React 19 Official Reference: useActionState](https://react.dev/reference/react/useActionState)
- [Supabase SSR Guide: Setting Up Server-Side Auth in Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Shadcn UI: Card Component](https://ui.shadcn.com/docs/components/card)

---

## 11. Checklist Pengujian Mandiri

Setelah Anda menyalin kode-kode di atas:

1. [ ] Jalankan server development: `bun run dev`.
2. [ ] Buka browser dan ketik alamat: `http://localhost:3000/admin`.
   - **Hasil yang diharapkan**: Browser otomatis dilempar ke `http://localhost:3000/admin/login?redirectTo=%2Fadmin`.
3. [ ] Coba masukkan email/password salah:
   - **Hasil yang diharapkan**: Muncul pesan error merah *"Email atau password yang Anda masukkan salah."* tanpa me-refresh seluruh halaman.
4. [ ] Masukkan email dan password admin yang benar (dari Supabase Auth):
   - **Hasil yang diharapkan**: Tombol berubah menjadi *"Authenticating..."*, lalu Anda otomatis berhasil masuk ke `/admin`.
5. [ ] Coba buka kembali `http://localhost:3000/admin/login` saat sudah login:
   - **Hasil yang diharapkan**: Middleware otomatis melempar Anda kembali ke `/admin`.

> 🧑‍💻 **Uji Sekarang!**  
> Buat berkas-berkas di atas dan coba alur loginnya. Jika sudah selesai atau ingin mengecek kode yang Anda buat, cukup ketik **`/pantau`**!
