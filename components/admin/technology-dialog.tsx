// components/admin/technology-dialog.tsx
'use client';

import React, { useActionState, useEffect } from 'react';
import { Technology, TechCategory, ActionState } from '@/types/tech-stack';
import { upsertTechnologyAction } from '@/app/admin/tech-stack/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';

interface TechnologyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technology?: Technology | null;
  categories: TechCategory[];
  defaultCategoryId?: string;
}

export function TechnologyDialog({
  open,
  onOpenChange,
  technology,
  categories,
  defaultCategoryId,
}: TechnologyDialogProps) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    upsertTechnologyAction,
    null
  );

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
            {technology ? 'Edit Teknologi' : 'Tambah Teknologi Baru'}
          </DialogTitle>
          <DialogDescription className="text-muted text-xs">
            Tambahkan bahasa, framework, pustaka, atau tool ke master data.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          {technology?.id && <input type="hidden" name="id" value={technology.id} />}

          {state?.error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Kategori Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="category_id" className="text-xs font-mono text-muted">
              Pilih Kategori *
            </Label>
            <Select
              name="category_id"
              defaultValue={technology?.category_id || defaultCategoryId || categories[0]?.id}
              required
            >
              <SelectTrigger className="bg-surface-raised border-border">
                <SelectValue placeholder="Pilih Kategori..." />
              </SelectTrigger>
              <SelectContent className="bg-surface border-border">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nama Teknologi */}
          <div className="space-y-1.5">
            <Label htmlFor="tech-name" className="text-xs font-mono text-muted">
              Nama Teknologi *
            </Label>
            <Input
              id="tech-name"
              name="name"
              defaultValue={technology?.name || ''}
              placeholder="e.g. Next.js"
              required
              className="bg-surface-raised border-border"
            />
          </div>

          {/* Slug URL */}
          <div className="space-y-1.5">
            <Label htmlFor="tech-slug" className="text-xs font-mono text-muted">
              Slug Identifier *
            </Label>
            <Input
              id="tech-slug"
              name="slug"
              defaultValue={technology?.slug || ''}
              placeholder="e.g. nextdotjs"
              required
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          {/* Icon Key SimpleIcons */}
          <div className="space-y-1.5">
            <Label htmlFor="tech-icon" className="text-xs font-mono text-muted">
              Icon Key (SimpleIcons / SVG key) *
            </Label>
            <Input
              id="tech-icon"
              name="icon_key"
              defaultValue={technology?.icon_key || ''}
              placeholder="e.g. nextdotjs, react, typescript"
              required
              className="bg-surface-raised border-border font-mono text-xs"
            />
            <p className="text-[11px] text-muted">
              Gunakan identifier ikon dari simpleicons.org
            </p>
          </div>

          {/* Toggle Featured Badge */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-raised">
            <div className="space-y-0.5">
              <Label htmlFor="tech-featured" className="text-xs font-medium cursor-pointer">
                Tampilkan di Hero / Featured
              </Label>
              <p className="text-[11px] text-muted">
                Teknologi akan ditonjolkan pada marquee dan badge utama portofolio.
              </p>
            </div>
            <Switch
              id="tech-featured"
              name="is_featured"
              defaultChecked={technology?.is_featured || false}
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
                'Simpan Teknologi'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
