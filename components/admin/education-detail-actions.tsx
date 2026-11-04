// components/admin/education-detail-actions.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { EducationItem } from '@/types/credentials';
import { deleteEducationAction } from '@/app/admin/education/actions';
import { EducationDialog } from '@/components/admin/education-dialog';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface EducationDetailActionsProps {
  education: EducationItem;
}

export function EducationDetailActions({ education }: EducationDetailActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const majorName = education.major || education.role || 'Pendidikan';
  const instName = education.institution || education.organization || '';

  const handleDelete = () => {
    if (confirm(`Hapus riwayat pendidikan "${majorName}" di ${instName}?`)) {
      startTransition(async () => {
        await deleteEducationAction(education.id);
        router.push('/admin/education');
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
          className="font-mono text-xs"
        >
          <Edit2 className="w-3.5 h-3.5 mr-1.5" />
          Edit Data
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={handleDelete}
          className="font-mono text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Hapus
        </Button>
      </div>

      <EducationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        education={education}
      />
    </>
  );
}
