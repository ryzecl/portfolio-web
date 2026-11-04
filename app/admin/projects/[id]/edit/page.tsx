// app/admin/projects/[id]/edit/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/server';
import { ProjectForm } from '@/components/admin/project-form';

export const metadata: Metadata = {
  title: 'Edit Project · Admin CMS',
};

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Ambil data proyek beserta kategori dan technologies secara paralel
  const [projectRes, categoriesRes, technologiesRes] = await Promise.all([
    supabase
      .from('projects')
      .select('*, technologies(id, name, slug)')
      .eq('id', id)
      .single(),
    supabase.from('project_categories').select('*').order('priority', { ascending: true }),
    supabase.from('technologies').select('*').order('name', { ascending: true }),
  ]);

  if (projectRes.error || !projectRes.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
          Edit Proyek: {projectRes.data.title}
        </h1>
        <p className="text-xs text-muted">
          Perbarui teks, gambar cover, atau sinkronisasikan ulang teknologi yang digunakan.
        </p>
      </div>

      <ProjectForm
        project={projectRes.data}
        categories={categoriesRes.data || []}
        technologies={technologiesRes.data || []}
      />
    </div>
  );
}
