// components/admin/experience-detail-actions.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ExperienceItem } from '@/types/credentials';
import { deleteExperienceAction } from '@/app/admin/experience/actions';
import { ExperienceDialog } from '@/components/admin/experience-dialog';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';

interface ExperienceDetailActionsProps {
  experience: ExperienceItem;
}

export function ExperienceDetailActions({ experience }: ExperienceDetailActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteExperienceAction(experience.id);
      toast.success('Experience deleted', {
        description: `"${experience.role}" at ${experience.organization} has been removed.`,
      });
      router.push('/admin/experience');
    } catch (err: any) {
      toast.error('Failed to delete experience', {
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
          title="Delete Experience?"
          description={`Do you want to permanently delete "${experience.role}" at ${experience.organization}?`}
          onConfirm={handleDelete}
          variant="outline"
          showLabel
          label="Delete"
        />
      </div>

      <ExperienceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        experience={experience}
      />
    </>
  );
}
