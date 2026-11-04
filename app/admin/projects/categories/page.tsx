// app/admin/projects/categories/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/server';
import { ProjectCategoriesTable } from '@/components/admin/project-categories-table';
import { FolderKanban, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Project Categories · Admin CMS',
};

export default async function ProjectCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('project_categories')
    .select('*')
    .order('name', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Link href="/admin/projects">
                <ArrowLeft className="w-4 h-4 text-muted hover:text-foreground" />
              </Link>
            </Button>
            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
              <FolderKanban className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
              Project Categories
            </h1>
          </div>
          <p className="text-xs text-muted pl-10">
            Kelola taksonomi kategori proyek (Web Application, Mobile App, Company Profile, dll.).
          </p>
        </div>
      </div>

      <ProjectCategoriesTable categories={categories || []} />
    </div>
  );
}
