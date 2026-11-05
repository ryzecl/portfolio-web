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
import { ArrowLeft, ExternalLink } from 'lucide-react';

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
    return { title: 'Experience Detail · Admin CMS' };
  }

  return {
    title: `${exp.role} · ${exp.organization} · Admin CMS`,
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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Bar: Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-3">
        <Link
          href="/admin/experience"
          className="inline-flex items-center text-xs font-mono text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Experience</span>
        </Link>

        <ExperienceDetailActions experience={exp} />
      </div>

      {/* Main Role Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted">
          <span className="font-medium text-foreground">Priority #{exp.priority ?? 1}</span>
          <span className="text-border">·</span>
          {isCurrent ? (
            <span className="text-emerald-400 font-medium">Present (Current)</span>
          ) : (
            <span>Completed</span>
          )}
          <span className="text-border">·</span>
          <span>{dateRange}</span>
          {(exp.industry || exp.location) && (
            <>
              <span className="text-border">·</span>
              <span>{exp.industry || exp.location}</span>
            </>
          )}
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
            {exp.role}
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
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Detail Content Sections */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column (2 Cols): Overview & Highlights */}
        <div className="md:col-span-2 space-y-6">
          {exp.description && (
            <section className="rounded-xl border border-border bg-surface p-6 space-y-2">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
                Role Summary
              </h2>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                {exp.description}
              </p>
            </section>
          )}

          {exp.highlights && exp.highlights.length > 0 && (
            <section className="rounded-xl border border-border bg-surface p-6 space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
                Key Responsibilities &amp; Highlights ({exp.highlights.length})
              </h2>
              <ul className="space-y-2.5">
                {exp.highlights.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <FormattedPoint text={point} className="leading-relaxed" />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column (1 Col): Technologies & System Metadata */}
        <div className="space-y-6">
          {exp.technologies && exp.technologies.length > 0 && (
            <section className="rounded-xl border border-border bg-surface p-5 space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
                Technologies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {exp.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-surface-raised border border-border text-xs font-mono text-foreground/90 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-xl border border-border bg-surface p-5 space-y-2.5 font-mono text-xs">
            <h2 className="text-xs uppercase tracking-wider text-muted">
              Record Info
            </h2>
            <div>
              <span className="text-muted block text-[10px] uppercase">ID</span>
              <span className="text-foreground break-all select-all text-[11px]">
                {exp.id}
              </span>
            </div>
            {exp.created_at && (
              <div>
                <span className="text-muted block text-[10px] uppercase">Created</span>
                <span className="text-foreground text-[11px]">
                  {new Date(exp.created_at).toLocaleDateString('en-US', {
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
