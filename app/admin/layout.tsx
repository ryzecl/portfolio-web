// app/admin/layout.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/server';
import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { AdminHeaderBreadcrumb } from '@/components/admin/admin-header-breadcrumb';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Toaster } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cek apakah request ditujukan untuk rute login (/admin/login)
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '';
  const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login');

  // Halaman login TIDAK membutuhkan verifikasi autentikasi ataupun sidebar shell
  // Ini mencegah terjadinya infinite redirect loop (ERR_TOO_MANY_REDIRECTS)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 1. Verifikasi User di Sisi Server untuk rute admin dashboard
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
    avatar: user.user_metadata?.avatar_url || '/images/ferry.png',
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
            <AdminHeaderBreadcrumb />
          </div>

          {/* Quick Actions: Theme Toggle & Live Portfolio */}
          <div className="flex items-center gap-2">
            <ThemeToggle className="size-8 rounded-lg" />
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-border bg-surface text-muted hover:text-foreground hover:border-accent/40 transition-colors shadow-2xs"
            >
              <span>Live Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* 4. Canvas Halaman Admin */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
