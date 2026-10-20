import React from 'react';
import type { Metadata } from 'next';
import { getAllProjects, getProjectCategories, getSiteData } from '@/lib/data';
import { ProjectFilters } from '@/components/projects/project-filters';
import { SectionHeading } from '@/components/ui/section-heading';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteData();
  const title = `Projects by ${site.identity.name}`;
  const description =
    'A catalog of client software, full-stack web applications, backend APIs, and personal engineering projects built by Ferry Noer Hendriawan.';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: '/projects',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: '/projects',
    },
  };
}

export default function ProjectsPage() {
  const projects = getAllProjects();
  const categories = getProjectCategories();

  return (
    <div className="pt-32 pb-24 sm:pt-40 sm:pb-32 bg-background text-foreground">
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
