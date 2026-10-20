import React from 'react';
import type { Metadata } from 'next';
import { getAllProjects, getProjectCategories, getSiteData } from '@/lib/data';
import { ProjectFilters } from '@/components/projects/project-filters';
import { SectionHeading } from '@/components/ui/section-heading';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteData();
  return {
    title: `Projects · ${site.identity.name}`,
    description:
      'Complete portfolio of client software, full-stack web applications, APIs, and mobile experiments.',
  };
}

export default function ProjectsPage() {
  const projects = getAllProjects();
  const categories = getProjectCategories();

  return (
    <div className="pt-32 pb-24 sm:pt-40 sm:pb-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="CATALOG"
          eyebrow="Index of Works"
          title="All Projects"
          description="A comprehensive archive of client deliverables, full-stack applications, and technical prototypes."
        />

        <ProjectFilters
          initialProjects={projects}
          categories={categories}
        />
      </div>
    </div>
  );
}
