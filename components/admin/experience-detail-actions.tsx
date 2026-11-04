// components/admin/experience-detail-actions.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ExperienceItem } from '@/types/credentials';
import { deleteExperienceAction } from '@/app/admin/experience/actions';
import { ExperienceDialog } from '@/components/admin/experience-dialog';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface ExperienceDetailActionsProps {
  experience: ExperienceItem;
}

export function ExperienceDetailActions({ experience }: ExperienceDetailActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm(`Hapus pengalaman kerja "${experience.role}" di ${experience.organization}?`)) {
      startTransition(async () => {
        await deleteExperienceAction(experience.id);
        router.push('/admin/experience');
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

      <ExperienceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        experience={experience}
      />
    </>
  );
}
