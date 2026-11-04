// app/admin/tech-stack/categories/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/server';
import { TechCategoriesTable } from '@/components/admin/tech-categories-table';
import { Layers, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Tech Stack Categories · Admin CMS',
};

export default async function TechCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('tech_categories')
    .select('*, technologies(id)')
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Link href="/admin/tech-stack">
                <ArrowLeft className="w-4 h-4 text-muted hover:text-foreground" />
              </Link>
            </Button>
            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
              Tech Stack Categories
            </h1>
          </div>
          <p className="text-xs text-muted pl-10">
            Kelola pengelompokan keahlian teknologi (Frontend, Backend, Database, Cloud & DevOps, dll.).
          </p>
        </div>
      </div>

      <TechCategoriesTable categories={categories || []} />
    </div>
  );
}
