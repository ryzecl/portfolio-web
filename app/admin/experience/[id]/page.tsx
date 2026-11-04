// app/admin/experience/[id]/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/server';
import { ExperienceItem } from '@/types/credentials';
import { formatExperienceDate } from '@/lib/utils';
import { FormattedPoint } from '@/components/ui/dynamic-point-list';
import { ExperienceDetailActions } from '@/components/admin/experience-detail-actions';
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
  Briefcase,
  Calendar,
  ExternalLink,
  Building2,
  Clock,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: exp } = await supabase
    .from('experiences')
    .select('role, organization')
    .eq('id', id)
    .single();

  if (!exp) {
    return { title: 'Detail Pengalaman · Admin CMS' };
  }

  return {
    title: `${exp.role} at ${exp.organization} · Admin CMS`,
  };
}

export default async function AdminExperienceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: rawExp, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !rawExp) {
    notFound();
  }

  const exp = rawExp as ExperienceItem;
  const isCurrent = exp.is_current || !exp.end_date;
  const dateRange = `${formatExperienceDate(exp.start_date)} – ${
    isCurrent ? 'Present' : formatExperienceDate(exp.end_date)
  }`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <Link
          href="/admin/experience"
          className="inline-flex items-center text-xs font-mono text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Daftar Pengalaman</span>
        </Link>

        <ExperienceDetailActions experience={exp} />
      </div>

      {/* Main Hero Header Card */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs border-accent/40 text-accent bg-accent/5">
              Prioritas #{exp.priority ?? 1}
            </Badge>

            {isCurrent ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Aktif (Present)
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono bg-surface-raised border border-border text-muted">
                Selesai (Completed)
              </span>
            )}

            {(exp.industry || exp.location) && (
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-surface-raised border border-border text-foreground/80 flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-muted" />
                {exp.industry || exp.location}
              </span>
            )}
          </div>

          <div className="text-xs font-mono text-muted flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            <span className="text-foreground font-medium">{dateRange}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-accent shrink-0 hidden sm:block" />
            <span>{exp.role}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-sm font-mono text-muted">
            <span className="text-foreground font-semibold">{exp.organization}</span>
            {exp.organization_url && (
              <a
                href={
                  exp.organization_url.startsWith('http')
                    ? exp.organization_url
                    : `https://${exp.organization_url}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:underline text-xs"
              >
                <span>Visit {exp.organization}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Detail Content Sections */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column (2 Cols): Description & Highlights */}
        <div className="md:col-span-2 space-y-6">
          {/* Ringkasan Peran (Description) */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono flex items-center gap-2">
                <Info className="w-4 h-4 text-accent" />
                <span>Ringkasan Peran (Role Summary)</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted">
                Deskripsi umum tanggung jawab dan kontribusi dalam peran ini.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exp.description ? (
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {exp.description}
                </p>
              ) : (
                <p className="text-xs font-mono text-muted italic">
                  Belum ada ringkasan deskripsi yang ditambahkan.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Key Focus & Responsibilities */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Key Focus &amp; Responsibilities</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted">
                Poin-poin spesifik tanggung jawab dan pencapaian kerja yang tampil di public accordion.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exp.highlights && exp.highlights.length > 0 ? (
                <ul className="space-y-3">
                  {exp.highlights.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      <FormattedPoint text={point} className="leading-relaxed" />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs font-mono text-muted italic">
                  Belum ada poin tanggung jawab yang ditambahkan.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Tech Stack & Metadata */}
        <div className="space-y-6">
          {/* Technologies Used */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                <span>Technologies &amp; Tools</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted">
                Stack teknologi yang diterapkan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exp.technologies && exp.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-surface-raised border border-border text-xs font-mono text-foreground/80 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono text-muted italic">
                  Tidak ada data teknologi.
                </p>
              )}
            </CardContent>
          </Card>

          {/* System Metadata */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>Informasi Sistem</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-muted block text-[11px]">Database Record ID:</span>
                <span className="text-foreground break-all text-[11px] select-all">
                  {exp.id}
                </span>
              </div>

              <div>
                <span className="text-muted block text-[11px]">Dibuat Pada:</span>
                <span className="text-foreground">
                  {exp.created_at ? new Date(exp.created_at).toLocaleString('id-ID') : '-'}
                </span>
              </div>

              {exp.updated_at && (
                <div>
                  <span className="text-muted block text-[11px]">Terakhir Diperbarui:</span>
                  <span className="text-foreground">
                    {new Date(exp.updated_at).toLocaleString('id-ID')}
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
