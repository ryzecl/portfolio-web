import React from 'react';
import Link from 'next/link';
import { ProjectItem } from '@/lib/types';
import { ProjectPreview } from './project-preview';
import { ArrowUpRight, CheckCircle, ExternalLink } from 'lucide-react';
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

  return (
    <article
      className={cn(
        'group rounded-2xl bg-white border border-zinc-200/90 overflow-hidden transition-all duration-300 hover:border-zinc-300 hover:shadow-lg shadow-xs flex flex-col',
        featuredLayout ? 'lg:grid lg:grid-cols-12 gap-0' : ''
      )}
    >
      {/* Project Visual / Preview Area */}
      <div
        className={cn(
          'p-4 sm:p-6 lg:p-7 bg-zinc-50/70 border-b lg:border-b-0 border-zinc-200/80 flex items-center justify-center relative overflow-hidden',
          featuredLayout ? 'lg:col-span-7 lg:border-r border-zinc-200/80' : 'w-full'
        )}
      >
        <div className="w-full">
          <ProjectPreview
            type={project.visual.type || project.slug}
            title={project.title}
          />
        </div>
      </div>

      {/* Content Area */}
      <div
        className={cn(
          'p-6 sm:p-8 flex flex-col justify-between flex-grow space-y-6 bg-white',
          featuredLayout ? 'lg:col-span-5' : ''
        )}
      >
        <div className="space-y-4">
          {/* Eyebrow metadata */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-900 font-bold">
                /{indexFormatted}
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-medium">
                {project.category}
              </span>
            </div>

            {/* Status Badge */}
            <span
              className={cn(
                'text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-medium',
                project.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-zinc-100 text-zinc-800 border-zinc-200'
              )}
            >
              {project.status}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 group-hover:text-black transition-colors">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 focus:outline-none focus:underline"
            >
              <span>{project.title}</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </h3>

          {/* Role info */}
          <p className="text-xs font-mono text-zinc-500">
            Role: <span className="text-zinc-900 font-medium">{project.role}</span>
          </p>

          {/* Summary */}
          <p className="text-sm text-zinc-600 leading-relaxed font-normal">
            {project.summary}
          </p>

          {/* Key Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="pt-2 border-t border-zinc-100">
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Delivered Capabilities
              </p>
              <ul className="space-y-1.5">
                {project.highlights.slice(0, 3).map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-zinc-600 flex items-start gap-2"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-zinc-900 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom meta & tech pills */}
        <div className="pt-4 border-t border-zinc-100 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href={`/projects/${project.slug}`}
              className="text-xs font-mono font-semibold text-zinc-900 hover:text-black inline-flex items-center gap-1 group/link"
            >
              <span>Read case study</span>
              <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>

            <div className="flex items-center gap-2">
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
                  title="Live Demo"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.links.repository && (
                <a
                  href={project.links.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
                  title="Repository"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
