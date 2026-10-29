import React from 'react';
import type { Metadata } from 'next';
import { getAllProjects, getProjectCategories, getSiteData } from '@/lib/data';
import { ProjectFilters } from '@/components/projects/project-filters';
import { DotBackground } from '@/components/ui/dot-background';
import { SectionHeading } from '@/components/ui/section-heading';
import { JsonLd } from '@/components/ui/json-ld';
import { ContactCta } from '@/components/sections/contact-cta';

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
      images: [
        {
          url: '/images/project-placeholder.png',
          width: 1600,
          height: 1000,
          alt: `Projects by ${site.identity.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/project-placeholder.png'],
    },
    alternates: {
      canonical: '/projects',
    },
  };
}

export default function ProjectsPage() {
  const projects = getAllProjects();
  const categories = getProjectCategories();
  const site = getSiteData();
  const baseUrl = `https://${site.identity.domain}`;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Projects by ${site.identity.name}`,
    url: `${baseUrl}/projects`,
    description:
      'A catalog of client software, full-stack web applications, backend APIs, and personal engineering projects.',
    author: {
      '@type': 'Person',
      name: site.identity.name,
      url: baseUrl,
    },
    hasPart: projects.map((p) => ({
      '@type': 'SoftwareSourceCode',
      name: p.title,
      description: p.summary,
      url: `${baseUrl}/projects/${p.slug}`,
      programmingLanguage: p.technologies,
      ...(p.links?.repository ? { codeRepository: p.links.repository } : {}),
      ...(p.links?.demo ? { runtimePlatform: p.links.demo } : {}),
    })),
  };

  return (
    <div className="relative min-h-screen pt-32 sm:pt-40 bg-background text-foreground overflow-hidden">
      <DotBackground />
      <JsonLd data={collectionSchema} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

      <div className="relative z-10">
        <ContactCta contact={site.contact} identity={site.identity} />
      </div>
    </div>
  );
}
