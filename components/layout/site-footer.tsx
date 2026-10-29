'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { SiteData } from '@/lib/types';
import { GithubIcon, LinkedinIcon } from '@/components/ui/icons';

const GradientWaves = dynamic(
  () => import('@/components/ui/gradient-waves').then((mod) => mod.GradientWaves),
  { ssr: false }
);

interface SiteFooterProps {
  site: SiteData;
}

export function SiteFooter({ site }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const closingText =
    site.footer.closingLine ||
    'Write with purpose. Build with care. Improve with every iteration.';
  const copyrightText =
    site.footer.copyrightName?.toUpperCase() ||
    site.identity.name.toUpperCase();

  return (
    <footer className="relative border-t border-border bg-surface text-foreground overflow-hidden">
      {/* Ambient Gradient Waves Background */}
      <div className="absolute inset-0 pointer-events-none opacity-70 transition-opacity duration-700">
        <GradientWaves
          lightMode={true}
          horizonColor="#1d4ed8"
          waveColor="#3b82f6"
          crestColor="#ffffff"
          backgroundColor="transparent"
          speed={0.3}
          amplitude={2.2}
          waveScale={0.55}
          waveRatio={0.85}
          swell={28}
          turbulence={18}
          tilt={62}
          zoom={0.95}
          fogDepth={16}
          relief={0.9}
          sheen={0.4}
          brightness={1.15}
          opacity={0.95}
          grain={0.05}
          quality="medium"
          mouseInteraction={true}
          swellOnClick={false}
          className="w-full h-full pointer-events-auto"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex flex-col justify-between gap-10 sm:gap-14 lg:gap-16">
        {/* Editorial Quote */}
        <div className="max-w-2xl">
          <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl text-foreground/90 font-normal leading-snug sm:leading-relaxed tracking-normal text-pretty">
            &ldquo;{closingText}&rdquo;
          </blockquote>
        </div>

        {/* Bottom Row: Copyright on Left, Circular Social Buttons on Right */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <p className="font-mono text-[11px] sm:text-xs tracking-widest uppercase text-muted/70 select-none">
            &copy; {currentYear} {copyrightText}
          </p>

          <div className="flex items-center gap-2.5">
            {site.contact.github && (
              <a
                href={site.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border/80 flex items-center justify-center text-muted hover:text-foreground hover:border-foreground/40 hover:bg-surface-raised transition-all"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {site.contact.linkedin && (
              <a
                href={site.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border/80 flex items-center justify-center text-muted hover:text-foreground hover:border-foreground/40 hover:bg-surface-raised transition-all"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
