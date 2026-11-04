// app/admin/tech-stack/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { TechStackTable } from '@/components/admin/tech-stack-table';
import { Cpu, Layers } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
            Kelola daftar keahlian teknologi dan icon SimpleIcons untuk portofolio.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="font-mono text-xs border-border">
          <Link href="/admin/tech-stack/categories">
            <Layers className="w-3.5 h-3.5 mr-1.5 text-accent" />
            Kelola Kategori
          </Link>
        </Button>
      </div>

      {/* Interactive Table Component */}
      <TechStackTable categories={categories || []} />
    </div>
  );
}
