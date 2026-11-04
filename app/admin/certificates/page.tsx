// app/admin/certificates/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { Certificate } from '@/types/credentials';
import { Award } from 'lucide-react';
import { CertificateClientWrapper } from '@/components/admin/certificate-client-wrapper';

export const metadata: Metadata = {
  title: 'Certificates Management · Admin CMS',
};

export default async function AdminCertificatesPage() {
  const supabase = await createClient();

  const { data: rawCertificates } = await supabase
    .from('certificates')
    .select('*')
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false });

  // Ambil daftar nama kategori terdaftar dengan aman (order by created_at)
  const { data: certCategories } = await supabase
    .from('certificate_categories')
    .select('name')
    .order('created_at', { ascending: true });

  const categoryNames = certCategories?.map((c) => c.name) || [];

  // Urutkan: prioritas 1, 2, 3.. lebih dulu, lalu yang prioritas 0 / arsip
  const certificates = (rawCertificates || []).sort((a: Certificate, b: Certificate) => {
    const pA = a.priority && a.priority > 0 ? a.priority : 999;
    const pB = b.priority && b.priority > 0 ? b.priority : 999;
    return pA - pB;
  });

  return (
    <div className="space-y-6">
      {/* Header (Tanpa button Kelola Kategori karena sudah memiliki menu/halaman sendiri) */}
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
            Kelola sertifikasi profesional, lisensi kompetensi industri, dan tautan verifikasi kredensial (Google Drive / Dicoding / vendor resmi).
          </p>
        </div>
      </div>

      {/* Client Table & Modal Handler */}
      <CertificateClientWrapper
        certificates={certificates}
        availableCategories={categoryNames}
      />
    </div>
  );
}
