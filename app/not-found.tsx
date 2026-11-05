// app/not-found.tsx
import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/server';
import { Button } from '@/components/ui/button';
import { DotBackground } from '@/components/ui/dot-background';
import {
  ArrowLeft,
  LayoutDashboard,
  FolderKanban,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export default async function NotFound() {
  let isAdmin = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isAdmin = Boolean(user);
  } catch {
    isAdmin = false;
  }

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-background text-foreground overflow-hidden">
      {/* Canvas Titik Halus Minimalis */}
      <DotBackground />

      <div className="relative z-10 w-full max-w-md mx-auto text-center space-y-6">
        {/* Status Badge Editorial */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-accent font-mono text-xs shadow-2xs">
          <Terminal className="w-3.5 h-3.5" />
          <span>404 // NOT_FOUND</span>
        </div>

        {/* Big Ghost Typography */}
        <div className="space-y-2">
          <div className="font-mono text-6xl sm:text-7xl font-extrabold tracking-tighter text-foreground/20 select-none">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-sm mx-auto">
            Alamat URL atau studi kasus yang Anda tuju tidak berada dalam indeks sistem atau telah dipindahkan.
          </p>
        </div>

        {/* Conditional Action Buttons (Server-Rendered Instant Tanpa Delay) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {isAdmin ? (
            <>
              {/* Tombol Khusus Admin yang Sedang Login */}
              <Button asChild variant="primary" size="md" className="w-full sm:w-auto font-mono text-xs">
                <Link href="/admin">
                  <LayoutDashboard className="w-4 h-4 mr-1.5 text-accent" />
                  <span>Kembali ke Dashboard</span>
                </Link>
              </Button>

              <Button asChild variant="secondary" size="md" className="w-full sm:w-auto font-mono text-xs">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  <span>Buka Live Portfolio</span>
                </Link>
              </Button>
            </>
          ) : (
            <>
              {/* Tombol untuk Pengunjung Umum */}
              <Button asChild variant="primary" size="md" className="w-full sm:w-auto font-mono text-xs">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  <span>Kembali ke Beranda</span>
                </Link>
              </Button>

              <Button asChild variant="secondary" size="md" className="w-full sm:w-auto font-mono text-xs">
                <Link href="/projects">
                  <FolderKanban className="w-4 h-4 mr-1.5 text-accent" />
                  <span>Jelajahi Proyek</span>
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Footer Terminal Note saat Admin Terdeteksi */}
        {isAdmin && (
          <div className="pt-4 flex items-center justify-center gap-1.5 text-[11px] font-mono text-muted/70">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Authenticated Session Active · Administrator Mode</span>
          </div>
        )}
      </div>
    </div>
  );
}
