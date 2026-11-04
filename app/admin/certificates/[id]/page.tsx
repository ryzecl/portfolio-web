// app/admin/certificates/[id]/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/server';
import { Certificate } from '@/types/credentials';
import { CertificateDetailActions } from '@/components/admin/certificate-detail-actions';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Tag,
  Sparkles,
  Layers,
  FileText,
  CheckCircle2,
} from 'lucide-react';

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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar: Back Link & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-2 border-b border-border">
        <Link
          href="/admin/certificates"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Certificates</span>
        </Link>

        <CertificateDetailActions
          certificate={certificate}
          availableCategories={categoryNames}
        />
      </div>

      {/* Main Header Banner */}
      <div className="p-6 rounded-2xl bg-surface border border-border relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs border-accent/40 text-accent bg-accent/5">
                <Tag className="w-3 h-3 mr-1" />
                {certificate.category}
              </Badge>

              {certificate.priority === 1 ? (
                <Badge className="font-mono text-xs bg-accent text-white border-accent flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  #1 Spotlight (Large Landing Card)
                </Badge>
              ) : certificate.priority && certificate.priority > 1 ? (
                <Badge variant="secondary" className="font-mono text-xs">
                  Priority #{certificate.priority} (Landing Page)
                </Badge>
              ) : (
                <Badge variant="outline" className="font-mono text-xs text-muted">
                  Archive Only
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {certificate.title}
            </h1>

            <p className="text-sm font-mono text-muted flex items-center gap-2">
              <span>Issued by:</span>
              <strong className="text-foreground">{certificate.issuer}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 p-3 rounded-xl bg-surface-raised border border-border/80 font-mono text-xs">
            <Calendar className="w-4 h-4 text-accent" />
            <div>
              <span className="text-[10px] text-muted block uppercase tracking-wider">Issue Date</span>
              <span className="font-semibold text-foreground">{formatDate(certificate.issue_date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Metadata & Links */}
        <div className="space-y-6 md:col-span-1">
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                Document Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-muted block uppercase tracking-wider">
                  Credential Identifier
                </span>
                <span className="font-bold text-foreground text-sm tracking-wide block break-all">
                  {certificate.credential_id || '-'}
                </span>
              </div>

              <div className="pt-3 border-t border-border/70 space-y-2">
                <span className="text-[10px] text-muted block uppercase tracking-wider">
                  Official Verification Link
                </span>
                {certificate.credential_url ? (
                  <a
                    href={certificate.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full p-2.5 rounded-lg bg-surface-raised hover:bg-accent hover:text-white border border-border text-foreground transition-all group font-sans text-xs font-medium"
                  >
                    <span className="truncate pr-2">Open Official Proof</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ) : (
                  <span className="text-muted italic">No external verification URL</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                Display Status
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 leading-relaxed">
              <p className="text-muted">
                {certificate.priority === 1 ? (
                  <>This certificate is set to <strong className="text-accent">#1 (Spotlight)</strong> and rendered as the primary large card on the portfolio landing page.</>
                ) : certificate.priority && certificate.priority > 1 ? (
                  <>This certificate is assigned to slot <strong className="text-foreground">#{certificate.priority}</strong> on the landing page credentials grid.</>
                ) : (
                  <>This certificate is cataloged in the full credentials archive at <code className="text-accent">/credentials</code>.</>
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Summary & Verified Competencies */}
        <div className="space-y-6 md:col-span-2">
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                Description &amp; Standards
              </CardTitle>
            </CardHeader>
            <CardContent>
              {certificate.summary ? (
                <p className="text-sm text-foreground/90 leading-relaxed font-sans">
                  {certificate.summary}
                </p>
              ) : (
                <p className="text-xs text-muted italic">No summary description provided.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  Verified Competencies ({certificate.skills?.length || 0})
                </CardTitle>
                <span className="text-[11px] font-mono text-muted">Official Skill Tags</span>
              </div>
            </CardHeader>
            <CardContent>
              {certificate.skills && certificate.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {certificate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-xs rounded-lg bg-surface-raised border border-border text-foreground font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted italic">No verified competencies added yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
