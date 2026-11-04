// app/admin/tech-stack/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { TechStackTable } from '@/components/admin/tech-stack-table';
import { Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tech Stack Management · Admin CMS',
};

export default async function TechStackAdminPage() {
  const supabase = await createClient();

  // Query categories beserta relasi teknologi diurutkan berdasarkan priority
  const { data: categories, error } = await supabase
    .from('tech_categories')
    .select(`
      id,
      title,
      slug,
      description,
      priority,
      created_at,
      technologies (
        id,
        category_id,
        name,
        slug,
        icon_key,
        is_featured,
        priority,
        created_at
      )
    `)
    .order('priority', { ascending: true });

  if (error) {
    return (
      <div className="p-6 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm font-mono">
        Failed to fetch tech stack: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
            <Cpu className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
            Tech Stack Master
          </h1>
        </div>
        <p className="text-xs text-muted">
          Kelola klaster keahlian teknologi, icon SimpleIcons, dan status featured untuk portofolio.
        </p>
      </div>

      {/* Interactive Table Component */}
      <TechStackTable categories={categories || []} />
    </div>
  );
}
