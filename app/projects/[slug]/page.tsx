import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllProjects,
  getAllProjectSlugs,
  getProjectBySlug,
  getSiteData,
} from '@/lib/data';
import { ProjectMediaViewer } from '@/components/projects/project-media-viewer';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Workflow,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const site = getSiteData();

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} · ${site.identity.name}`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const projectNumber = String(currentIndex + 1).padStart(2, '0');

  const hasDemo = Boolean(project.links?.demo && project.links.demo.trim() !== '');
  const hasRepo = Boolean(project.links?.repository && project.links.repository.trim() !== '');
  const hasAnyLink = hasDemo || hasRepo;

  return (
    <div className="pt-28 pb-24 sm:pt-36 sm:pb-32 bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Back Navigation & Index */}
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to all projects</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="text-foreground font-bold">PROJECT {projectNumber}</span>
            <span>/</span>
            <span>{String(allProjects.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Header Block */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-surface-raised border border-border text-xs font-mono text-muted uppercase tracking-wider font-medium">
              {project.category}
            </span>
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-mono border font-medium',
                project.status === 'Completed'
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'bg-surface-raised text-muted border-border'
              )}
            >
              {project.status}
            </span>
            {project.year && (
              <span className="text-xs font-mono text-muted">
                {project.year}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight text-balance">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-muted leading-relaxed font-normal max-w-3xl">
            {project.description || project.summary}
          </p>

          {/* Quick Meta Row */}
          <div
            className={cn(
              'grid gap-4 pt-4 border-t border-border',
              hasAnyLink ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
            )}
          >
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium">
                My Role
              </p>
              <p className="text-sm font-semibold text-foreground mt-1">
                {project.role}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium">
                Category
              </p>
              <p className="text-sm font-semibold text-foreground mt-1">
                {project.category}
              </p>
            </div>

            {/* Optional Links: ONLY displayed if user provides at least one link */}
            {hasAnyLink && (
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium">
                  Links & Source
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  {hasDemo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-accent text-background font-mono text-xs font-semibold hover:bg-accent-strong transition-colors"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {hasRepo && (
                    <a
                      href={project.links.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-raised border border-border text-foreground font-mono text-xs font-semibold hover:border-accent transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visual Preview / Cover & Gallery Carousel Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-muted">
            <span className="uppercase tracking-wider">Project Media & Interface</span>
            <span className="text-accent font-medium">
              {project.previewImages && project.previewImages.length > 0
                ? 'Interactive Gallery'
                : 'Project Overview'}
            </span>
          </div>

          <ProjectMediaViewer
            title={project.title}
            coverImage={project.coverImage}
            previewImages={project.previewImages}
          />
        </div>

        {/* Problem & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-3 shadow-xs">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider font-medium">
              <span className="text-accent font-bold">01</span>
              <span className="text-border">/</span>
              <span>The Problem & Context</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              What needed solving
            </h3>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-3 shadow-xs">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider font-medium">
              <span className="text-accent font-bold">02</span>
              <span className="text-border">/</span>
              <span>The Technical Solution</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              How it was addressed
            </h3>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Architecture Flow if present */}
        {project.architecture && project.architecture.length > 0 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted font-medium">
                System Architecture & Data Flow
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {project.architecture.map((node, i) => (
                <React.Fragment key={node}>
                  <div className="flex-1 p-3.5 rounded-xl bg-surface-raised border border-border text-center">
                    <p className="text-xs font-mono text-muted mb-1">
                      Step 0{i + 1}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {node}
                    </p>
                  </div>
                  {i < project.architecture!.length - 1 && (
                    <div className="hidden sm:flex items-center justify-center text-muted">
                      <ArrowRight className="w-4 h-4 text-accent" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Key Highlights Checklist */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Delivered Capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3"
                >
                  <span className="text-accent text-sm font-mono mt-0.5 select-none">
                    -
                  </span>
                  <span className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Contribution */}
        {project.contribution && (
          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-2">
            <p className="text-xs font-mono uppercase tracking-wider text-muted font-medium">
              Engineering Contribution
            </p>
            <h3 className="text-lg font-bold text-foreground">
              Responsibilities
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {project.contribution}
            </p>
          </div>
        )}

        {/* Technologies Used */}
        <div className="space-y-3 pt-4 border-t border-border">
          <p className="text-xs font-mono uppercase tracking-wider text-muted font-medium">
            Technologies Applied
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-surface border border-border text-foreground font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Pagination: Next & Previous Project */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-border">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/50 transition-all flex flex-col items-start gap-2 group"
            >
              <span className="inline-flex items-center gap-1 text-xs font-mono text-muted group-hover:text-accent">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Previous Project</span>
              </span>
              <p className="text-base font-bold text-foreground">
                {prevProject.title}
              </p>
            </Link>
          ) : (
            <div className="p-5 rounded-2xl bg-surface/40 border border-border/40 text-muted/60 text-xs font-mono flex items-center">
              First project in catalog
            </div>
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/50 transition-all flex flex-col items-end gap-2 text-right group"
            >
              <span className="inline-flex items-center gap-1 text-xs font-mono text-muted group-hover:text-accent">
                <span>Next Project</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <p className="text-base font-bold text-foreground">
                {nextProject.title}
              </p>
            </Link>
          ) : (
            <div className="p-5 rounded-2xl bg-surface/40 border border-border/40 text-muted/60 text-xs font-mono flex items-center justify-end">
              End of project catalog
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
