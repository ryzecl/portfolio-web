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
import { JsonLd } from '@/components/ui/json-ld';
import { DotBackground } from '@/components/ui/dot-background';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TechIcon } from '@/components/ui/tech-icon';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Workflow,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers,
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

  const title = `${project.title} — Project by ${site.identity.name}`;
  const description = project.summary;
  const canonical = `/projects/${slug}`;

  const ogImage =
    project.coverImage && project.coverImage.trim() !== ''
      ? project.coverImage
      : '/images/project-placeholder.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      images: [
        {
          url: ogImage,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const site = getSiteData();
  const baseUrl = `https://${site.identity.domain}`;
  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const projectNumber = String(currentIndex + 1).padStart(2, '0');
  const totalProjects = String(allProjects.length).padStart(2, '0');

  const hasDemo = Boolean(project.links?.demo && project.links.demo.trim() !== '');
  const hasRepo = Boolean(project.links?.repository && project.links.repository.trim() !== '');
  const hasAnyLink = hasDemo || hasRepo;

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description: project.summary,
    url: `${baseUrl}/projects/${slug}`,
    programmingLanguage: project.technologies,
    abstract: project.problem,
    teaches: project.solution,
    author: {
      '@type': 'Person',
      name: site.identity.name,
      url: baseUrl,
      sameAs: [site.contact.github, site.contact.linkedin].filter(Boolean),
    },
    ...(project.links?.repository ? { codeRepository: project.links.repository } : {}),
    ...(project.links?.demo ? { url: project.links.demo } : {}),
    ...(project.coverImage
      ? { image: { '@type': 'ImageObject', url: `${baseUrl}${project.coverImage}`, name: project.title } }
      : {}),
    ...(project.year ? { dateCreated: project.year } : {}),
  };

  return (
    <div className="relative min-h-screen pt-28 pb-24 sm:pt-36 sm:pb-32 bg-background text-foreground overflow-hidden">
      {/* Precision Ambient Dot Grid Background */}
      <DotBackground />

      <JsonLd data={projectSchema} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        {/* Top Breadcrumb & Index Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-border/80">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to catalog</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="text-foreground font-semibold">PROJECT {projectNumber}</span>
            <span>/</span>
            <span>{totalProjects}</span>
          </div>
        </div>

        {/* Hero Header Area */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="secondary" className="uppercase tracking-wider">
              {project.category}
            </Badge>
            <Badge
              variant={project.status === 'Completed' ? 'success' : 'accent'}
            >
              {project.status}
            </Badge>
            {project.year && (
              <Badge variant="outline" className="text-muted">
                {project.year}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground text-balance">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-3xl font-normal">
            {project.description || project.summary}
          </p>
        </header>

        {/* Media Viewer Showcase */}
        <section aria-label="Project Visual Showcase" className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-muted px-1">
            <span className="uppercase tracking-wider">Interface & Visual Architecture</span>
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
        </section>

        {/* Two-Column Editorial Case Study Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start pt-2">
          {/* Left Column: Deep Dive Narrative (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* The Problem & Solution Breakdown */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">
                  01 / Engineering Context
                </span>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  Problem & Technical Response
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="rounded-3xl border-border bg-surface shadow-xs">
                  <CardHeader className="space-y-2 pb-3">
                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted">
                      <Terminal className="w-3.5 h-3.5 text-accent" />
                      <span>The Challenge</span>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground">
                      What needed solving
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                      {project.problem}
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-border bg-surface shadow-xs">
                  <CardHeader className="space-y-2 pb-3">
                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted">
                      <Cpu className="w-3.5 h-3.5 text-accent" />
                      <span>The Solution</span>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground">
                      Technical execution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                      {project.solution}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Architecture Pipeline if available */}
            {project.architecture && project.architecture.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">
                      02 / Architecture & Data Flow
                    </span>
                    <h3 className="text-xl font-bold text-foreground tracking-tight">
                      Pipeline & Component Topology
                    </h3>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted">
                    <span>Horizontal Flow</span>
                    <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  </div>
                </div>

                <Card className="rounded-3xl border-border bg-surface shadow-xs overflow-hidden">
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    {/* Horizontal Scroller Container */}
                    <div className="relative">
                      <div className="overflow-x-auto pb-2 -mx-1 px-1">
                        <div className="flex items-center min-w-max gap-3 py-1">
                          {project.architecture.map((node, i) => (
                            <React.Fragment key={node}>
                              <div className="w-56 sm:w-64 p-4 rounded-2xl bg-surface-raised border border-border/80 hover:border-accent/40 transition-colors shadow-2xs shrink-0 flex flex-col justify-between min-h-26.25">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                                    Stage 0{i + 1}
                                  </span>
                                  <span className="text-[10px] font-mono text-muted">
                                    Phase {i + 1} of {project.architecture!.length}
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
                                  {node}
                                </p>
                              </div>

                              {i < project.architecture!.length - 1 && (
                                <div className="flex items-center justify-center shrink-0 px-0.5 text-muted">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-px bg-border" />
                                    <div className="w-6 h-6 rounded-full bg-surface-raised border border-border flex items-center justify-center text-accent shadow-2xs">
                                      <ArrowRight className="w-3 h-3" />
                                    </div>
                                    <div className="w-3 h-px bg-border" />
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Helper Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] font-mono text-muted">
                      <span>End-to-End Execution Sequence</span>
                      <span className="text-[10px] text-muted">
                        ← Scroll horizontally to inspect full flow →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Delivered Features / Capabilities */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">
                    03 / Key Deliverables
                  </span>
                  <h3 className="text-xl font-bold text-foreground tracking-tight">
                    Core Capabilities & Features
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-surface border border-border flex items-start gap-3 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contribution & Role Narrative */}
            {project.contribution && (
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">
                    04 / Role & Ownership
                  </span>
                  <h3 className="text-xl font-bold text-foreground tracking-tight">
                    Engineering Contribution
                  </h3>
                </div>

                <Card className="rounded-3xl border-border bg-surface shadow-xs">
                  <CardContent className="p-6">
                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                      {project.contribution}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Right Column: Project Specifications Sidebar (4 cols, Sticky) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <Card className="rounded-3xl border-border bg-surface shadow-sm overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted font-medium flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent" />
                  <span>Project Specs</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-muted uppercase tracking-wider block">
                    My Role
                  </span>
                  <p className="text-sm font-semibold text-foreground font-sans mt-0.5">
                    {project.role}
                  </p>
                </div>

                <Separator />

                <div>
                  <span className="text-[10px] text-muted uppercase tracking-wider block">
                    Category
                  </span>
                  <p className="text-sm font-semibold text-foreground font-sans mt-0.5">
                    {project.category}
                  </p>
                </div>

                <Separator />

                <div>
                  <span className="text-[10px] text-muted uppercase tracking-wider block">
                    Timeline & Status
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{project.year || '2026'}</Badge>
                    <Badge
                      variant={
                        project.status === 'Completed' ? 'success' : 'accent'
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <span className="text-[10px] text-muted uppercase tracking-wider block mb-2">
                    Technologies Applied
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="text-[11px] font-mono px-2.5 py-1 inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <TechIcon name={tech} className="w-3.5 h-3.5" />
                        <span>{tech}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {hasAnyLink && (
                  <>
                    <Separator />
                    <div className="space-y-2 pt-1 font-sans">
                      {hasDemo && (
                        <Button
                          variant="primary"
                          size="sm"
                          href={project.links.demo}
                          external
                          className="w-full rounded-xl justify-between cursor-pointer"
                        >
                          <span>Visit Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      {hasRepo && (
                        <Button
                          variant="secondary"
                          size="sm"
                          href={project.links.repository}
                          external
                          className="w-full rounded-xl justify-between cursor-pointer"
                        >
                          <span>Repository</span>
                          <GithubIcon className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Project Navigation Footer (Previous / Next) */}
        <nav
          aria-label="Previous and Next Project Navigation"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-12 border-t border-border"
        >
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="p-5 sm:p-6 rounded-3xl bg-surface border border-border hover:border-accent/50 transition-all flex flex-col items-start gap-2 group shadow-2xs"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted group-hover:text-accent transition-colors">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Previous Project</span>
              </span>
              <p className="text-base sm:text-lg font-bold text-foreground">
                {prevProject.title}
              </p>
            </Link>
          ) : (
            <div className="p-5 sm:p-6 rounded-3xl bg-surface/40 border border-border/40 text-muted/60 text-xs font-mono flex items-center">
              First project in catalog
            </div>
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="p-5 sm:p-6 rounded-3xl bg-surface border border-border hover:border-accent/50 transition-all flex flex-col items-end gap-2 text-right group shadow-2xs"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted group-hover:text-accent transition-colors">
                <span>Next Project</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <p className="text-base sm:text-lg font-bold text-foreground">
                {nextProject.title}
              </p>
            </Link>
          ) : (
            <div className="p-5 sm:p-6 rounded-3xl bg-surface/40 border border-border/40 text-muted/60 text-xs font-mono flex items-center justify-end">
              End of project catalog
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
