// app/admin/projects/new/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { ProjectForm } from '@/components/admin/project-form';

export const metadata: Metadata = {
  title: 'New Project · Admin CMS',
};

export default async function NewProjectPage() {
  const supabase = await createClient();

  // Ambil data kategori (diurutkan alfabetis berdasarkan nama) dan teknologi beserta kategorinya secara paralel
  const [categoriesRes, technologiesRes] = await Promise.all([
    supabase.from('project_categories').select('*').order('name', { ascending: true }),
    supabase
      .from('technologies')
      .select('*, category:tech_categories(id, title, priority)')
      .order('name', { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
          Create New Project
        </h1>
        <p className="text-xs text-muted">
          Fill in the case study details, upload visual assets, configure interactive previews, and select tech stack tags.
        </p>
      </div>

      <ProjectForm
        categories={categoriesRes.data || []}
        technologies={technologiesRes.data || []}
      />
    </div>
  );
}
