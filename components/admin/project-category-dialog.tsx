// components/admin/project-category-dialog.tsx
'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { ProjectCategory, ProjectActionState } from '@/types/projects';
import { upsertProjectCategoryAction } from '@/app/admin/projects/categories/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProjectCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: ProjectCategory | null;
}

function ProjectCategoryFormContent({
  category,
  onClose,
}: {
  category?: ProjectCategory | null;
  onClose: () => void;
}) {
  const [state, formAction, isPending] = useActionState<ProjectActionState | null, FormData>(
    upsertProjectCategoryAction,
    null
  );

  const [name, setName] = useState(category?.name || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [isSlugManual, setIsSlugManual] = useState(Boolean(category?.slug));

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isSlugManual) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSlug(val);
    setIsSlugManual(val.trim().length > 0);
  };

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-mono text-foreground">
          {category ? 'Edit Kategori Proyek' : 'Tambah Kategori Proyek'}
        </DialogTitle>
        <DialogDescription className="text-muted text-xs">
          Kelompokkan proyek berdasarkan domain (e.g. Web Application, Mobile App, Company Profile).
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} className="space-y-4 pt-2">
        {category?.id && <input type="hidden" name="id" value={category.id} />}

        {state?.error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="cat-name" className="text-xs font-mono text-muted">
            Nama Kategori *
          </Label>
          <Input
            id="cat-name"
            name="name"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Web Application"
            required
            className="bg-surface-raised border-border text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cat-slug" className="text-xs font-mono text-muted">
            Slug Identifier (Otomatis dari Nama) *
          </Label>
          <Input
            id="cat-slug"
            name="slug"
            value={slug}
            onChange={handleSlugChange}
            placeholder="e.g. web-app"
            required
            className="bg-surface-raised border-border font-mono text-xs"
          />
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Kategori'
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function ProjectCategoryDialog({
  open,
  onOpenChange,
  category,
}: ProjectCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-md">
        {open && (
          <ProjectCategoryFormContent
            key={category?.id || 'new'}
            category={category}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
