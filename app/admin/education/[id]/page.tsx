// app/admin/education/[id]/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/server';
import { EducationItem } from '@/types/credentials';
import { formatExperienceDate } from '@/lib/utils';
import { FormattedPoint } from '@/components/ui/dynamic-point-list';
import { EducationDetailActions } from '@/components/admin/education-detail-actions';
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
  GraduationCap,
  Calendar,
  Building2,
  Clock,
  Award,
  BookOpen,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  let { data: edu } = await supabase
    .from('educations')
    .select('major, institution, role, organization')
    .eq('id', id)
    .single();

  if (!edu) {
    const fallback = await supabase
      .from('experiences')
      .select('role, organization')
      .eq('id', id)
      .single();
    edu = fallback.data as any;
  }

  if (!edu) {
    return { title: 'Detail Pendidikan · Admin CMS' };
  }

  const majorName = edu.major || edu.role || 'Pendidikan';
  const instName = edu.institution || edu.organization || 'Institusi';

  return {
    title: `${majorName} · ${instName} · Admin CMS`,
  };
}

export default async function AdminEducationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  let { data: rawEdu, error } = await supabase
    .from('educations')
    .select('*')
    .eq('id', id)
    .single();

  // Fallback jika belum di-migrasikan dari experiences
  if (error || !rawEdu) {
    const fallback = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single();
    rawEdu = fallback.data;
  }

  if (!rawEdu) {
    notFound();
  }

  const edu = rawEdu as EducationItem;
  const majorName = edu.major || edu.role || 'Program Studi';
  const instName = edu.institution || edu.organization || 'Institusi';
  const isCurrent = edu.is_current || !edu.end_date;
  const dateRange = `${formatExperienceDate(edu.start_date)} – ${
    isCurrent ? 'Present' : formatExperienceDate(edu.end_date)
  }`;
  const achievementsList = edu.achievements || edu.highlights || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <Link
          href="/admin/education"
          className="inline-flex items-center text-xs font-mono text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Daftar Pendidikan</span>
        </Link>

        <EducationDetailActions education={edu} />
      </div>

      {/* Main Hero Header Card */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs border-accent/40 text-accent bg-accent/5">
              Prioritas #{edu.priority ?? 1}
            </Badge>

            {isCurrent ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Sedang Ditempuh (Present)
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono bg-surface-raised border border-border text-muted">
                Lulus (Completed)
              </span>
            )}

            {edu.program && (
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-accent/10 border border-accent/30 text-accent font-medium">
                {edu.program}
              </span>
            )}

            {edu.gpa && (
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-surface-raised border border-border text-foreground font-semibold">
                GPA: <span className="text-accent">{edu.gpa}</span>
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
            <GraduationCap className="w-6 h-6 text-accent shrink-0 hidden sm:block" />
            <span>{majorName}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-sm font-mono text-muted">
            <Building2 className="w-4 h-4 text-muted/70" />
            <span className="text-foreground font-semibold">{instName}</span>
            {edu.program && (
              <>
                <span className="text-border">·</span>
                <span className="text-muted/80">{edu.program}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detail Content Sections */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column (2 Cols): Description & Honors */}
        <div className="md:col-span-2 space-y-6">
          {/* Ringkasan Fokus Studi (Description) */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono flex items-center gap-2">
                <Info className="w-4 h-4 text-accent" />
                <span>Fokus Studi / Ringkasan Akademik</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted">
                Ringkasan bidang ilmu, riset, atau fokus keahlian selama menempuh studi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {edu.description ? (
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {edu.description}
                </p>
              ) : (
                <p className="text-xs font-mono text-muted italic">
                  Belum ada ringkasan deskripsi yang ditambahkan.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Key Distinctions & Honors (Achievements) */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Key Distinctions &amp; Honors</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted">
                Prestasi akademik, kejuaraan, atau penghargaan yang tampil di public accordion.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {achievementsList.length > 0 ? (
                <ul className="space-y-3">
                  {achievementsList.map((point: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/90">
                      <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <FormattedPoint text={point} className="leading-relaxed" />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs font-mono text-muted italic">
                  Belum ada poin prestasi atau distingsi akademik yang ditambahkan.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Academic Summary & Metadata */}
        <div className="space-y-6">
          {/* Ringkasan Akademik */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                <span>Ringkasan Akademik</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-muted block text-[11px]">Jenjang / Program:</span>
                <span className="text-foreground font-semibold">
                  {edu.program || 'Tidak dispesifikasi'}
                </span>
              </div>

              <div>
                <span className="text-muted block text-[11px]">Nilai Akhir / IPK:</span>
                <span className="text-foreground font-semibold">
                  {edu.gpa ? (
                    <span className="text-accent">{edu.gpa}</span>
                  ) : (
                    '-'
                  )}
                </span>
              </div>

              <div>
                <span className="text-muted block text-[11px]">Status Perkuliahan:</span>
                <span className="text-foreground">
                  {isCurrent ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Sedang Aktif Menempuh
                    </span>
                  ) : (
                    'Telah Selesai / Lulus'
                  )}
                </span>
              </div>
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
                  {edu.id}
                </span>
              </div>

              <div>
                <span className="text-muted block text-[11px]">Dibuat Pada:</span>
                <span className="text-foreground">
                  {edu.created_at ? new Date(edu.created_at).toLocaleString('id-ID') : '-'}
                </span>
              </div>

              {edu.updated_at && (
                <div>
                  <span className="text-muted block text-[11px]">Terakhir Diperbarui:</span>
                  <span className="text-foreground">
                    {new Date(edu.updated_at).toLocaleString('id-ID')}
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
