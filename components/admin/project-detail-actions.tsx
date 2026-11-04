// components/admin/project-detail-actions.tsx
'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Project } from '@/types/projects';
import { deleteProjectAction } from '@/app/admin/projects/actions';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ExternalLink, Loader2 } from 'lucide-react';

interface ProjectDetailActionsProps {
  project: Project;
}

export function ProjectDetailActions({ project }: ProjectDetailActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (
      confirm(
        `Hapus proyek "${project.title}"? Seluruh gambar proyek ini di Supabase Storage juga akan ikut dihapus.`
      )
    ) {
      startTransition(async () => {
        await deleteProjectAction(project.id);
        router.push('/admin/projects');
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild variant="outline" size="sm" className="font-mono text-xs">
        <Link href={`/projects/${project.slug}`} target="_blank">
          <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-accent" />
          Lihat Halaman Publik
        </Link>
      </Button>

      <Button asChild variant="outline" size="sm" className="font-mono text-xs">
        <Link href={`/admin/projects/${project.id}/edit`}>
          <Edit2 className="w-3.5 h-3.5 mr-1.5" />
          Edit Proyek
        </Link>
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={handleDelete}
        className="font-mono text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 cursor-pointer"
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
        )}
        Hapus
      </Button>
    </div>
  );
}
