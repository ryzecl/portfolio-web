'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CertificateItem } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';

interface CredentialDialogProps {
  item: CertificateItem | null;
  type?: 'certificate' | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CredentialDialog({
  item,
  isOpen,
  onClose,
}: CredentialDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-surface border border-border text-foreground p-6 sm:p-8 rounded-2xl shadow-2xl">
        {/* Top Metadata Row: Category Pill & Issue Year */}
        <div className="flex items-center gap-2.5 mb-3 pr-8">
          <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-wider uppercase px-2.5 py-1 rounded-md bg-surface-raised border border-border text-accent">
            {item.category}
          </span>
          <span className="text-xs font-mono text-muted">
            Issued {item.issueDate}
          </span>
        </div>

        {/* Header: Title and Issuer */}
        <DialogHeader className="space-y-1.5 text-left mb-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
            {item.title}
          </DialogTitle>
          <p className="text-xs sm:text-sm font-mono text-muted font-medium">
            Issued by <span className="text-foreground">{item.issuer}</span>
          </p>
        </DialogHeader>

        {/* Summary Description */}
        <div className="text-xs sm:text-sm text-muted leading-relaxed mb-6 border-t border-border/60 pt-4">
          {item.summary}
        </div>

        {/* Competencies / Skills Tags without icon clutter */}
        <div className="space-y-2 mb-6">
          <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-muted font-medium">
            Verified Competencies
          </div>
          <div className="flex flex-wrap gap-1.5">
            {item.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 text-xs rounded-md bg-surface-raised border border-border text-foreground font-mono"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Credential Identifier & Verification Link */}
        <div className="pt-4 border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 font-mono">
            <span className="text-[10px] text-muted block uppercase tracking-wider">
              Credential Identifier
            </span>
            <span className="text-foreground font-semibold">
              {item.credentialId || 'AUTHENTICATED'}
            </span>
          </div>

          {item.credentialUrl ? (
            <a
              href={item.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-raised hover:bg-accent hover:text-white border border-border hover:border-accent font-medium text-xs text-foreground transition-all duration-200 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent shrink-0"
            >
              <span>Verify Official Credential</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : (
            <span className="text-xs text-muted font-mono italic">
              Verified Institutional Record
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
