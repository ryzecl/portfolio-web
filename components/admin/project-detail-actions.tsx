// components/admin/project-detail-actions.tsx
'use client';

import React from 'react';
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
      <Button
        variant="outline"
        size="sm"
        href={`/projects/${project.slug}`}
        external
        className="font-mono text-xs cursor-pointer"
      >
        <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-accent" />
        View Live Page
      </Button>

      <Button
        variant="outline"
        size="sm"
        href={`/admin/projects/${project.id}/edit`}
        className="font-mono text-xs cursor-pointer"
      >
        <Edit2 className="w-3.5 h-3.5 mr-1.5" />
        Edit Project
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
