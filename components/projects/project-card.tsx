import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectItem } from '@/lib/types';
import { ArrowUpRight, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  featuredLayout?: boolean;
}

export function ProjectCard({
  project,
  index,
  featuredLayout = false,
}: ProjectCardProps) {
  const indexFormatted = String(index + 1).padStart(2, '0');
  const hasCoverImage = Boolean(project.coverImage && project.coverImage.trim() !== '');

  const hasDemoLink = Boolean(project.links?.demo && project.links.demo.trim() !== '');
  const hasRepoLink = Boolean(project.links?.repository && project.links.repository.trim() !== '');

  return (
    <article
      className={cn(
        'group rounded-2xl bg-surface border border-border overflow-hidden transition-all duration-300 hover:border-accent/40 shadow-sm flex flex-col',
        featuredLayout ? 'lg:grid lg:grid-cols-12 gap-0' : ''
      )}
    >
      {/* Project Visual Area */}
      <div
        className={cn(
          'p-4 sm:p-6 bg-surface-raised border-b lg:border-b-0 border-border flex items-center justify-center relative overflow-hidden',
          featuredLayout ? 'lg:col-span-7 lg:border-r border-border' : 'w-full'
        )}
      >
        <div className="w-full">
          {hasCoverImage ? (
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-border bg-surface">
              <Image
                src={project.coverImage!}
                alt={project.visual?.alt || `${project.title} Thumbnail`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>
          ) : (
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-dashed border-border bg-surface flex flex-col items-center justify-center p-6 text-center group-hover:border-accent/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border flex items-center justify-center text-muted mb-2 shadow-xs">
                <ImageIcon className="w-5 h-5 text-muted" />
              </div>
              <p className="text-xs font-semibold text-foreground/90">{project.title}</p>
              <span className="text-[10px] font-mono text-muted/70 mt-1">
                16:10 Thumbnail
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div
        className={cn(
          'p-6 sm:p-8 flex flex-col justify-between flex-grow space-y-6 bg-surface',
          featuredLayout ? 'lg:col-span-5' : ''
        )}
      >
        <div className="space-y-4">
          {/* Eyebrow metadata */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-accent font-bold">
                /{indexFormatted}
              </span>
              <span className="text-border">·</span>
              <span className="text-xs font-mono uppercase tracking-wider text-muted font-medium">
                {project.category}
              </span>
            </div>

            {/* Status Badge */}
            <span
              className={cn(
                'text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-medium',
                project.status === 'Completed'
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'bg-surface-raised text-muted border-border'
              )}
            >
              {project.status}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 focus:outline-none focus:underline"
            >
              <span>{project.title}</span>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </h3>

          {/* Role info */}
          <p className="text-xs font-mono text-muted">
            Role: <span className="text-foreground font-medium">{project.role}</span>
          </p>

          {/* Summary */}
          <p className="text-sm text-muted leading-relaxed font-normal">
            {project.summary}
          </p>

          {/* Key Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="pt-2 border-t border-border-subtle">
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted mb-2 font-medium">
                Key Scope
              </p>
              <ul className="space-y-1.5">
                {project.highlights.slice(0, 3).map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-muted flex items-start gap-2"
                  >
                    <span className="text-accent text-[11px] font-mono mt-0.5 select-none">
                      -
                    </span>
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom meta & tech pills */}
        <div className="pt-4 border-t border-border-subtle space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-surface-raised border border-border text-foreground/80 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href={`/projects/${project.slug}`}
              className="text-xs font-mono font-semibold text-foreground hover:text-accent inline-flex items-center gap-1 group/link"
            >
              <span>Read case study</span>
              <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>

            {/* Optional Links: only render if at least one link exists */}
            {(hasDemoLink || hasRepoLink) && (
              <div className="flex items-center gap-2">
                {hasDemoLink && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-surface-raised text-muted hover:text-accent transition-colors"
                    title="Live Demo"
                    aria-label={`${project.title} Live Demo`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {hasRepoLink && (
                  <a
                    href={project.links.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-surface-raised text-muted hover:text-accent transition-colors"
                    title="Source Repository"
                    aria-label={`${project.title} Source Repository`}
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
