// components/admin/project-categories-table.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { ProjectCategory } from '@/types/projects';
import { deleteProjectCategoryAction } from '@/app/admin/projects/categories/actions';
import { ProjectCategoryDialog } from '@/components/admin/project-category-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface ProjectCategoriesTableProps {
  categories: (ProjectCategory & { projectCount?: number })[];
}

export function ProjectCategoriesTable({
  categories,
}: ProjectCategoriesTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProjectCategory | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus kategori proyek "${name}"? Proyek di dalamnya akan menjadi Uncategorized.`)) {
      startTransition(async () => {
        await deleteProjectCategoryAction(id);
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted font-mono">
          Total: {categories.length} kategori terdaftar
        </p>

        <Button
          size="sm"
          onClick={() => {
            setEditingCategory(null);
            setDialogOpen(true);
          }}
          className="font-mono text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Tambah Kategori
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted">Nama Kategori</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Slug Identifier</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-muted text-xs font-mono">
                  Belum ada kategori proyek. Klik tombol "Tambah Kategori" di atas.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id} className="border-border hover:bg-surface-raised/50">
                  <TableCell className="font-semibold text-foreground text-sm">
                    {cat.name}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs font-mono px-2 py-0.5 rounded bg-surface-raised border border-border text-accent">
                      {cat.slug}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(cat);
                          setDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="h-8 w-8 p-0 text-muted hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProjectCategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
      />
    </div>
  );
}
