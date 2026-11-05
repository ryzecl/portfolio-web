'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DotBackground } from '@/components/ui/dot-background';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log exception to standard console for debugging
    console.error('Unhandled runtime exception captured by ErrorBoundary:', error);
  }, [error]);

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-background text-foreground overflow-hidden">
      <DotBackground />

      <div className="relative z-10 w-full max-w-md mx-auto text-center space-y-6">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-amber-500 dark:text-amber-400 font-mono text-xs shadow-2xs">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>500 // UNEXPECTED_EXCEPTION</span>
        </div>

        {/* Ghost Typography & Headings */}
        <div className="space-y-2">
          <div className="font-mono text-6xl sm:text-7xl font-extrabold tracking-tighter text-foreground/20 select-none">
            500
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
            Terjadi Kendala Sistem
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-sm mx-auto">
            Komponen mengalami anomali saat memproses data. Anda dapat mencoba memuat ulang atau kembali ke beranda.
          </p>

          {error.digest && (
            <p className="text-[10px] font-mono text-muted/60 mt-1">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="md"
            className="w-full sm:w-auto font-mono text-xs inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-accent" />
            <span>Coba Lagi (Retry)</span>
          </Button>

          <Button
            asChild
            variant="outline"
            size="md"
            className="w-full sm:w-auto font-mono text-xs inline-flex items-center justify-center gap-2"
          >
            <Link href="/">
              <Home className="w-3.5 h-3.5 text-muted" />
              <span>Kembali ke Beranda</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
