// components/admin/project-categories-table.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { toast } from 'sonner';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

interface ProjectCategoriesTableProps {
  categories: (ProjectCategory & { projectCount?: number })[];
}

export function ProjectCategoriesTable({
  categories,
}: ProjectCategoriesTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProjectCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ProjectCategory | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;
    startDeleteTransition(async () => {
      const res = await deleteProjectCategoryAction(categoryToDelete.id);
      if (res?.error) {
        toast.error('Failed to delete category', {
          description: res.error,
        });
      } else {
        toast.success('Category deleted', {
          description: `"${categoryToDelete.name}" was removed. Associated projects are now Uncategorized.`,
        });
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted font-mono">
          Total: {categories.length} registered {categories.length === 1 ? 'category' : 'categories'}
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

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted">Category Name</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Slug Identifier</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-muted text-xs font-mono">
                  No project categories found. Click &ldquo;Add Category&rdquo; above to create one.
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
                        title="Edit Category"
                        onClick={() => {
                          setEditingCategory(cat);
                          setDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-muted hover:text-foreground cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete Category"
                        onClick={() => {
                          setCategoryToDelete(cat);
                          setDeleteDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-muted hover:text-destructive cursor-pointer"
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

      {/* Delete Confirmation Alert Dialog (size="sm") */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">&ldquo;{categoryToDelete?.name}&rdquo;</span>? Projects in this category will become Uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="primary"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProjectCategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
      />
    </div>
  );
}
