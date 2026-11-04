import React from 'react';
import type { Metadata } from 'next';
import { getAllProjects, getProjectCategories, getSiteData } from '@/lib/data';
import { createClient } from '@/lib/server';
import { ProjectFilters } from '@/components/projects/project-filters';
import { DotBackground } from '@/components/ui/dot-background';
import { SectionHeading } from '@/components/ui/section-heading';
import { JsonLd } from '@/components/ui/json-ld';
import { ContactCta } from '@/components/sections/contact-cta';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteData();
  const baseUrl = `https://${site.identity.domain}`;
  const title = `Projects by ${site.identity.name}`;
  const description =
    'A catalog of client software, full-stack web applications, backend APIs, and personal engineering projects built by Ferry Noer Hendriawan.';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/projects`,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/project-placeholder.png`,
          secureUrl: `${baseUrl}/images/project-placeholder.png`,
          width: 1600,
          height: 1000,
          type: 'image/png',
          alt: `Projects by ${site.identity.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/images/project-placeholder.png`],
      creator: '@ryzecl',
      site: '@ryzecl',
    },
    alternates: {
      canonical: `${baseUrl}/projects`,
    },
  };
}

export default async function ProjectsPage() {
  let projects = getAllProjects();
  let categories = getProjectCategories();
  const site = getSiteData();
  const baseUrl = `https://${site.identity.domain}`;

  try {
    const supabase = await createClient();
    const { data: dbProjects } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        slug,
        summary,
        description,
        problem,
        solution,
        contribution,
        role,
        year,
        status,
        cover_image,
        demo_url,
        repo_url,
        highlights,
        architecture,
        priority,
        category:project_categories(id, name),
        technologies(id, name, slug)
      `)
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });

    if (dbProjects && dbProjects.length > 0) {
      const sortedProjects = [...dbProjects].sort((a, b) => {
        const pA = a.priority && a.priority > 0 ? a.priority : 999;
        const pB = b.priority && b.priority > 0 ? b.priority : 999;
        return pA - pB;
      });

      projects = sortedProjects.map((item) => ({
        slug: item.slug,
        title: item.title,
        category: (item.category as any)?.name || 'General',
        summary: item.summary,
        description: item.description || '',
        coverImage: item.cover_image || '/images/project-placeholder.png',
        previewImages: [],
        technologies: (item.technologies as any[])?.map((t) => t.name) || [],
        featured: (item.priority ?? 0) > 0,
        status: item.status || 'Completed',
        year: item.year || '2026',
        role: item.role || 'Full-Stack Developer',
        problem: item.problem || '',
        solution: item.solution || '',
        architecture: item.architecture || [],
        highlights: item.highlights || [],
        contribution: item.contribution || '',
        challenges: [],
        learnings: [],
        links: {
          demo: item.demo_url || undefined,
          repository: item.repo_url || undefined,
        },
        visual: {
          type: 'mockup',
          coverImage: item.cover_image || '/images/project-placeholder.png',
          alt: item.title,
        },
      }));

      const catSet = new Set<string>();
      projects.forEach((p) => {
        if (p.category) catSet.add(p.category);
      });
      if (catSet.size > 0) {
        categories = Array.from(catSet);
      }
    }
  } catch {
    // Fallback gracefully to JSON
  }

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
          breadcrumb={[
            { label: 'Home', href: '/' },
            { label: 'Projects' },
          ]}
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
