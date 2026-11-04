// components/admin/tech-categories-table.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { TechCategory } from '@/types/tech-stack';
import { deleteCategoryAction } from '@/app/admin/tech-stack/actions';
import { TechCategoryDialog } from '@/components/admin/tech-category-dialog';
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
import { Plus, Edit2, Trash2, Cpu } from 'lucide-react';

interface TechCategoryWithCount extends Omit<TechCategory, 'technologies'> {
  technologies?: { id?: string; count?: number }[] | any[];
}

interface TechCategoriesTableProps {
  categories: TechCategoryWithCount[];
}

export function TechCategoriesTable({ categories }: TechCategoriesTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TechCategory | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Hapus kategori teknologi "${title}"? Semua teknologi di dalamnya akan ikut terhapus.`)) {
      startTransition(async () => {
        await deleteCategoryAction(id);
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted font-mono">
          Total: {categories.length} klaster teknologi terdaftar
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

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted">Nama Klaster / Kategori</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Slug</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Deskripsi</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Prioritas</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Teknologi</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted text-xs font-mono">
                  Belum ada kategori teknologi. Klik tombol "Tambah Kategori" di atas.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => {
                const count = Array.isArray(cat.technologies)
                  ? typeof cat.technologies[0]?.count === 'number'
                    ? cat.technologies[0].count
                    : cat.technologies.length
                  : 0;

                return (
                  <TableRow key={cat.id} className="border-border hover:bg-surface-raised/50">
                    <TableCell className="font-semibold text-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-surface-raised border border-border flex items-center justify-center text-accent">
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <span>{cat.title}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <code className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-raised border border-border text-muted">
                        {cat.slug}
                      </code>
                    </TableCell>

                    <TableCell className="text-xs text-muted max-w-xs truncate">
                      {cat.description || '-'}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[11px]">
                        #{cat.priority}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-mono text-foreground font-medium">
                        {count} item
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCategory(cat as unknown as TechCategory);
                            setDialogOpen(true);
                          }}
                          className="h-8 w-8 p-0"
                          title="Edit kategori"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isPending}
                          onClick={() => handleDelete(cat.id, cat.title)}
                          className="h-8 w-8 p-0 text-muted hover:text-destructive"
                          title="Hapus kategori"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <TechCategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
      />
    </div>
  );
}
