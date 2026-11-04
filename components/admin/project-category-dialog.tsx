// components/admin/project-category-dialog.tsx
'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
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
import { cn } from '@/lib/utils';

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
      toast.success(category ? 'Category updated' : 'Category created', {
        description: category
          ? `Changes saved to "${name}".`
          : `Category "${name}" created successfully.`,
      });
      onClose();
    } else if (state?.error) {
      toast.error('Failed to save category', {
        description: state.error,
      });
    }
  }, [state, onClose, category, name]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-mono text-foreground">
          {category ? 'Edit Project Category' : 'New Project Category'}
        </DialogTitle>
        <DialogDescription className="text-muted text-xs">
          Organize projects by architectural or product domain (e.g., Web Application, Mobile App, Company Profile).
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
            htmlFor="cat-name"
            className={cn(
              'text-xs font-mono text-muted',
              state?.errors?.name && 'text-destructive font-semibold'
            )}
          >
            Category Name *
          </Label>
          <Input
            id="cat-name"
            name="name"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Web Application"
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

        <div className="space-y-1.5">
          <Label
            htmlFor="cat-slug"
            className={cn(
              'text-xs font-mono text-muted',
              state?.errors?.slug && 'text-destructive font-semibold'
            )}
          >
            Slug Identifier (Auto-generated from Name) *
          </Label>
          <Input
            id="cat-slug"
            name="slug"
            value={slug}
            onChange={handleSlugChange}
            placeholder="e.g. web-app"
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

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer font-mono text-xs"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="cursor-pointer font-mono text-xs">
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Category'
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
