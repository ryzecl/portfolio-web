// app/admin/certificates/[id]/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/server';
import { Certificate } from '@/types/credentials';
import { CertificateDetailActions } from '@/components/admin/certificate-detail-actions';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cert } = await supabase
    .from('certificates')
    .select('title, issuer')
    .eq('id', id)
    .single();

  if (!cert) {
    return { title: 'Certificate Detail · Admin CMS' };
  }

  return {
    title: `${cert.title} · ${cert.issuer} · Admin CMS`,
  };
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-';
  if (/^\d{4}$/.test(dateStr)) return dateStr;
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    }
  } catch {}
  return dateStr;
}

export default async function AdminCertificateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cert, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !cert) {
    notFound();
  }

  const certificate = cert as Certificate;

  const { data: certCategories } = await supabase
    .from('certificate_categories')
    .select('name')
    .order('created_at', { ascending: true });

  const categoryNames = certCategories?.map((c) => c.name) || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Bar: Navigation & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-3 border-b border-border">
        <Link
          href="/admin/certificates"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Certificates</span>
        </Link>

        <CertificateDetailActions
          certificate={certificate}
          availableCategories={categoryNames}
        />
      </div>

      {/* Main Header Banner */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted">
          <span className="font-medium text-foreground">{certificate.category}</span>
          <span className="text-border">·</span>
          {certificate.priority === 1 ? (
            <span className="text-accent font-medium">#1 Spotlight</span>
          ) : certificate.priority && certificate.priority > 1 ? (
            <span>Priority #{certificate.priority}</span>
          ) : (
            <span>Archive</span>
          )}
          <span className="text-border">·</span>
          <span>Issued {formatDate(certificate.issue_date)}</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
            {certificate.title}
          </h1>

          <p className="text-sm font-mono text-muted">
            Issued by <strong className="text-foreground">{certificate.issuer}</strong>
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column (2 Cols): Verification & Description */}
        <div className="md:col-span-2 space-y-6">
          <section className="rounded-xl border border-border bg-surface p-6 space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
              Verification &amp; Credential
            </h2>

            <div className="space-y-1 font-mono text-xs">
              <span className="text-[10px] text-muted uppercase tracking-wider block">
                Credential Identifier
              </span>
              <span className="font-semibold text-foreground text-sm tracking-wide block break-all">
                {certificate.credential_id || 'None'}
              </span>
            </div>

            {certificate.credential_url && (
              <div className="pt-3 border-t border-border/70 space-y-1 font-mono text-xs">
                <span className="text-[10px] text-muted uppercase tracking-wider block">
                  Verification Link
                </span>
                <a
                  href={certificate.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full p-2.5 rounded-lg bg-surface-raised hover:border-accent/40 border border-border text-foreground transition-colors font-sans text-xs"
                >
                  <span className="truncate pr-2 font-mono text-xs">{certificate.credential_url}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted" />
                </a>
              </div>
            )}
          </section>

          {certificate.summary && (
            <section className="rounded-xl border border-border bg-surface p-6 space-y-2">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
                Summary &amp; Scope
              </h2>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                {certificate.summary}
              </p>
            </section>
          )}

          {certificate.skills && certificate.skills.length > 0 && (
            <section className="rounded-xl border border-border bg-surface p-6 space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted">
                Verified Skills ({certificate.skills.length})
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {certificate.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-surface-raised border border-border text-xs font-mono text-foreground font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
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
                {certificate.id}
              </span>
            </div>
            {certificate.created_at && (
              <div>
                <span className="text-muted block text-[10px] uppercase">Created</span>
                <span className="text-foreground text-[11px]">
                  {new Date(certificate.created_at).toLocaleDateString('en-US', {
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
