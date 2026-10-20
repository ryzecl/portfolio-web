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
import { ProjectPreview } from '@/components/projects/project-preview';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
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

  return (
    <div className="pt-28 pb-24 sm:pt-36 sm:pb-32 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Back Navigation & Index */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-200">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-900 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to all projects</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <span className="text-zinc-900 font-bold">PROJECT {projectNumber}</span>
            <span>/</span>
            <span>{String(allProjects.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Header Block */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-600 uppercase tracking-wider font-medium">
              {project.category}
            </span>
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-mono border font-medium',
                project.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-zinc-100 text-zinc-800 border-zinc-200'
              )}
            >
              {project.status}
            </span>
            {project.year && (
              <span className="text-xs font-mono text-zinc-400">
                {project.year}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight text-balance">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-zinc-600 leading-relaxed font-normal max-w-3xl">
            {project.description || project.summary}
          </p>

          {/* Quick Meta Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-200">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
                My Role
              </p>
              <p className="text-sm font-semibold text-zinc-900 mt-1">
                {project.role}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
                Category
              </p>
              <p className="text-sm font-semibold text-zinc-900 mt-1">
                {project.category}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
                Links & Source
              </p>
              <div className="flex items-center gap-3 mt-1">
                {project.links.demo ? (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-zinc-900 hover:underline"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs font-mono text-zinc-400">
                    No public demo
                  </span>
                )}
                {project.links.repository && (
                  <a
                    href={project.links.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-zinc-900 hover:underline"
                  >
                    <span>Repository</span>
                    <GithubIcon className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Preview Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
            <span className="uppercase tracking-wider">System Interface Preview</span>
            <span className="text-zinc-900 font-semibold">Interactive Prototype</span>
          </div>
          <div className="rounded-2xl border border-zinc-200/90 overflow-hidden bg-zinc-50 p-4 sm:p-8 shadow-xs">
            <ProjectPreview
              type={project.visual.type || project.slug}
              title={project.title}
            />
          </div>
        </div>

        {/* Problem & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-3 shadow-xs">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider font-medium">
              <span>01</span>
              <span>/</span>
              <span>The Problem & Context</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-900">
              What needed solving
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-3 shadow-xs">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider font-medium">
              <span>02</span>
              <span>/</span>
              <span>The Technical Solution</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-900">
              How it was addressed
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Architecture Flow if present */}
        {project.architecture && project.architecture.length > 0 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-zinc-900" />
              <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-500 font-medium">
                System Architecture & Data Flow
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {project.architecture.map((node, i) => (
                <React.Fragment key={node}>
                  <div className="flex-1 p-3.5 rounded-xl bg-white border border-zinc-200 text-center shadow-xs">
                    <p className="text-xs font-mono text-zinc-400 mb-1">
                      Step 0{i + 1}
                    </p>
                    <p className="text-sm font-semibold text-zinc-900">
                      {node}
                    </p>
                  </div>
                  {i < project.architecture!.length - 1 && (
                    <div className="hidden sm:flex items-center justify-center text-zinc-400">
                      <ArrowRight className="w-4 h-4 text-zinc-900" />
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
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
              Key Features & Delivered Capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/90 flex items-start gap-3 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-zinc-700">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Contribution */}
        {project.contribution && (
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-2 shadow-xs">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">
              Engineering Contribution
            </p>
            <h3 className="text-lg font-bold text-zinc-900">
              Personal Responsibilities
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              {project.contribution}
            </p>
          </div>
        )}

        {/* Technologies Used */}
        <div className="space-y-3 pt-4 border-t border-zinc-200">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">
            Technologies Applied
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-800 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Pagination: Next & Previous Project */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-zinc-200">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 hover:border-zinc-300 transition-all flex flex-col items-start gap-2 group shadow-xs"
            >
              <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500 group-hover:text-zinc-900">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Previous Project</span>
              </span>
              <p className="text-base font-bold text-zinc-900">
                {prevProject.title}
              </p>
            </Link>
          ) : (
            <div className="p-5 rounded-2xl bg-zinc-50/50 border border-zinc-200/50 text-zinc-400 text-xs font-mono flex items-center">
              First project in catalog
            </div>
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 hover:border-zinc-300 transition-all flex flex-col items-end gap-2 text-right group shadow-xs"
            >
              <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500 group-hover:text-zinc-900">
                <span>Next Project</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <p className="text-base font-bold text-zinc-900">
                {nextProject.title}
              </p>
            </Link>
          ) : (
            <div className="p-5 rounded-2xl bg-zinc-50/50 border border-zinc-200/50 text-zinc-400 text-xs font-mono flex items-center justify-end">
              End of project catalog
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
