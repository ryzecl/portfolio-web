// components/admin/technology-dialog.tsx
'use client';

import React, { useActionState, useEffect, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { TechIcon } from '@/components/ui/tech-icon';
import { cn } from '@/lib/utils';

interface TechnologyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technology?: Technology | null;
  categories: TechCategory[];
  defaultCategoryId?: string;
}

function TechnologyFormContent({
  technology,
  categories,
  defaultCategoryId,
  onClose,
}: {
  technology?: Technology | null;
  categories: TechCategory[];
  defaultCategoryId?: string;
  onClose: () => void;
}) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    upsertTechnologyAction,
    null
  );

  const [categoryId, setCategoryId] = useState(
    technology?.category_id || defaultCategoryId || categories[0]?.id || ''
  );
  const [name, setName] = useState(technology?.name || '');
  const [slug, setSlug] = useState(technology?.slug || '');
  const [iconKey, setIconKey] = useState(technology?.icon_key || '');
  const [isSlugManual, setIsSlugManual] = useState(Boolean(technology?.slug));
  const [isIconManual, setIsIconManual] = useState(Boolean(technology?.icon_key));

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);

    const generatedSlug = val
      .toLowerCase()
      .replace(/[\s\.]+/g, '')
      .replace(/[^a-z0-9-]/g, '');

    if (!isSlugManual) {
      setSlug(generatedSlug);
    }

    if (!isIconManual) {
      setIconKey(generatedSlug);
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
          {technology ? 'Edit Teknologi' : 'Tambah Teknologi Baru'}
        </DialogTitle>
        <DialogDescription className="text-muted text-xs">
          Tambahkan bahasa, framework, pustaka, atau tool ke master data.
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} noValidate className="space-y-4 pt-2">
        {technology?.id && <input type="hidden" name="id" value={technology.id} />}
        <input type="hidden" name="category_id" value={categoryId} />

        {state?.error && !state?.errors && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Kategori Selector */}
        <div className="space-y-1.5">
          <Label
            htmlFor="category_id"
            className={cn(
              'text-xs font-mono text-muted',
              state?.errors?.category_id && 'text-destructive font-semibold'
            )}
          >
            Pilih Kategori *
          </Label>
          <Select
            value={categoryId}
            onValueChange={setCategoryId}
          >
            <SelectTrigger
              className={cn(
                'bg-surface-raised border-border text-xs',
                state?.errors?.category_id && 'border-destructive focus-visible:ring-destructive'
              )}
            >
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
          {state?.errors?.category_id && (
            <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{state.errors.category_id}</span>
            </p>
          )}
        </div>

        {/* Nama Teknologi */}
        <div className="space-y-1.5">
          <Label
            htmlFor="tech-name"
            className={cn(
              'text-xs font-mono text-muted',
              state?.errors?.name && 'text-destructive font-semibold'
            )}
          >
            Nama Teknologi *
          </Label>
          <Input
            id="tech-name"
            name="name"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Next.js"
            className={cn(
              'bg-surface-raised border-border text-xs',
              state?.errors?.name && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          {state?.errors?.name && (
            <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{state.errors.name}</span>
            </p>
          )}
        </div>

        {/* Slug URL */}
        <div className="space-y-1.5">
          <Label
            htmlFor="tech-slug"
            className={cn(
              'text-xs font-mono text-muted',
              state?.errors?.slug && 'text-destructive font-semibold'
            )}
          >
            Slug Identifier (Otomatis dari Nama) *
          </Label>
          <Input
            id="tech-slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setIsSlugManual(true);
            }}
            placeholder="e.g. nextjs"
            className={cn(
              'bg-surface-raised border-border font-mono text-xs',
              state?.errors?.slug && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          {state?.errors?.slug && (
            <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{state.errors.slug}</span>
            </p>
          )}
        </div>

        {/* Icon Key SimpleIcons dengan Live Preview & Link Bantuan */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="tech-icon"
              className={cn(
                'text-xs font-mono text-muted',
                state?.errors?.icon_key && 'text-destructive font-semibold'
              )}
            >
              Icon Key (SimpleIcons / SVG key) *
            </Label>
            <a
              href="https://simpleicons.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-accent hover:underline flex items-center gap-0.5"
            >
              Cari di simpleicons.org ↗
            </a>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl bg-surface-raised border border-border flex items-center justify-center shrink-0"
              title={`Preview Ikon: ${iconKey || name || '-'}`}
            >
              <TechIcon name={iconKey || name || 'terminal'} className="w-5 h-5" />
            </div>
            <Input
              id="tech-icon"
              name="icon_key"
              value={iconKey}
              onChange={(e) => {
                setIconKey(e.target.value);
                setIsIconManual(true);
              }}
              placeholder="e.g. nextdotjs, react, laravel"
              className={cn(
                'bg-surface-raised border-border font-mono text-xs flex-1',
                state?.errors?.icon_key && 'border-destructive focus-visible:ring-destructive'
              )}
            />
          </div>
          {state?.errors?.icon_key && (
            <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{state.errors.icon_key}</span>
            </p>
          )}

          {/* Preset Populer Cepat */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-mono text-muted block">Klik Cepat (Preset Otomatis):</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: 'Next.js', key: 'nextdotjs', slug: 'nextjs' },
                { label: 'React', key: 'react', slug: 'react' },
                { label: 'TypeScript', key: 'typescript', slug: 'typescript' },
                { label: 'Python', key: 'python', slug: 'python' },
                { label: 'Laravel', key: 'laravel', slug: 'laravel' },
                { label: 'CodeIgniter', key: 'codeigniter', slug: 'codeigniter' },
                { label: 'Tailwind', key: 'tailwindcss', slug: 'tailwind' },
                { label: 'Supabase', key: 'supabase', slug: 'supabase' },
                { label: 'PostgreSQL', key: 'postgresql', slug: 'postgresql' },
                { label: 'Bun', key: 'bun', slug: 'bun' },
                { label: 'Docker', key: 'docker', slug: 'docker' },
                { label: 'Git', key: 'git', slug: 'git' },
                { label: 'VS Code', key: 'vscode', slug: 'vscode' },
                { label: 'Google Antigravity', key: 'googleantigravity', slug: 'google-antigravity' },
                { label: 'Android Studio', key: 'androidstudio', slug: 'android-studio' },
                { label: 'Zed', key: 'zed', slug: 'zed' },
                { label: 'Vercel', key: 'vercel', slug: 'vercel' },
                { label: 'Spotify', key: 'spotify', slug: 'spotify' },
                { label: 'Laragon', key: 'laragon', slug: 'laragon' },
                { label: 'XAMPP', key: 'xampp', slug: 'xampp' },
                { label: 'OpenCode', key: 'opencode', slug: 'opencode' },
              ].map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => {
                    setName(preset.label);
                    setSlug(preset.slug);
                    setIconKey(preset.key);
                    setIsSlugManual(true);
                    setIsIconManual(true);
                  }}
                  className="px-2 py-0.5 rounded-md bg-surface-raised hover:bg-accent/10 hover:border-accent/40 border border-border text-[10px] font-mono text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  +{preset.label}
                </button>
              ))}
            </div>
          </div>
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
              'Simpan Teknologi'
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function TechnologyDialog({
  open,
  onOpenChange,
  technology,
  categories,
  defaultCategoryId,
}: TechnologyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-md">
        {open && (
          <TechnologyFormContent
            technology={technology}
            categories={categories}
            defaultCategoryId={defaultCategoryId}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
