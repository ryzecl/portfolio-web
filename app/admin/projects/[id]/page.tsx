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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeft,
  FolderKanban,
  Calendar,
  ExternalLink,
  Tag,
  Sparkles,
  Layers,
  FileText,
  CheckCircle2,
  Clock,
  Cpu,
  Image as ImageIcon,
  AlertTriangle,
  Lightbulb,
  UserCheck,
  Globe,
  Code2,
} from 'lucide-react';

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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar: Back Link & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-3 border-b border-border">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Projects</span>
        </Link>

        <ProjectDetailActions project={project} />
      </div>

      {/* Main Hero Banner */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="font-mono text-xs border-accent/40 text-accent bg-accent/5"
            >
              <Tag className="w-3 h-3 mr-1" />
              {project.category?.name || 'Uncategorized'}
            </Badge>

            {project.priority > 0 && project.priority <= 4 ? (
              <Badge className="font-mono text-xs bg-accent text-white border-accent flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                #{project.priority} Featured (Landing Page)
              </Badge>
            ) : project.priority > 4 ? (
              <Badge variant="secondary" className="font-mono text-xs">
                Priority #{project.priority}
              </Badge>
            ) : (
              <Badge variant="outline" className="font-mono text-xs text-muted">
                Standard Priority (0)
              </Badge>
            )}

            <Badge
              variant="outline"
              className="font-mono text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
            >
              {project.status || 'Completed'}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            <span className="text-foreground font-semibold">
              {project.year || 'N/A'}
            </span>
            {project.role && (
              <>
                <span className="text-border">·</span>
                <span>{project.role}</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {project.title}
            </h1>
            <span className="text-xs font-mono text-muted">
              /{project.slug}
            </span>
          </div>

          <p className="text-sm text-foreground/85 leading-relaxed">
            {project.summary}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column (2 Cols): Visuals & Case Study */}
        <div className="md:col-span-2 space-y-6">
          {/* Visuals Card: Cover Image & Preview Images */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-accent" />
                Visual Assets &amp; Media ({(project.cover_image ? 1 : 0) + previewImages.length} Gambar)
              </CardTitle>
              <CardDescription className="text-xs text-muted">
                Primary portfolio card cover and interactive case study gallery.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.cover_image ? (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-muted uppercase tracking-wider block">
                    Primary Cover Image:
                  </span>
                  <div className="relative aspect-video rounded-xl border border-border overflow-hidden bg-surface-raised">
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-border bg-surface-raised/40 text-center text-xs font-mono text-muted">
                  No cover image uploaded yet.
                </div>
              )}

              {previewImages.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <span className="text-[11px] font-mono text-muted uppercase tracking-wider block">
                    Interactive Detail Gallery ({previewImages.length} Gambar):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {previewImages.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-lg border border-border overflow-hidden bg-surface-raised"
                      >
                        <img
                          src={url}
                          alt={`${project.title} preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-background/80 text-[10px] font-mono text-muted">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deskripsi & Studi Kasus */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                Case Study Narrative (Problem, Solution &amp; Contribution)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm">
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider block">
                  Full Description
                </span>
                {project.description ? (
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                ) : (
                  <p className="text-xs font-mono text-muted italic">
                    No narrative description provided.
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-border/60">
                <div className="p-3.5 rounded-xl bg-surface-raised border border-border/80 space-y-1.5">
                  <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Problem Statement
                  </span>
                  {project.problem ? (
                    <p className="text-xs text-foreground/90 leading-relaxed">
                      {project.problem}
                    </p>
                  ) : (
                    <p className="text-xs font-mono text-muted italic">
                      Belum diisi.
                    </p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-surface-raised border border-border/80 space-y-1.5">
                  <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Engineered Solution
                  </span>
                  {project.solution ? (
                    <p className="text-xs text-foreground/90 leading-relaxed">
                      {project.solution}
                    </p>
                  ) : (
                    <p className="text-xs font-mono text-muted italic">
                      Belum diisi.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 space-y-1.5">
                <span className="text-xs font-mono font-semibold text-accent flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  Role &amp; Engineering Contribution
                </span>
                {project.contribution ? (
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    {project.contribution}
                  </p>
                ) : (
                  <p className="text-xs font-mono text-muted italic">
                    Belum ada rincian kontribusi spesifik.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Key Highlights & Architecture */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" />
                Highlights &amp; Spesifikasi Arsitektur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                  Key Highlights ({highlights.length})
                </span>
                {highlights.length > 0 ? (
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
                ) : (
                  <p className="text-xs font-mono text-muted italic">
                    Belum ada poin highlight.
                  </p>
                )}
              </div>

              <div className="space-y-2.5 pt-4 border-t border-border/60">
                <span className="text-xs font-mono font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-accent" />
                  Architecture &amp; Engineering ({architecture.length})
                </span>
                {architecture.length > 0 ? (
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
                ) : (
                  <p className="text-xs font-mono text-muted italic">
                    No architecture specifications added.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Tech Stack, External Links, System Metadata */}
        <div className="space-y-6">
          {/* Tech Stack Card */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-accent" />
                Tech Stack ({technologies.length})
              </CardTitle>
              <CardDescription className="text-xs text-muted">
                Relasi many-to-many dari tabel project_technologies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <span
                      key={tech.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-raised border border-border text-xs font-mono text-foreground"
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
                  Belum ada teknologi yang dipilih.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tautan Eksternal */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent" />
                Tautan Proyek
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-muted block uppercase tracking-wider">
                  Live Demo URL
                </span>
                {project.demo_url ? (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full p-2.5 rounded-lg bg-surface-raised hover:bg-accent hover:text-white border border-border text-foreground transition-all group font-sans text-xs font-medium"
                  >
                    <span className="truncate pr-2">{project.demo_url}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                ) : (
                  <span className="text-muted italic">Tidak ada demo URL</span>
                )}
              </div>

              <div className="pt-2 border-t border-border/60 space-y-1">
                <span className="text-[10px] text-muted block uppercase tracking-wider">
                  Repository URL
                </span>
                {project.repo_url ? (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full p-2.5 rounded-lg bg-surface-raised hover:bg-accent hover:text-white border border-border text-foreground transition-all group font-sans text-xs font-medium"
                  >
                    <span className="truncate pr-2">{project.repo_url}</span>
                    <Code2 className="w-3.5 h-3.5 shrink-0" />
                  </a>
                ) : (
                  <span className="text-muted italic">Tidak ada repo URL</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Metadata */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                Informasi Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-muted block text-[11px]">
                  Database Record ID:
                </span>
                <span className="text-foreground break-all text-[11px] select-all">
                  {project.id}
                </span>
              </div>

              <div>
                <span className="text-muted block text-[11px]">Dibuat Pada:</span>
                <span className="text-foreground">
                  {project.created_at
                    ? new Date(project.created_at).toLocaleString('id-ID')
                    : '-'}
                </span>
              </div>

              {project.updated_at && (
                <div>
                  <span className="text-muted block text-[11px]">
                    Terakhir Diperbarui:
                  </span>
                  <span className="text-foreground">
                    {new Date(project.updated_at).toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
