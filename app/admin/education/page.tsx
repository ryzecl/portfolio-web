// app/admin/education/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
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
        <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
          Education History
        </h1>
        <p className="text-xs text-muted">
          Manage academic degrees, institutions, and educational milestones.
        </p>
      </div>

      <EducationTable educations={educations || []} />
    </div>
  );
}
