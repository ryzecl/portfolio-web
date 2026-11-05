// app/admin/projects/[id]/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/server';
import { Project } from '@/types/projects';
import { ProjectDetailActions } from '@/components/admin/project-detail-actions';
import { FormattedPoint } from '@/components/ui/dynamic-point-list';
import { TechIcon } from '@/components/ui/tech-icon';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('title')
    .eq('id', id)
    .single();

  if (!project) {
    return { title: 'Project Details · Admin CMS' };
  }

  return {
    title: `${project.title} · Project Details · Admin CMS`,
  };
}

export default async function AdminProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: rawProject, error } = await supabase
    .from('projects')
    .select(
      `
      *,
      category:project_categories(id, name, slug),
      technologies(id, name, slug, icon_key)
    `
    )
    .eq('id', id)
    .single();

  if (error || !rawProject) {
    notFound();
  }

  const project = rawProject as Project;
  const previewImages = Array.isArray(project.preview_images)
    ? project.preview_images
    : [];
  const highlights = Array.isArray(project.highlights) ? project.highlights : [];
  const architecture = Array.isArray(project.architecture)
    ? project.architecture
    : [];
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Bar: Navigation & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-3 border-b border-border">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Projects</span>
        </Link>

        <ProjectDetailActions project={project} />
      </div>

      {/* Project Header Banner */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted">
          <span className="text-foreground font-medium">
            {project.category?.name || 'Uncategorized'}
          </span>
          <span className="text-border">·</span>
          <span>{project.year || 'N/A'}</span>
          {project.role && (
            <>
              <span className="text-border">·</span>
              <span>{project.role}</span>
            </>
          )}
          <span className="text-border">·</span>
          {project.priority > 0 && project.priority <= 4 ? (
            <span className="text-accent font-medium">#{project.priority} Featured</span>
          ) : project.priority > 4 ? (
            <span>Priority #{project.priority}</span>
          ) : (
            <span>Standard</span>
          )}
          <span className="text-border">·</span>
          <span className="capitalize">{project.status || 'Completed'}</span>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              {project.title}
            </h1>
            <span className="text-xs font-mono text-muted">
              /{project.slug}
            </span>
          </div>

          {project.summary && (
            <p className="text-sm text-foreground/85 leading-relaxed max-w-3xl">
              {project.summary}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column (2 Cols): Visuals & Case Study Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Cover Media & Gallery */}
          {(project.cover_image || previewImages.length > 0) && (
            <section className="space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
                Media &amp; Gallery
              </h2>

              {project.cover_image && (
                <div className="relative aspect-video rounded-xl border border-border overflow-hidden bg-surface">
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  {previewImages.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-lg border border-border overflow-hidden bg-surface"
                    >
                      <img
                        src={url}
                        alt={`${project.title} preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Case Study Narrative */}
          <section className="space-y-5 rounded-xl border border-border bg-surface p-6">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
              Case Study
            </h2>

            {project.description && (
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-muted uppercase tracking-wider block">
                  Description
                </span>
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            )}

            {(project.problem || project.solution) && (
              <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-border/60">
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-medium text-foreground uppercase tracking-wider block">
                    Problem Statement
                  </span>
                  <p className="text-xs text-muted leading-relaxed">
                    {project.problem || 'Not specified.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-medium text-foreground uppercase tracking-wider block">
                    Engineered Solution
                  </span>
                  <p className="text-xs text-muted leading-relaxed">
                    {project.solution || 'Not specified.'}
                  </p>
                </div>
              </div>
            )}

            {project.contribution && (
              <div className="pt-4 border-t border-border/60 space-y-1.5">
                <span className="text-xs font-mono font-medium text-foreground uppercase tracking-wider block">
                  Role &amp; Contribution
                </span>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  {project.contribution}
                </p>
              </div>
            )}
          </section>

          {/* Highlights & Architecture */}
          {(highlights.length > 0 || architecture.length > 0) && (
            <section className="space-y-5 rounded-xl border border-border bg-surface p-6">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
                Highlights &amp; Architecture
              </h2>

              {highlights.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-mono font-medium text-foreground uppercase tracking-wider block">
                    Key Highlights ({highlights.length})
                  </span>
                  <ul className="space-y-2">
                    {highlights.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        <FormattedPoint text={item} className="leading-relaxed" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {architecture.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border/60">
                  <span className="text-xs font-mono font-medium text-foreground uppercase tracking-wider block">
                    Architecture &amp; Engineering ({architecture.length})
                  </span>
                  <ul className="space-y-2">
                    {architecture.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        <FormattedPoint text={item} className="leading-relaxed" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right Column (1 Col): Tech Stack, Links & Metadata */}
        <div className="space-y-6">
          {/* Tech Stack */}
          <section className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
              Tech Stack ({technologies.length})
            </h2>
            {technologies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span
                    key={tech.id}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-raised border border-border text-xs font-mono text-foreground"
                  >
                    <TechIcon
                      name={tech.icon_key || tech.name}
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    <span>{tech.name}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-muted italic">
                No technologies assigned.
              </p>
            )}
          </section>

          {/* External Links */}
          {(project.demo_url || project.repo_url) && (
            <section className="rounded-xl border border-border bg-surface p-5 space-y-3 font-mono text-xs">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
                Links
              </h2>

              {project.demo_url && (
                <div className="space-y-1">
                  <span className="text-[10px] text-muted uppercase tracking-wider block">
                    Live Demo
                  </span>
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full p-2 rounded-lg bg-surface-raised hover:border-accent/40 border border-border text-foreground transition-colors font-sans text-xs"
                  >
                    <span className="truncate pr-2 font-mono text-xs">{project.demo_url}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted" />
                  </a>
                </div>
              )}

              {project.repo_url && (
                <div className="space-y-1 pt-2 border-t border-border/60">
                  <span className="text-[10px] text-muted uppercase tracking-wider block">
                    Repository
                  </span>
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full p-2 rounded-lg bg-surface-raised hover:border-accent/40 border border-border text-foreground transition-colors font-sans text-xs"
                  >
                    <span className="truncate pr-2 font-mono text-xs">{project.repo_url}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted" />
                  </a>
                </div>
              )}
            </section>
          )}

          {/* System Record */}
          <section className="rounded-xl border border-border bg-surface p-5 space-y-2.5 font-mono text-xs">
            <h2 className="text-xs uppercase tracking-wider text-muted">
              System Record
            </h2>
            <div>
              <span className="text-muted block text-[10px] uppercase">ID</span>
              <span className="text-foreground break-all select-all text-[11px]">
                {project.id}
              </span>
            </div>
            {project.created_at && (
              <div>
                <span className="text-muted block text-[10px] uppercase">Created</span>
                <span className="text-foreground text-[11px]">
                  {new Date(project.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
