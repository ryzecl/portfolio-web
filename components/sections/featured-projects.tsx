import React from 'react';
import Link from 'next/link';
import { ProjectItem } from '@/lib/types';
import { ProjectCard } from '@/components/projects/project-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { ArrowUpRight } from 'lucide-react';

interface FeaturedProjectsProps {
  projects: ProjectItem[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) return null;

  const [leadProject, ...otherFeatured] = projects;

  return (
    <section className="py-20 border-t border-border" id="projects">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            number="02"
            eyebrow="Selected Works"
            title="Featured Projects"
            description="Real-world client software, interactive web architectures, and full-stack engineering."
            className="mb-0"
          />

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-muted hover:text-accent transition-colors pb-1 border-b border-border hover:border-accent"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-8">
          {/* Hero/Lead Featured Project (Large 12-column editorial card) */}
          {leadProject && (
            <ProjectCard
              project={leadProject}
              index={0}
              featuredLayout={true}
            />
          )}

          {/* Secondary Featured Projects (2-column grid) */}
          {otherFeatured.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {otherFeatured.map((project, idx) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={idx + 1}
                  featuredLayout={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
