import React from 'react';
import Link from 'next/link';
import { HeroData, SiteIdentity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

interface HeroSectionProps {
  hero: HeroData;
  identity: SiteIdentity;
}

export function HeroSection({ hero, identity }: HeroSectionProps) {
  // Graceful splitting for editorial dual-tone typography
  const headlineLight = hero.headlineLight || 'Shaping the';
  const headlineBold =
    hero.headlineBold ||
    hero.headline
      .replace(/^Shaping the\s*/i, '')
      .replace(/\.$/, '') ||
    'practical into intuitive digital presence';

  // Sample collaborative engineering / peer initials or avatar representations
  const avatarList = [
    { label: 'FN', bg: 'bg-zinc-900 text-white' },
    { label: 'JD', bg: 'bg-zinc-800 text-zinc-100' },
    { label: 'ST', bg: 'bg-zinc-700 text-zinc-200' },
    { label: 'UI', bg: 'bg-zinc-600 text-zinc-200' },
    { label: 'IS', bg: 'bg-zinc-800 text-white' },
  ];

  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-44 lg:pb-28 overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-12 sm:space-y-16">
          {/* Main Editorial Headline (Matching the reference layout) */}
          <div className="max-w-5xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[86px] xl:text-[94px] font-black tracking-tight text-zinc-900 leading-[1.04] text-balance">
              <span className="text-zinc-500 font-semibold">{headlineLight}</span>{' '}
              <span className="text-zinc-950 font-black">{headlineBold}</span>
              <span className="text-zinc-950 font-black inline-block ml-2 text-3xl sm:text-5xl md:text-6xl align-baseline">
                .
              </span>
            </h1>
          </div>

          {/* Bottom row: Collaborative Avatars + Bio + CTAs */}
          <div className="pt-4 border-t border-zinc-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Avatar Stack + Bio text */}
              <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                {/* Overlapping Avatar Stack (from reference) */}
                <div
                  className="flex items-center -space-x-2 shrink-0 select-none py-1"
                  aria-label="Collaborators and project stack"
                >
                  {avatarList.map((avatar, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 rounded-full border-2 border-white ring-1 ring-zinc-200/80 ${avatar.bg} font-mono text-[11px] font-bold flex items-center justify-center shadow-xs transition-transform hover:-translate-y-1 hover:z-20`}
                      title={`Collaborative node: ${avatar.label}`}
                    >
                      {avatar.label}
                    </div>
                  ))}
                </div>

                {/* Narrative Bio */}
                <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-xl text-pretty">
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

          {/* Bottom Domain Pill Badge (Just like 'shoaibsid.dev' in the reference) */}
          <div className="pt-2 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 text-white font-mono text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{identity.domain || 'ferrynoer.dev'}</span>
            </div>

            <div className="text-xs font-mono text-zinc-600 hidden sm:block">
              {identity.location} · {identity.statusLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
