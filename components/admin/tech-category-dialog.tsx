// components/admin/tech-category-dialog.tsx
'use client';

import React, { useActionState, useEffect } from 'react';
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

interface TechCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: TechCategory | null;
}

export function TechCategoryDialog({
  open,
  onOpenChange,
  category,
}: TechCategoryDialogProps) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    upsertCategoryAction,
    null
  );

  // Tutup dialog otomatis jika mutasi sukses
  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-foreground">
            {category ? 'Edit Kategori Tech' : 'Tambah Kategori Baru'}
          </DialogTitle>
          <DialogDescription className="text-muted text-xs">
            Kelompokkan teknologi ke dalam cluster (misal: Frontend, Backend, Database).
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
            <Label htmlFor="cat-title" className="text-xs font-mono text-muted">
              Judul Kategori *
            </Label>
            <Input
              id="cat-title"
              name="title"
              defaultValue={category?.title || ''}
              placeholder="e.g. Frontend Development"
              required
              className="bg-surface-raised border-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-slug" className="text-xs font-mono text-muted">
              Slug URL *
            </Label>
            <Input
              id="cat-slug"
              name="slug"
              defaultValue={category?.slug || ''}
              placeholder="e.g. frontend-development"
              required
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-desc" className="text-xs font-mono text-muted">
              Deskripsi Singkat
            </Label>
            <Input
              id="cat-desc"
              name="description"
              defaultValue={category?.description || ''}
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
              defaultValue={category?.priority ?? 0}
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
      </DialogContent>
    </Dialog>
  );
}
