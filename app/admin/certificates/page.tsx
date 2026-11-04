// app/admin/certificates/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { Certificate } from '@/types/credentials';
import { deleteCertificateAction } from '@/app/admin/certificates/actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Layers } from 'lucide-react';
import Link from 'next/link';
import { CertificateClientWrapper } from '@/components/admin/certificate-client-wrapper';

export const metadata: Metadata = {
  title: 'Certificates Management · Admin CMS',
};

export default async function AdminCertificatesPage() {
  const supabase = await createClient();

  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false });

  // Ambil daftar nama kategori terdaftar
  const { data: certCategories } = await supabase
    .from('certificate_categories')
    .select('name')
    .order('priority', { ascending: true });

  const categoryNames = certCategories?.map((c) => c.name) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
              <Award className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
              Certificates & Credentials
            </h1>
          </div>
          <p className="text-xs text-muted">
            Kelola arsip lisensi profesional, sertifikasi industri, dan link verifikasi eksternal.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="font-mono text-xs border-border">
          <Link href="/admin/certificates/categories">
            <Layers className="w-3.5 h-3.5 mr-1.5 text-accent" />
            Kelola Kategori
          </Link>
        </Button>
      </div>

      {/* Client Table & Modal Handler */}
      <CertificateClientWrapper
        certificates={certificates || []}
        availableCategories={categoryNames}
      />
    </div>
  );
}
