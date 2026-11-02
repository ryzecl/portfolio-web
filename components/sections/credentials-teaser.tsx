'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CertificateItem } from '@/lib/types';
import { SectionHeading } from '@/components/ui/section-heading';
import { CredentialDialog } from '@/components/credentials/credential-dialog';
import { MagicBento, MagicBentoItem } from '@/components/ui/magic-bento';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CredentialsTeaserProps {
  certificates: CertificateItem[];
}

export function CredentialsTeaser({
  certificates,
}: CredentialsTeaserProps) {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const spotlightCert = certificates[0];
  const secondaryCerts = certificates.slice(1, 4);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
        );
      }

      if (bentoRef.current) {
        tl.fromTo(
          bentoRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
          '-=0.4'
        );
      }

      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleOpenCertificate = (cert: CertificateItem) => {
    setSelectedCert(cert);
  };

  const handleCloseDialog = () => {
    setSelectedCert(null);
  };

  if (!spotlightCert) return null;

  // Ultra-clean MagicBento items: zero clutter, pure typography & confident hierarchy
  const bentoItems: MagicBentoItem[] = [
    {
      id: spotlightCert.id,
      colSpan: 2,
      rowSpan: 3,
      onClick: () => handleOpenCertificate(spotlightCert),
      content: (
        <div className="flex flex-col justify-between h-full p-3 sm:p-5 relative group cursor-pointer">
          {/* Top Row: Category + Year + Action Icon */}
          <div className="flex items-center justify-between gap-3 w-full mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-wider uppercase px-2.5 py-1 rounded-md bg-surface-raised border border-border text-accent">
                {spotlightCert.category}
              </span>
              <span className="text-xs font-mono text-muted">
                {spotlightCert.issueDate}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full border border-border bg-surface-raised flex items-center justify-center text-muted group-hover:text-accent group-hover:border-accent/50 group-hover:bg-accent/10 transition-all shrink-0">
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Middle: Title, Issuer, and Clean Summary */}
          <div className="space-y-3 my-auto">
            <div className="space-y-1">
              <span className="text-xs font-mono text-muted block">
                {spotlightCert.issuer}
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-foreground group-hover:text-accent transition-colors leading-tight tracking-tight">
                {spotlightCert.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-4">
              {spotlightCert.summary}
            </p>
          </div>

          {/* Clean Subtle Footer Cue */}
          <div className="pt-3 border-t border-border/50 text-[11px] font-mono text-muted/80">
            Click to view credential details
          </div>
        </div>
      ),
    },
    ...secondaryCerts.map((cert) => ({
      id: cert.id,
      colSpan: 1,
      rowSpan: 1,
      onClick: () => handleOpenCertificate(cert),
      content: (
        <div className="flex flex-col justify-between h-full p-2.5 sm:p-3 relative group cursor-pointer">
          {/* Top Row: Category + Year + Action Icon */}
          <div className="flex items-center justify-between gap-2 w-full mb-2">
            <span className="text-[10px] font-mono font-medium tracking-wider uppercase px-2 py-0.5 rounded-md bg-surface-raised border border-border text-muted group-hover:text-accent group-hover:border-accent/40 transition-colors">
              {cert.category}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted">{cert.issueDate}</span>
              <div className="w-6 h-6 rounded-full border border-border bg-surface-raised flex items-center justify-center text-muted group-hover:text-accent group-hover:border-accent/50 group-hover:bg-accent/10 transition-all shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>

          {/* Body: Issuer and Title */}
          <div className="my-auto py-1">
            <span className="text-[11px] font-mono text-muted block truncate">
              {cert.issuer}
            </span>
            <h4
              title={cert.title}
              className="text-sm sm:text-[15px] font-bold text-foreground group-hover:text-accent transition-colors leading-snug line-clamp-1 truncate mt-0.5"
            >
              {cert.title}
            </h4>
          </div>
        </div>
      ),
    })),
  ];

  return (
    <section
      ref={sectionRef}
      id="credentials-teaser"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10"
      aria-label="Licenses and Certifications"
    >
      {/* Section Header */}
      <div ref={headerRef}>
        <SectionHeading
          eyebrow="LICENSES & CERTIFICATIONS"
          title="Verified Credentials"
          description="Industry-recognized certifications, AI cohort learning paths, and technical course completions."
          className="mb-10 sm:mb-12"
        />
      </div>

      {/* Interactive Magic Bento Grid Container with Cursor Spotlight & Border Glow */}
      <div ref={bentoRef} className="relative w-full">
        <MagicBento
          items={bentoItems}
          columns={3}
          rowHeight={140}
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

      {/* Section Footer: CTA to Full Archive */}
      <div
        ref={footerRef}
        className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 mt-8"
      >
        <span className="text-xs font-mono text-muted text-center sm:text-left">
          Official accreditation records from national authorities and global tech institutions.
        </span>

        <Link
          href="/credentials"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-surface hover:bg-surface-raised hover:border-accent font-semibold text-xs sm:text-sm text-foreground transition-all duration-200 shadow-xs group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent shrink-0"
        >
          <span>View All Credentials Archive</span>
          <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Interactive Lightbox / Modal */}
      <CredentialDialog
        item={selectedCert}
        type="certificate"
        isOpen={Boolean(selectedCert)}
        onClose={handleCloseDialog}
      />
    </section>
  );
}
