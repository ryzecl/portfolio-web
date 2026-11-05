// app/admin/certificates/categories/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/server';
import { CertificateCategoriesTable } from '@/components/admin/certificate-categories-table';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Certificate Categories · Admin CMS',
};

export default async function CertificateCategoriesPage() {
  const supabase = await createClient();

  // Aman: order by created_at (selalu ada di schema awal user)
  const { data: categories, error } = await supabase
    .from('certificate_categories')
    .select('*')
    .order('created_at', { ascending: true });

  const isTableMissing = error?.code === 'PGRST205' || Boolean(error?.message?.includes('certificate_categories'));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Link href="/admin/certificates">
                <ArrowLeft className="w-4 h-4 text-muted hover:text-foreground" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
              Certificate Categories
            </h1>
          </div>
          <p className="text-xs text-muted pl-10">
            Manage certificate taxonomy and domain groups.
          </p>
        </div>
      </div>

      <CertificateCategoriesTable
        categories={categories || []}
        tableMissing={isTableMissing}
      />
    </div>
  );
}
