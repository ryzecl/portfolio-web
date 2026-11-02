'use client';

import React from 'react';
import { CertificateItem } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';

interface CertificateCardProps {
  certificate: CertificateItem;
  onSelect: (cert: CertificateItem) => void;
}

export function CertificateCard({
  certificate,
  onSelect,
}: CertificateCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(certificate)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(certificate);
        }
      }}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-surface border border-border hover:border-accent/60 hover:bg-surface-raised transition-all duration-200 overflow-hidden cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent h-full min-h-[140px]"
      aria-label={`View certificate details for ${certificate.title}`}
    >
      {/* Top Row: Category Pill + Up-Right Arrow Icon */}
      <div className="flex items-center justify-between gap-2 w-full mb-3">
        <span className="inline-block text-[10px] sm:text-[11px] font-mono font-medium tracking-wider uppercase px-2 py-0.5 rounded-md bg-surface-raised border border-border/80 text-muted group-hover:text-accent group-hover:border-accent/30 transition-colors">
          {certificate.category}
        </span>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-border bg-surface-raised flex items-center justify-center text-muted group-hover:text-foreground group-hover:border-accent/50 group-hover:bg-accent/10 transition-all shrink-0">
          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
        </div>
      </div>

      {/* Bottom Content: 1-line Truncated Title + Issuer & Year */}
      <div className="mt-auto pt-1 w-full overflow-hidden">
        <h4
          title={certificate.title}
          className="text-sm sm:text-[15px] font-semibold text-foreground group-hover:text-accent transition-colors leading-snug truncate"
        >
          {certificate.title}
        </h4>
        <p className="text-xs text-muted mt-1 font-mono truncate">
          {certificate.issuer} • {certificate.issueDate}
        </p>
      </div>
    </div>
  );
}
