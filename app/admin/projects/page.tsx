// app/admin/projects/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/server';
import { Project } from '@/types/projects';
import { ProjectDeleteDialog } from '@/components/admin/project-delete-dialog';
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
  Edit2,
  Sparkles,
  Trash2,
  Tag,
  Eye,
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
            Manage featured case studies, architecture blueprints, and live deployment links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="font-mono text-xs">
            <Link href="/admin/projects/categories">
              <Tag className="w-3.5 h-3.5 mr-1.5 text-accent" />
              Manage Categories
            </Link>
          </Button>

          <Button asChild size="sm" className="font-mono text-xs">
            <Link href="/admin/projects/new">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted">Project</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Category</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Position &amp; Status</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!projects || projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted text-xs font-mono">
                  No projects created yet. Click &ldquo;New Project&rdquo; above to publish your first work.
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
                          className="w-12 h-8 rounded-md object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-8 rounded-md bg-surface-raised border border-border flex items-center justify-center text-muted text-[10px] font-mono shrink-0">
                          NO IMG
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                          <Link
                            href={`/admin/projects/${proj.id}`}
                            className="hover:text-accent hover:underline transition-colors"
                          >
                            {proj.title}
                          </Link>
                          {proj.priority > 0 && proj.priority <= 4 && (
                            <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-muted block">
                          /{proj.slug} · {proj.year || 'N/A'} · {proj.technologies?.length || 0} Tech
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
                    <div className="flex flex-wrap items-center gap-2">
                      {proj.priority && proj.priority > 0 ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold border ${
                            proj.priority <= 4
                              ? 'bg-accent/15 border-accent/40 text-accent'
                              : 'bg-surface-raised border-border text-foreground'
                          }`}
                        >
                          #{proj.priority} {proj.priority <= 4 ? '★ Featured' : ''}
                        </span>
                      ) : (
                        <span className="text-muted text-[11px] font-mono">Standard</span>
                      )}
                      <span className="text-border">·</span>
                      <span className="text-xs font-mono text-emerald-400">
                        {proj.status}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        title="View Details"
                        className="h-8 w-8 p-0 text-muted hover:text-foreground"
                      >
                        <Link href={`/admin/projects/${proj.id}`}>
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </Button>

                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        title="Edit Project"
                        className="h-8 w-8 p-0 text-muted hover:text-foreground"
                      >
                        <Link href={`/admin/projects/${proj.id}/edit`}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                      </Button>

                      <ProjectDeleteDialog
                        projectId={proj.id}
                        projectTitle={proj.title}
                      />
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
