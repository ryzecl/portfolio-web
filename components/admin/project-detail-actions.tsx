// components/admin/project-detail-actions.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/projects';
import { ProjectDeleteDialog } from '@/components/admin/project-delete-dialog';
import { Button } from '@/components/ui/button';
import { Edit2, ExternalLink } from 'lucide-react';

interface ProjectDetailActionsProps {
  project: Project;
}

export function ProjectDetailActions({ project }: ProjectDetailActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild variant="outline" size="sm" className="font-mono text-xs">
        <Link href={`/projects/${project.slug}`} target="_blank">
          <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-accent" />
          View Live Page
        </Link>
      </Button>

      <Button asChild variant="outline" size="sm" className="font-mono text-xs">
        <Link href={`/admin/projects/${project.id}/edit`}>
          <Edit2 className="w-3.5 h-3.5 mr-1.5" />
          Edit Project
        </Link>
      </Button>

      <ProjectDeleteDialog
        projectId={project.id}
        projectTitle={project.title}
        redirectTo="/admin/projects"
        variant="outline"
        showLabel
      />
    </div>
  );
}
