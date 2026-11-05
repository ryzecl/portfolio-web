// components/admin/delete-confirm-dialog.tsx
'use client';

import React, { useState, useTransition } from 'react';
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
import { Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DeleteConfirmDialogProps {
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  variant?: 'ghost' | 'outline';
  showLabel?: boolean;
  label?: string;
  cancelText?: string;
  confirmText?: string;
  className?: string;
}

export function DeleteConfirmDialog({
  title,
  description,
  onConfirm,
  variant = 'ghost',
  showLabel = false,
  label = 'Delete',
  cancelText = "Don't delete",
  confirmText = 'Delete',
  className,
}: DeleteConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAction = () => {
    startTransition(async () => {
      try {
        await onConfirm();
        setOpen(false);
      } catch (err) {
        console.error('Delete action failed:', err);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          title={title}
          className={cn(
            'cursor-pointer',
            variant === 'ghost' && !showLabel && 'h-8 w-8 p-0 text-muted hover:text-destructive',
            variant === 'outline' && showLabel && 'font-mono text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30',
            className
          )}
        >
          <Trash2 className={cn('w-3.5 h-3.5', showLabel && 'mr-1.5')} />
          {showLabel && <span>{label}</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              handleAction();
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
