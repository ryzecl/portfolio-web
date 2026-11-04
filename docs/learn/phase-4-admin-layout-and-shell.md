# Fase 4: Shell Layout Dashboard Shadcn UI (`sidebar-07`) & Route Groups

Dokumen ini adalah panduan arsitektur mendalam untuk **Fase 4**. Anda akan memisahkan **tampilan publik** dari **tampilan admin dashboard** menggunakan fitur **Route Groups** di Next.js App Router, serta membangun kerangka navigasi modern menggunakan blok resmi **Shadcn UI `sidebar-07`** dengan runtime **Bun**, lengkap dengan kode produksi dan **tautan prioritas ke dokumentasi resmi Next.js**.

---

## 📑 Daftar Isi
1. [Masalah Root Layout Saat Ini & Mengapa Butuh Route Groups](#1-masalah-root-layout-saat-ini--mengapa-butuh-route-groups)
2. [Konsep Route Groups: Folder Berkurung `(folder)`](#2-konsep-route-groups-folder-berkurung-folder)
3. [Perbandingan Struktur Direktori (Sebelum vs Sesudah)](#3-perbandingan-struktur-direktori-sebelum-vs-sesudah)
4. [Mengenal Shadcn Block `sidebar-07` & Cara Install dengan Bun](#4-mengenal-shadcn-block-sidebar-07--cara-install-dengan-bun)
5. [Anatomi Dashboard Shell: Server vs Client Components](#5-anatomi-dashboard-shell-server-vs-client-components)
6. [Langkah 1: Menyiapkan Root Layout Bersih (`app/layout.tsx`)](#langkah-1-menyiapkan-root-layout-bersih-applayouttsx)
7. [Langkah 2: Membungkus Halaman Publik ke dalam `app/(public)/layout.tsx`](#langkah-2-membungkus-halaman-publik-ke-dalam-apppubliclayouttsx)
8. [Langkah 3: Membangun Admin Dashboard Layout (`app/admin/layout.tsx`)](#langkah-3-membangun-admin-dashboard-layout-appadminlayouttsx)
9. [Langkah 4: Konfigurasi Sidebar Utama (`components/app-sidebar.tsx`)](#langkah-4-konfigurasi-sidebar-utama-componentsapp-sidebartsx)
10. [Langkah 5: Brand Switcher (`components/team-switcher.tsx`)](#langkah-5-brand-switcher-componentsteam-switchertsx)
11. [Langkah 6: Navigasi Menu CRUD (`components/nav-main.tsx`)](#langkah-6-navigasi-menu-crud-componentsnav-maintsx)
12. [Langkah 7: Profil Admin & Tombol Logout Server Action (`components/nav-user.tsx`)](#langkah-7-profil-admin--tombol-logout-server-action-componentsnav-usertsx)
13. [Langkah 8: Halaman Dashboard Overview (`app/admin/page.tsx`)](#langkah-8-halaman-dashboard-overview-appadminpagetsx)
14. [Daftar Referensi Dokumentasi Resmi](#14-daftar-referensi-dokumentasi-resmi)
15. [Checklist Mandiri & Cara Memanggil `/pantau`](#15-checklist-mandiri--cara-memanggil-pantau)

---

## 1. Masalah Root Layout Saat Ini & Mengapa Butuh Route Groups

> 📖 **Dokumentasi Resmi Next.js**:  
> [Next.js Routing: Pages and Layouts Overview](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)

Mari kita lihat berkas [`app/layout.tsx`](file:///C:/Users/ferry/Documents/coding/web-porto-profesional/app/layout.tsx) yang ada saat ini:

```tsx
// app/layout.tsx (Kondisi Saat Ini)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PagePreloader brandName="FNH ." />
        <SiteHeader site={site} />  {/* ⚠️ Floating Navbar Publik */}
        <main>{children}</main>
        <SiteFooter site={site} />  {/* ⚠️ Footer Publik */}
      </body>
    </html>
  );
}
```

### Masalahnya:
Di Next.js App Router, setiap rute anak (misal: `/projects`, `/credentials`, `/contact`, maupun `/admin`) **secara otomatis mewarisi `app/layout.tsx`**.  
Jika Anda membuka `/admin`, maka **`SiteHeader` (navbar floating publik) dan `SiteFooter` publik akan tetap muncul menimpa dashboard admin!** Ini merusak tata letak dashboard dan membuat admin shell terasa janggal.

---

## 2. Konsep Route Groups: Folder Berkurung `(folder)`

> 📖 **Dokumentasi Resmi Next.js**:  
> [Next.js Routing: Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)

Next.js menyediakan fitur arsitektur bernama **Route Groups**. Folder yang dinamai dengan tanda kurung (seperti `(public)` atau `(dashboard)`) memiliki 2 karakteristik utama:

1. **Nama Foldernya Dihilangkan dari URL (URL Omission)**:
   - File di `app/(public)/projects/page.tsx` URL-nya tetap **`/projects`**, bukan `/(public)/projects`.
   - File di `app/(public)/contact/page.tsx` URL-nya tetap **`/contact`**.
2. **Isolasi Layout (Opt-in Multiple Root/Nested Layouts)**:
   - Anda bisa membuat `app/(public)/layout.tsx` yang hanya membungkus halaman portofolio pengunjung (dengan `SiteHeader`, `SiteFooter`, dan `PagePreloader`).
   - Anda membuat `app/admin/layout.tsx` yang murni membungkus panel dashboard admin (dengan sidebar interaktif, header CMS, dan proteksi sesi).
   - Keduanya hidup berdampingan secara terisolasi tanpa saling mengintervensi!

---

## 3. Perbandingan Struktur Direktori (Sebelum vs Sesudah)

```text
SEBELUM (Layout Publik Menimpa Admin):
app/
├── layout.tsx                <-- Berisi SiteHeader & SiteFooter publik
├── page.tsx                  <-- Halaman Home (/)
├── projects/page.tsx         <-- /projects
├── credentials/page.tsx      <-- /credentials
└── contact/page.tsx          <-- /contact

SESUDAH (Route Groups Terorganisir & Bersih):
app/
├── layout.tsx                <-- ROOT: Murni <html>, <body>, Google Font, dan Theme Provider
│
├── (public)/                 <-- ROUTE GROUP PUBLIK (Tidak mengubah URL publik)
│   ├── layout.tsx            <-- Layout Khusus Publik (SiteHeader, SiteFooter, Preloader)
│   ├── page.tsx              <-- Halaman Home (/)
│   ├── projects/             <-- /projects dan /projects/[slug]
│   ├── credentials/          <-- /credentials
│   └── contact/              <-- /contact
│
└── admin/                    <-- KAWASAN ADMIN TERTUTUP (/admin/*)
    ├── layout.tsx            <-- Layout Dashboard Shell (Sidebar, Topbar, No public navbar!)
    ├── page.tsx              <-- Dashboard Overview (/admin)
    ├── login/page.tsx        <-- Halaman Login (/admin/login)
    ├── projects/page.tsx     <-- Manajemen Proyek (/admin/projects)
    ├── tech-stack/page.tsx   <-- Manajemen Teknologi (/admin/tech-stack)
    ├── certificates/page.tsx <-- Manajemen Sertifikat (/admin/certificates)
    └── settings/page.tsx     <-- Pengaturan Web (/admin/settings)
```

---

## 4. Mengenal Shadcn Block `sidebar-07` & Cara Install dengan Bun

> 📖 **Dokumentasi Resmi Shadcn UI**:  
> - [Shadcn UI: Blocks Overview & Preview](https://ui.shadcn.com/blocks)  
> - [Shadcn UI: Sidebar Component Guide](https://ui.shadcn.com/docs/components/sidebar)

Blok **`sidebar-07`** adalah salah satu varian sidebar terlengkap dan paling fleksibel di ekosistem Shadcn UI:
- **`SidebarProvider`**: Pengatur state responsif otomatis (desktop, tablet, mobile sheet).
- **`AppSidebar`**: Kontainer navigasi yang mendukung mode *collapsible* (dapat diciutkan menjadi deretan ikon).
- **`TeamSwitcher`**: Dropdown di header sidebar untuk memilih workspace / status identitas brand CMS.
- **`NavMain`**: Navigasi berjenjang untuk menu-menu data portofolio.
- **`NavUser`**: Kartu avatar admin di footer sidebar dengan popup menu untuk edit profil dan aksi **Logout**.
- **`SidebarRail`**: Batas drag/klik untuk memperluas atau menciutkan sidebar dengan transisi mulus.

Jalankan perintah ini di terminal proyek menggunakan **Bun**:

```bash
bun x --bun shadcn@latest add sidebar-07
```

> [!NOTE]
> Perintah di atas secara otomatis memasang:
> - Komponen UI: `sidebar.tsx`, `avatar.tsx`, `dropdown-menu.tsx`, `collapsible.tsx`, `skeleton.tsx`, `tooltip.tsx`, `sheet.tsx`.
> - Hook utilitas: `hooks/use-mobile.ts`.
> - Blok perakitan: `components/app-sidebar.tsx`, `components/team-switcher.tsx`, `components/nav-main.tsx`, `components/nav-projects.tsx`, `components/nav-user.tsx`.
> - Menambahkan 16 variabel CSS sidebar ke dalam `app/globals.css`.

---

## 5. Anatomi Dashboard Shell: Server vs Client Components

> 📖 **Dokumentasi Resmi Next.js**:  
> [Next.js Composition Patterns: Server & Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

| Berkas Komponen | Tipe | Alasan Teknis & Tanggung Jawab |
| :--- | :--- | :--- |
| **`app/admin/layout.tsx`** | **Server Component** | Mengambil data sesi pengguna admin langsung di server (`supabase.auth.getUser()`) tanpa *client-side fetching* atau loading layout berkedip. Menolak render jika user tidak valid. |
| **`components/app-sidebar.tsx`** | **Client Component (`'use client'`)** | Memanfaatkan hook `useSidebar()` dari Shadcn UI untuk mengontrol status buka/tutup dan transisi animasi. |
| **`components/nav-main.tsx`** | **Client Component (`'use client'`)** | Menggunakan `usePathname()` untuk membaca URL aktif dan memberi highlight warna biru kobalt (`bg-accent/10 text-accent font-medium`) pada rute yang sedang aktif. |
| **`components/nav-user.tsx`** | **Client Component (`'use client'`)** | Menangani dropdown menu Radix UI dan tombol form logout yang memicu Server Action `logoutAction()`. |

---

## 6. Langkah 1: Mempertahankan Metadata & Schema di Root Layout (`app/layout.tsx`)

> 📖 **Dokumentasi Resmi Next.js**:  
> - [Next.js Root Layout Requirements](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required)  
> - [Next.js Metadata Inheritance & Merging](https://nextjs.org/docs/app/building-your-application/optimizing/metadata#inheritance)

Berkas [`app/layout.tsx`](file:///C:/Users/ferry/Documents/coding/web-porto-profesional/app/layout.tsx) portofolio Anda **sudah sangat matang (mature)** dengan:
- Konfigurasi `viewport` (theme-color `#2563eb`).
- `generateMetadata()` lengkap (OpenGraph, Twitter card, favicon, keywords, canonical URL).
- Google Search Schema `JsonLd` (Person & WebSite).
- Font `Plus_Jakarta_Sans` bawaan proyek.

**Kita TIDAK boleh membuang atau menghapus setup matang tersebut!**  
Prinsip Next.js App Router:
- Root Layout adalah tempat **HTML Shell (`<html>`, `<body>`), Font Global, Metadata Default, dan Schema Global**.
- Satu-satunya yang **dipindahkan** dari `app/layout.tsx` hanyalah **komponen visual antarmuka publik**, yaitu:
  1. `<PagePreloader />` (agar tidak memicu animasi preloader setiap admin berpindah halaman di dashboard).
  2. `<SiteHeader />` (navbar floating publik).
  3. `<SiteFooter />` (footer copyright publik).

Berikut isi [`app/layout.tsx`](file:///C:/Users/ferry/Documents/coding/web-porto-profesional/app/layout.tsx) yang disempurnakan (seluruh metadata, schema, dan font tetap 100% aman):

```tsx
// app/layout.tsx (Metadata & Schema 100% Terjaga)
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { getSiteData } from '@/lib/data';
import { JsonLd } from '@/components/ui/json-ld';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteData();
  const baseUrl = `https://${site.identity.domain}`;
  const title = `${site.identity.name} — Software Developer & Information Systems Student`;
  const description = site.hero.description;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s · ${site.identity.name}`,
    },
    description,
    authors: [{ name: site.identity.name, url: baseUrl }],
    creator: site.identity.name,
    publisher: site.identity.name,
    keywords: [
      site.identity.name,
      'Ferry Noer Hendriawan',
      'Ferry Hendriawan',
      'Ferry N. Hendriawan',
      'ferryhendriawan',
      'ferryhendriawan.my.id',
      'software developer',
      'web developer',
      'full-stack developer',
      'information systems',
      'Next.js',
      'Laravel',
      'Indonesia',
      'portfolio',
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: site.identity.name,
      type: 'website',
      locale: 'en_US',
      alternateLocale: ['id_ID'],
      images: [
        {
          url: `${baseUrl}/images/og-image.png`,
          secureUrl: `${baseUrl}/images/og-image.png`,
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: `${site.identity.name} — Software Developer & Information Systems`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/images/og-image.png`],
      creator: '@ryzecl',
      site: '@ryzecl',
    },
    alternates: {
      canonical: baseUrl,
    },
    other: {
      'theme-color': '#2563eb',
      'msapplication-TileColor': '#2563eb',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = getSiteData();
  const baseUrl = `https://${site.identity.domain}`;

  const structuredSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: site.identity.name,
      alternateName: [
        'Ferry Hendriawan',
        'Ferry N. Hendriawan',
      ],
      url: baseUrl,
      image: `${baseUrl}/images/ferry.png`,
      jobTitle: site.identity.title,
      description: site.hero.description,
      knowsAbout: [
        'Full-Stack Web Development',
        'Next.js',
        'TypeScript',
        'React',
        'Laravel',
        'REST API',
        'Database Design',
        'Information Systems',
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'ID',
        addressRegion: site.identity.location,
      },
      sameAs: [
        site.contact.github,
        site.contact.linkedin,
      ].filter(Boolean),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.identity.name,
      url: baseUrl,
      description: site.hero.description,
      inLanguage: 'en-US',
      author: {
        '@type': 'Person',
        name: site.identity.name,
      },
    },
  ];

  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans bg-background text-foreground min-h-screen selection:bg-accent selection:text-white antialiased">
        {/* Schema JSON-LD tetap aktif untuk seluruh website */}
        {structuredSchemas.map((schema, i) => (
          <JsonLd key={i} data={schema} />
        ))}
        {/* Konten halaman dirender di sini tanpa navbar/footer publik menimpa dashboard */}
        {children}
      </body>
    </html>
  );
}
```

---

## 7. Langkah 2: Membungkus Halaman Publik ke dalam `app/(public)/layout.tsx`

Buat folder `app/(public)/` lalu pindahkan file publik (`page.tsx`, folder `projects`, `credentials`, `contact`) ke dalamnya.  
Buat file baru di `app/(public)/layout.tsx`:

```tsx
// app/(public)/layout.tsx
import React from 'react';
import { getSiteData } from '@/lib/data';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { PagePreloader } from '@/components/ui/page-preloader';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = getSiteData();

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Preloader Pembuka */}
      <PagePreloader brandName="FNH ." />

      {/* Floating Header Publik */}
      <SiteHeader site={site} />

      {/* Konten Utama Publik */}
      <main className="flex-1">{children}</main>

      {/* Footer Publik */}
      <SiteFooter site={site} />
    </div>
  );
}
```

---

## 8. Langkah 3: Membangun Admin Dashboard Layout (`app/admin/layout.tsx`)

> 📖 **Dokumentasi Resmi Shadcn UI**:  
> [Shadcn UI: Sidebar Layout Example](https://ui.shadcn.com/docs/components/sidebar#inset)

Layout ini menggunakan komponen `SidebarProvider`, `AppSidebar`, dan `SidebarInset` yang dihasilkan oleh blok `sidebar-07`.

Buat atau perbarui berkas di `app/admin/layout.tsx`:

```tsx
// app/admin/layout.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';
import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Verifikasi User di Sisi Server
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika belum login, redirect ke login page
  if (!user) {
    redirect('/admin/login');
  }

  const userData = {
    name: user.user_metadata?.full_name || 'Ferry N. Hendriawan',
    email: user.email || 'ferry@admin.local',
    avatar: user.user_metadata?.avatar_url || '/images/avatar.jpg',
  };

  return (
    <SidebarProvider>
      {/* 2. Sidebar Shadcn Block 07 */}
      <AppSidebar user={userData} />

      {/* 3. Inset Area Utama Dashboard */}
      <SidebarInset className="bg-background">
        {/* Topbar Header Dashboard */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/80 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-surface/50 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-muted hover:text-foreground" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin" className="font-mono text-xs">
                    CMS Control
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-mono text-xs font-semibold text-accent">
                    Workspace
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Quick Action: Buka Website Publik di Tab Baru */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-border bg-surface text-muted hover:text-foreground hover:border-accent/40 transition-colors shadow-2xs"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </header>

        {/* 4. Canvas Halaman Admin */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

---

## 9. Langkah 4: Konfigurasi Sidebar Utama (`components/app-sidebar.tsx`)

Komponen ini dirakit oleh `sidebar-07` untuk menyatukan brand switcher, navigasi menu, dan profil user.

Perbarui [`components/app-sidebar.tsx`](file:///C:/Users/ferry/Documents/coding/web-porto-profesional/components/app-sidebar.tsx):

```tsx
// components/app-sidebar.tsx
'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Cpu,
  Award,
  Briefcase,
  GraduationCap,
  Settings,
  Sparkles,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// Daftar workspace/brand portofolio
const brandData = {
  teams: [
    {
      name: 'Ferry Portfolio',
      logo: Sparkles,
      plan: 'Next.js 16 · Supabase',
    },
  ],
  navMain: [
    {
      title: 'Overview',
      url: '/admin',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Projects',
      url: '/admin/projects',
      icon: FolderKanban,
      items: [
        { title: 'All Projects', url: '/admin/projects' },
        { title: 'New Project', url: '/admin/projects/new' },
        { title: 'Categories', url: '/admin/projects/categories' },
      ],
    },
    {
      title: 'Tech Stack',
      url: '/admin/tech-stack',
      icon: Cpu,
    },
    {
      title: 'Certificates',
      url: '/admin/certificates',
      icon: Award,
    },
    {
      title: 'Experience',
      url: '/admin/experience',
      icon: Briefcase,
    },
    {
      title: 'Education',
      url: '/admin/education',
      icon: GraduationCap,
    },
    {
      title: 'Site Settings',
      url: '/admin/settings',
      icon: Settings,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r border-border/80" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={brandData.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={brandData.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
```

---

## 10. Langkah 5: Brand Switcher (`components/team-switcher.tsx`)

Sesuaikan `components/team-switcher.tsx` agar menampilkan identitas brand FNH Studio dengan elegan:

```tsx
// components/team-switcher.tsx
'use client';

import * as React from 'react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const activeTeam = teams[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-surface border border-border text-accent">
            <activeTeam.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-mono font-semibold text-foreground">
              {activeTeam.name}
            </span>
            <span className="truncate text-xs font-mono text-muted">
              {activeTeam.plan}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
```

---

## 11. Langkah 6: Navigasi Menu CRUD (`components/nav-main.tsx`)

Menu ini membaca rute aktif dengan `usePathname()` untuk menandai link yang sedang dibuka:

```tsx
// components/nav-main.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-mono text-[11px] tracking-wider uppercase text-muted/80">
        Data Management
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isItemActive =
            pathname === item.url || (item.url !== '/admin' && pathname.startsWith(item.url));

          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isItemActive}
                  className={
                    isItemActive
                      ? 'bg-accent/10 text-accent font-medium border-l-2 border-accent rounded-l-none'
                      : 'text-muted hover:text-foreground'
                  }
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible key={item.title} asChild defaultOpen={isItemActive}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isItemActive}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90 transition-transform">
                    <ChevronRight />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.url}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
```

---

## 12. Langkah 7: Profil Admin & Tombol Logout Server Action (`components/nav-user.tsx`)

Komponen ini memanfaatkan Server Action `logoutAction` dari `app/admin/actions.ts` sehingga proses sign-out berjalan tanpa API route terpisah:

```tsx
// components/nav-user.tsx
'use client';

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { logoutAction } from '@/app/admin/actions';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg font-mono text-xs bg-surface border border-border">
                  FN
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-foreground text-xs">
                  {user.name}
                </span>
                <span className="truncate text-[11px] font-mono text-muted">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-surface border-border shadow-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg text-xs font-mono">
                    FN
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-xs text-foreground">
                    {user.name}
                  </span>
                  <span className="truncate text-[11px] font-mono text-muted">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-xs font-mono cursor-pointer">
                <Sparkles className="mr-2 h-4 w-4 text-accent" />
                Supabase Connected
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs font-mono cursor-pointer">
                <BadgeCheck className="mr-2 h-4 w-4 text-accent" />
                Administrator Privileges
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {/* Logout via Server Action */}
            <form action={logoutAction}>
              <button type="submit" className="w-full">
                <DropdownMenuItem className="text-xs font-mono text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
```

---

## 13. Langkah 8: Halaman Dashboard Overview (`app/admin/page.tsx`)

Buka atau buat berkas di `app/admin/page.tsx`:

```tsx
// app/admin/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FolderKanban, Cpu, Award, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard Overview · Ferry Portfolio CMS',
};

export default function AdminOverviewPage() {
  const stats = [
    {
      title: 'Active Projects',
      count: '6',
      description: 'Featured on live portfolio',
      icon: FolderKanban,
      href: '/admin/projects',
    },
    {
      title: 'Tech Stack',
      count: '16',
      description: 'Categorized technologies',
      icon: Cpu,
      href: '/admin/tech-stack',
    },
    {
      title: 'Certificates',
      count: '8',
      description: 'Verified credentials',
      icon: Award,
      href: '/admin/certificates',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Admin Operations
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-mono">
            Welcome back, Ferry.
          </h1>
          <p className="text-sm text-muted">
            All database tables and storage buckets are synchronized with Supabase PostgreSQL.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="group">
            <Card className="bg-surface border-border transition-all duration-200 group-hover:border-accent/40 group-hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-mono text-muted uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <div className="w-8 h-8 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-foreground">
                  {stat.count}
                </div>
                <CardDescription className="text-xs text-muted flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

---

## 14. Daftar Referensi Dokumentasi Resmi

1. **Next.js Route Groups & Layouts**:
   - [Next.js Route Groups Guide](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
   - [Next.js Pages and Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
   - [Next.js Composition Patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
2. **Shadcn UI Blocks**:
   - [Shadcn UI Blocks (`sidebar-07`)](https://ui.shadcn.com/blocks)
   - [Shadcn UI Sidebar Component Documentation](https://ui.shadcn.com/docs/components/sidebar)
   - [Shadcn UI Avatar Component](https://ui.shadcn.com/docs/components/avatar)
   - [Shadcn UI Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu)
3. **Supabase Auth**:
   - [Supabase SSR Next.js Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## 15. Checklist Mandiri & Cara Memanggil `/pantau`

- [ ] Jalankan `bun run build` untuk memverifikasi bahwa isolasi layout tidak merusak rute statis.
- [ ] Buka `http://localhost:3000/` dan pastikan navbar floating publik (`SiteHeader`) tetap muncul normal di halaman publik.
- [ ] Buka `http://localhost:3000/admin` (setelah login), pastikan navbar publik **hilang sama sekali**, digantikan oleh **Sidebar Shadcn 07** yang rapi dan responsif.
- [ ] Coba klik toggle ciutkan sidebar (collapse icon) di desktop, pastikan sidebar mengecil secara halus menjadi icon rail.
- [ ] Buka di layar mobile atau inspeksi elemen ponsel, pastikan sidebar muncul sebagai Sheet geser samping (*slide-over drawer*).
- [ ] Klik avatar di pojok kiri bawah sidebar, lalu klik **Sign Out**. Pastikan sesi terhapus dan Anda diarahkan kembali ke `/admin/login`.
- [ ] Ketik `/pantau` di chat untuk berdiskusi dengan saya tentang arsitektur kode atau langkah selanjutnya!
