// components/admin/tech-categories-table.tsx
'use client';

import React, { useState } from 'react';
import { TechCategory } from '@/types/tech-stack';
import { deleteCategoryAction } from '@/app/admin/tech-stack/actions';
import { TechCategoryDialog } from '@/components/admin/tech-category-dialog';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { toast } from 'sonner';
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
import { Plus, Edit2, Cpu } from 'lucide-react';

interface TechCategoryWithCount extends Omit<TechCategory, 'technologies'> {
  technologies?: { id?: string; count?: number }[] | any[];
}

interface TechCategoriesTableProps {
  categories: TechCategoryWithCount[];
}

export function TechCategoriesTable({ categories }: TechCategoriesTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TechCategory | null>(null);

  const handleDelete = async (id: string, title: string) => {
    const res = await deleteCategoryAction(id);
    if (res?.error) {
      toast.error('Failed to delete category', {
        description: res.error,
      });
    } else {
      toast.success('Category deleted', {
        description: `"${title}" and its technologies were removed.`,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted font-mono">
          Total: {categories.length} technology {categories.length === 1 ? 'cluster' : 'clusters'} registered
        </p>

        <Button
          size="sm"
          onClick={() => {
            setEditingCategory(null);
            setDialogOpen(true);
          }}
          className="font-mono text-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted">Cluster / Category</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Slug</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Description</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Priority</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Technologies</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted text-xs font-mono">
                  No technology categories found. Click &ldquo;Add Category&rdquo; to create one.
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
                        {count} {count === 1 ? 'item' : 'items'}
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
                          className="h-8 w-8 p-0 cursor-pointer"
                          title="Edit category"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                        </Button>

                        <DeleteConfirmDialog
                          title="Delete Category?"
                          description={`Do you want to permanently delete "${cat.title}"? All associated technologies will be affected.`}
                          onConfirm={() => handleDelete(cat.id, cat.title)}
                        />
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
