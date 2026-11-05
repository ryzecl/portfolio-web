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
import { ArrowLeft } from 'lucide-react';

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
    return { title: 'Education Detail · Admin CMS' };
  }

  const majorName = edu.major || edu.role || 'Education';
  const instName = edu.institution || edu.organization || 'Institution';

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
  const majorName = edu.major || edu.role || 'Program of Study';
  const instName = edu.institution || edu.organization || 'Institution';
  const isCurrent = edu.is_current || !edu.end_date;
  const dateRange = `${formatExperienceDate(edu.start_date)} – ${
    isCurrent ? 'Present' : formatExperienceDate(edu.end_date)
  }`;
  const achievementsList = edu.achievements || edu.highlights || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Bar: Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-3">
        <Link
          href="/admin/education"
          className="inline-flex items-center text-xs font-mono text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Education</span>
        </Link>

        <EducationDetailActions education={edu} />
      </div>

      {/* Main Education Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted">
          <span className="font-medium text-foreground">Priority #{edu.priority ?? 1}</span>
          <span className="text-border">·</span>
          {isCurrent ? (
            <span className="text-emerald-400 font-medium">Present (Enrolled)</span>
          ) : (
            <span>Completed</span>
          )}
          <span className="text-border">·</span>
          <span>{dateRange}</span>
          {edu.gpa && (
            <>
              <span className="text-border">·</span>
              <span className="text-foreground">GPA {edu.gpa}</span>
            </>
          )}
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
            {majorName}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-sm font-mono text-muted">
            <span className="text-foreground font-semibold">{instName}</span>
            {edu.program && (
              <>
                <span className="text-border">·</span>
                <span>{edu.program}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column (2 Cols): Focus & Highlights */}
        <div className="md:col-span-2 space-y-6">
          {edu.description && (
            <section className="rounded-xl border border-border bg-surface p-6 space-y-2">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
                Academic Focus &amp; Summary
              </h2>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                {edu.description}
              </p>
            </section>
          )}

          {achievementsList.length > 0 && (
            <section className="rounded-xl border border-border bg-surface p-6 space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
                Academic Achievements &amp; Coursework ({achievementsList.length})
              </h2>
              <ul className="space-y-2.5">
                {achievementsList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <FormattedPoint text={item} className="leading-relaxed" />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column (1 Col): System Record */}
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-surface p-5 space-y-2.5 font-mono text-xs">
            <h2 className="text-xs uppercase tracking-wider text-muted">
              Record Info
            </h2>
            <div>
              <span className="text-muted block text-[10px] uppercase">ID</span>
              <span className="text-foreground break-all select-all text-[11px]">
                {edu.id}
              </span>
            </div>
            {edu.created_at && (
              <div>
                <span className="text-muted block text-[10px] uppercase">Created</span>
                <span className="text-foreground text-[11px]">
                  {new Date(edu.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
