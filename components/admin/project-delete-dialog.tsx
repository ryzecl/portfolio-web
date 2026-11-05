// components/admin/project-delete-dialog.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteProjectAction } from '@/app/admin/projects/actions';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';

interface ProjectDeleteDialogProps {
  projectId: string;
  projectTitle: string;
  redirectTo?: string;
  variant?: 'ghost' | 'outline';
  showLabel?: boolean;
  className?: string;
}

export function ProjectDeleteDialog({
  projectId,
  projectTitle,
  redirectTo,
  variant = 'ghost',
  showLabel = false,
  className,
}: ProjectDeleteDialogProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const res = await deleteProjectAction(projectId);
    if (res?.error) {
      toast.error('Failed to delete project', {
        description: res.error,
      });
    } else {
      toast.success('Project deleted', {
        description: `"${projectTitle}" has been permanently removed.`,
      });
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    }
  };

  return (
    <DeleteConfirmDialog
      title="Delete Project?"
      description={`Do you want to permanently delete "${projectTitle}" and its associated media?`}
      onConfirm={handleDelete}
      variant={variant}
      showLabel={showLabel}
      label="Delete"
      className={className}
    />
  );
}
