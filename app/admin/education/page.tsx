// app/admin/education/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { GraduationCap } from 'lucide-react';
import { EducationTable } from '@/components/admin/education-table';

export const metadata: Metadata = {
  title: 'Education History · Admin CMS',
};

export default async function AdminEducationPage() {
  const supabase = await createClient();

  // Coba query dari tabel mandiri 'educations'
  let { data: educations, error } = await supabase
    .from('educations')
    .select('*')
    .order('priority', { ascending: true })
    .order('start_date', { ascending: false });

  // Fallback: Jika tabel 'educations' belum dibuat di Supabase, baca dari 'experiences'
  if (error && (error.code === 'PGRST205' || error.message.includes('educations'))) {
    const fallback = await supabase
      .from('experiences')
      .select('*')
      .eq('type', 'education')
      .order('priority', { ascending: true })
      .order('start_date', { ascending: false });
    educations = fallback.data;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
            Formal Education & Academics
          </h1>
        </div>
        <p className="text-xs text-muted">
          Kelola riwayat pendidikan formal, universitas, gelar sarjana, dan prestasi akademik.
        </p>
      </div>

      <EducationTable educations={educations || []} />
    </div>
  );
}
