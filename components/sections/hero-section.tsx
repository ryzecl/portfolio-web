import React from 'react';
import Image from 'next/image';
import { HeroData, SiteIdentity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

interface HeroSectionProps {
  hero: HeroData;
  identity: SiteIdentity;
}

export function HeroSection({ hero, identity }: HeroSectionProps) {
  // Editorial dual-tone headline
  const headlineLight = hero.headlineLight || 'Shaping the';
  const headlineBold =
    hero.headlineBold ||
    hero.headline
      .replace(/^Shaping the\s*/i, '')
      .replace(/\.$/, '') ||
    'practical into intuitive digital presence';

  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-44 lg:pb-28 overflow-hidden bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-12 sm:space-y-16">
          {/* Main Editorial Headline */}
          <div className="max-w-5xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[86px] xl:text-[94px] font-black tracking-tight text-foreground leading-[1.04] text-balance">
              <span className="text-muted font-semibold">{headlineLight}</span>{' '}
              <span className="text-foreground font-black">{headlineBold}</span>
              <span className="text-accent font-black inline-block ml-2 text-3xl sm:text-5xl md:text-6xl align-baseline">
                .
              </span>
            </h1>
          </div>

          {/* Bottom row: Focus Area / Monogram + Bio + CTAs */}
          <div className="pt-6 border-t border-border">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Authentic profile avatar + Bio text */}
              <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                <div
                  className="w-12 h-12 rounded-2xl overflow-hidden border border-border relative shrink-0 shadow-sm"
                  title="Ferry Noer Hendriawan"
                >
                  <Image
                    src="/images/ferry.png"
                    alt="Ferry Noer Hendriawan"
                    fill
                    className="object-cover"
                    sizes="48px"
                    priority
                  />
                </div>

                {/* Narrative Bio */}
                <p className="text-sm sm:text-base text-muted font-normal leading-relaxed max-w-xl text-pretty">
                  {hero.description}
                </p>
              </div>

              {/* Right Column: Clear Actions */}
              <div className="lg:col-span-4 flex flex-wrap items-center lg:justify-end gap-3 pt-2 lg:pt-0">
                <Button href={hero.primaryCta.href} size="md" variant="primary">
                  <span>{hero.primaryCta.label}</span>
                  <ArrowUpRight className="w-4 h-4 ml-0.5" />
                </Button>

                <Button href={hero.secondaryCta.href} size="md" variant="secondary">
                  <span>{hero.secondaryCta.label}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Domain & Location Badge */}
          <div className="pt-2 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-raised border border-border text-foreground font-mono text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>{identity.domain || 'ferrynoer.dev'}</span>
            </div>

            <div className="text-xs font-mono text-muted hidden sm:block">
              {identity.location} · {identity.statusLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
