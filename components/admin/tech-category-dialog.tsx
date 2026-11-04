// components/admin/tech-category-dialog.tsx
'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { TechCategory, ActionState } from '@/types/tech-stack';
import { upsertCategoryAction } from '@/app/admin/tech-stack/actions';
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
import { cn } from '@/lib/utils';

interface TechCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: TechCategory | null;
}

function TechCategoryFormContent({
  category,
  onClose,
}: {
  category?: TechCategory | null;
  onClose: () => void;
}) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    upsertCategoryAction,
    null
  );

  const [title, setTitle] = useState(category?.title || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [description, setDescription] = useState(category?.description || '');
  const [priority, setPriority] = useState(category?.priority ?? 0);
  const [isSlugManual, setIsSlugManual] = useState(Boolean(category?.slug));

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugManual) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
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
          {category ? 'Edit Kategori Tech' : 'Tambah Kategori Baru'}
        </DialogTitle>
        <DialogDescription className="text-muted text-xs">
          Kelompokkan teknologi ke dalam cluster (misal: Frontend, Backend, Database).
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} noValidate className="space-y-4 pt-2">
        {category?.id && <input type="hidden" name="id" value={category.id} />}

        {state?.error && !state?.errors && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label
            htmlFor="cat-title"
            className={cn(
              'text-xs font-mono text-muted',
              state?.errors?.title && 'text-destructive font-semibold'
            )}
          >
            Judul Kategori *
          </Label>
          <Input
            id="cat-title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Frontend Development"
            className={cn(
              'bg-surface-raised border-border text-xs',
              state?.errors?.title && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          {state?.errors?.title && (
            <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{state.errors.title}</span>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="cat-slug"
            className={cn(
              'text-xs font-mono text-muted',
              state?.errors?.slug && 'text-destructive font-semibold'
            )}
          >
            Slug URL (Otomatis dari Judul) *
          </Label>
          <Input
            id="cat-slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setIsSlugManual(true);
            }}
            placeholder="e.g. frontend-development"
            className={cn(
              'bg-surface-raised border-border font-mono text-xs',
              state?.errors?.slug && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          {state?.errors?.slug ? (
            <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{state.errors.slug}</span>
            </p>
          ) : (
            <p className="text-[11px] text-muted">
              Dibuat otomatis dari judul kategori dan tetap bisa Anda ubah manual.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cat-desc" className="text-xs font-mono text-muted">
            Deskripsi Singkat (Opsional)
          </Label>
          <Input
            id="cat-desc"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Modern UI libraries & frameworks"
            className="bg-surface-raised border-border text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cat-prio" className="text-xs font-mono text-muted">
            Urutan Prioritas (Angka kecil tampil lebih awal)
          </Label>
          <Input
            id="cat-prio"
            name="priority"
            type="number"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
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

export function TechCategoryDialog({
  open,
  onOpenChange,
  category,
}: TechCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-md">
        {open && (
          <TechCategoryFormContent
            category={category}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
