'use client';

import React from 'react';
import { MagicBento, MagicBentoItem } from '@/components/ui/magic-bento';
import { SiteData } from '@/lib/types';
import { Mail, MapPin, ArrowUpRight, Globe, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/icons';

interface ContactBentoProps {
  site: SiteData;
}

export function ContactBento({ site }: ContactBentoProps) {
  const items: MagicBentoItem[] = [
    {
      id: 'availability',
      colSpan: 2,
      rowSpan: 1,
      content: (
        <div className="flex flex-col justify-between h-full p-1 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium">
                Current Availability
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              {site.identity.statusLabel || 'Available for opportunities'}
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Open to full-stack, frontend, and backend developer internships, engineering roles, and selective client projects.
            </p>
          </div>

          <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs font-mono text-muted">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>{site.identity.location} (Remote / Hybrid)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-raised border border-border text-foreground font-semibold">
              UTC+7 · WIB
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'email',
      colSpan: 1,
      rowSpan: 1,
      href: `mailto:${site.contact.email}`,
      target: '_blank',
      rel: 'noopener noreferrer',
      content: (
        <div className="flex flex-col justify-between h-full p-1 group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
                <Mail className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div className="pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                Primary Channel
              </span>
              <h4 className="text-sm font-bold text-foreground">Direct Email</h4>
              <p className="text-xs font-mono text-muted group-hover:text-foreground transition-colors mt-0.5 break-all">
                {site.contact.email}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-muted group-hover:text-accent transition-colors pt-3">
            Open in mail app &rarr;
          </span>
        </div>
      ),
    },
    {
      id: 'github',
      colSpan: 1,
      rowSpan: 1,
      href: site.contact.github || 'https://github.com',
      target: '_blank',
      rel: 'noopener noreferrer',
      content: (
        <div className="flex flex-col justify-between h-full p-1 group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-surface-raised border border-border flex items-center justify-center text-foreground">
                <GithubIcon className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div className="pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                Code & Repositories
              </span>
              <h4 className="text-sm font-bold text-foreground">GitHub</h4>
              <p className="text-xs text-muted leading-relaxed mt-0.5">
                Explore source code, repositories, and technical deliverables.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-muted group-hover:text-foreground transition-colors pt-3">
            github.com &rarr;
          </span>
        </div>
      ),
    },
    {
      id: 'linkedin',
      colSpan: 1,
      rowSpan: 1,
      href: site.contact.linkedin || 'https://linkedin.com',
      target: '_blank',
      rel: 'noopener noreferrer',
      content: (
        <div className="flex flex-col justify-between h-full p-1 group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
                <LinkedinIcon className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div className="pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                Professional Network
              </span>
              <h4 className="text-sm font-bold text-foreground">LinkedIn</h4>
              <p className="text-xs text-muted leading-relaxed mt-0.5">
                Connect professionally and review career timeline & updates.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-muted group-hover:text-accent transition-colors pt-3">
            linkedin.com &rarr;
          </span>
        </div>
      ),
    },
    {
      id: 'location',
      colSpan: 1,
      rowSpan: 1,
      content: (
        <div className="flex flex-col justify-between h-full p-1">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-xl bg-surface-raised border border-border flex items-center justify-center text-muted">
              <Globe className="w-4 h-4" />
            </div>
            <div className="pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                Work Mode & Hub
              </span>
              <h4 className="text-sm font-bold text-foreground">Remote / Hybrid</h4>
              <p className="text-xs text-muted leading-relaxed mt-0.5">
                Collaborating seamlessly with teams across Indonesia and international timezones.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-accent pt-3">
            <Sparkles className="w-3 h-3" />
            <span>Fast turnaround</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full">
      <MagicBento
        items={items}
        columns={2}
        rowHeight={180}
        gap={16}
        glowColor="#2563eb"
        enableBorderGlow={true}
        enableSpotlight={true}
        spotlightRadius={300}
        enableTilt={false}
        enableMagnetism={false}
        clickEffect={false}
        enableStars={false}
        theme="light"
        className="w-full"
      />
    </div>
  );
}
