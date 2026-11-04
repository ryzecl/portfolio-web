// components/admin/education-detail-actions.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { EducationItem } from '@/types/credentials';
import { deleteEducationAction } from '@/app/admin/education/actions';
import { EducationDialog } from '@/components/admin/education-dialog';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';

interface EducationDetailActionsProps {
  education: EducationItem;
}

export function EducationDetailActions({ education }: EducationDetailActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const majorName = education.major || education.role || 'Education';
  const instName = education.institution || education.organization || '';

  const handleDelete = async () => {
    try {
      await deleteEducationAction(education.id);
      toast.success('Education record deleted', {
        description: `"${majorName}" at ${instName} has been removed.`,
      });
      router.push('/admin/education');
    } catch (err: any) {
      toast.error('Failed to delete education record', {
        description: err.message,
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDialogOpen(true)}
          className="font-mono text-xs cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5 mr-1.5" />
          Edit Entry
        </Button>

        <DeleteConfirmDialog
          title="Delete Education?"
          description={`Do you want to permanently delete "${majorName}" at ${instName}?`}
          onConfirm={handleDelete}
          variant="outline"
          showLabel
          label="Delete"
        />
      </div>

      <EducationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        education={education}
      />
    </>
  );
}
