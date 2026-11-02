'use client';

import React from 'react';
import { MagicBento, MagicBentoItem } from '@/components/ui/magic-bento';
import { SiteData } from '@/lib/types';
import { Mail, MapPin, ArrowUpRight, FileText } from 'lucide-react';
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
        <div className="flex flex-col justify-between h-full p-2.5 sm:p-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-muted font-medium">
                Current Status
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
              {site.identity.statusLabel || 'Open to opportunities'}
            </h3>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted">
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
        <div className="flex flex-col justify-between h-full p-2.5 sm:p-3 group">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-accent">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div>
            <span className="text-[10px] font-mono text-muted block">Email</span>
            <h4 className="text-xs sm:text-sm font-bold text-foreground truncate mt-0.5">
              {site.contact.email}
            </h4>
          </div>
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
        <div className="flex flex-col justify-between h-full p-2.5 sm:p-3 group">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-accent">
              <LinkedinIcon className="w-3.5 h-3.5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div>
            <span className="text-[10px] font-mono text-muted block">LinkedIn</span>
            <h4 className="text-xs sm:text-sm font-bold text-foreground truncate mt-0.5">
              Ferry Noer Hendriawan
            </h4>
          </div>
        </div>
      ),
    },
    {
      id: 'github',
      colSpan: 1,
      rowSpan: 1,
      href: site.contact.github || 'https://github.com/ryzecl',
      target: '_blank',
      rel: 'noopener noreferrer',
      content: (
        <div className="flex flex-col justify-between h-full p-2.5 sm:p-3 group">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-foreground">
              <GithubIcon className="w-3.5 h-3.5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div>
            <span className="text-[10px] font-mono text-muted block">GitHub</span>
            <h4 className="text-xs sm:text-sm font-bold text-foreground truncate mt-0.5">
              @ryzecl
            </h4>
          </div>
        </div>
      ),
    },
    {
      id: 'resume',
      colSpan: 1,
      rowSpan: 1,
      href: site.contact.cv || '/cv.pdf',
      target: '_blank',
      rel: 'noopener noreferrer',
      content: (
        <div className="flex flex-col justify-between h-full p-2.5 sm:p-3 group">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-accent">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div>
            <span className="text-[10px] font-mono text-muted block">Curriculum Vitae</span>
            <h4 className="text-xs sm:text-sm font-bold text-foreground truncate mt-0.5">
              Download CV / Resume
            </h4>
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
        rowHeight={115}
        gap={14}
        glowColor="#2563eb"
        enableBorderGlow={true}
        enableSpotlight={true}
        spotlightRadius={280}
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
