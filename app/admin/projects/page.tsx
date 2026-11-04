// app/admin/projects/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/server';
import { Project } from '@/types/projects';
import { deleteProjectAction } from '@/app/admin/projects/actions';
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
import {
  FolderKanban,
  Plus,
  ExternalLink,
  Edit2,
  Sparkles,
  Trash2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Projects Management · Admin CMS',
};

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  // Query seluruh proyek beserta kategori dan tag teknologi
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      slug,
      summary,
      year,
      status,
      featured,
      cover_image,
      priority,
      category:project_categories(id, name),
      technologies(id, name, slug)
    `)
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
              <FolderKanban className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
              Projects Portfolio Master
            </h1>
          </div>
          <p className="text-xs text-muted">
            Kelola karya unggulan, studi kasus arsitektur, dan tautan demo langsung.
          </p>
        </div>

        <Button asChild size="sm" className="font-mono text-xs">
          <Link href="/admin/projects/new">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Tambah Proyek
          </Link>
        </Button>
      </div>

      {/* Tabel Proyek */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted">Proyek</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Kategori</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Tech Stack (Many-to-Many)</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Status</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!projects || projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted text-xs font-mono">
                  Belum ada proyek yang dibuat. Klik tombol "Tambah Proyek" di atas.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((proj: any) => (
                <TableRow key={proj.id} className="border-border hover:bg-surface-raised/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {proj.cover_image ? (
                        <img
                          src={proj.cover_image}
                          alt={proj.title}
                          className="w-12 h-8 rounded-md object-cover border border-border"
                        />
                      ) : (
                        <div className="w-12 h-8 rounded-md bg-surface-raised border border-border flex items-center justify-center text-muted text-[10px] font-mono">
                          NO IMG
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                          <span>{proj.title}</span>
                          {proj.featured && (
                            <Sparkles className="w-3.5 h-3.5 text-accent" />
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-muted">
                          /{proj.slug} · {proj.year || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {proj.category?.name || 'Uncategorized'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {proj.technologies && proj.technologies.length > 0 ? (
                        proj.technologies.map((t: any) => (
                          <span
                            key={t.id}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-raised border border-border text-foreground"
                          >
                            {t.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted text-[11px] font-mono">-</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-mono text-emerald-400">
                      {proj.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Link href={`/admin/projects/${proj.id}/edit`}>
                          <Edit2 className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                        </Link>
                      </Button>

                      <form
                        action={async () => {
                          'use server';
                          await deleteProjectAction(proj.id);
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          type="submit"
                          className="h-8 w-8 p-0 text-muted hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
