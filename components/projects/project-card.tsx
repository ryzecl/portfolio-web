'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectItem } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  featuredLayout?: boolean;
}

export function ProjectCard({
  project,
  index,
}: ProjectCardProps) {
  const hasCoverImage = Boolean(project.coverImage && project.coverImage.trim() !== '');
  const coverSrc = hasCoverImage ? project.coverImage! : '/images/project-placeholder.png';
  const yearText = project.year || '2026';
  const roleOrCategory = project.role || project.category || 'Full-Stack Developer';

  return (
    <article className="h-full">
      <Link
        href={`/projects/${project.slug}`}
        className="group block space-y-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-3xl h-full"
      >
        {/* Image Preview Container */}
        <div className="relative aspect-16/10 w-full rounded-3xl border border-border/80 bg-surface-raised overflow-hidden shadow-xs transition-all duration-300 group-hover:border-accent/40 group-hover:shadow-md">
          <Image
            src={coverSrc}
            alt={project.visual?.alt || `${project.title} Preview`}
            fill
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 600px"
            priority={index < 2}
          />

          {/* Floating Circular Action Button */}
          <div
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white"
            aria-hidden="true"
          >
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Metadata Row Below Image */}
        <div className="space-y-1.5 px-1">
          {/* Line 1: Title + Year Pill */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
              {project.title}
            </h3>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono border border-border bg-surface-raised text-muted font-medium shrink-0">
              {yearText}
            </span>
          </div>

          {/* Line 2: Role / Category */}
          <p className="text-xs sm:text-sm font-mono text-muted uppercase tracking-wider">
            {roleOrCategory}
          </p>
        </div>
      </Link>
    </article>
  );
}
