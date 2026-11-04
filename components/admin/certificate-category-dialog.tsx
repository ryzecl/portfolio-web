// components/admin/certificate-category-dialog.tsx
'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { CertificateCategory, GenericActionState } from '@/types/credentials';
import { upsertCertificateCategoryAction } from '@/app/admin/certificates/categories/actions';
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

interface CertificateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CertificateCategory | null;
}

function CertificateCategoryFormContent({
  category,
  onClose,
}: {
  category?: CertificateCategory | null;
  onClose: () => void;
}) {
  const [state, formAction, isPending] = useActionState<GenericActionState | null, FormData>(
    upsertCertificateCategoryAction,
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

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-mono text-foreground">
          {category ? 'Edit Kategori Sertifikat' : 'Tambah Kategori Sertifikat'}
        </DialogTitle>
        <DialogDescription className="text-muted text-xs">
          Kelompokkan sertifikat berdasarkan taksonomi (e.g. Web Development, Artificial Intelligence).
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
            placeholder="e.g. Web Development"
            required
            className="bg-surface-raised border-border text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cat-slug" className="text-xs font-mono text-muted">
            Slug Identifier (Unik) *
          </Label>
          <Input
            id="cat-slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setIsSlugManual(true);
            }}
            placeholder="e.g. web-development"
            required
            className="bg-surface-raised border-border font-mono text-xs"
          />
          <p className="text-[11px] text-muted">
            Digunakan sebagai identifier unik di database.
          </p>
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

export function CertificateCategoryDialog({
  open,
  onOpenChange,
  category,
}: CertificateCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-md">
        {open && (
          <CertificateCategoryFormContent
            category={category}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
