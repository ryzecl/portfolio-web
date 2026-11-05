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
