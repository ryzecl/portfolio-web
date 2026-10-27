'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroData, SiteIdentity } from '@/lib/types';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface HeroSectionProps {
  hero: HeroData;
  identity: SiteIdentity;
}

export function HeroSection({ hero, identity }: HeroSectionProps) {
  const greetings =
    hero.greetings && hero.greetings.length > 0
      ? hero.greetings
      : ['HOLA!', 'HI!', 'HELLO!', 'HALO!'];

  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = greetings[wordIndex % greetings.length];
    const typeSpeed = isDeleting ? 65 : 110;

    if (!isDeleting && text === currentWord) {
      const pauseTimeout = setTimeout(() => setIsDeleting(true), 1600);
      return () => clearTimeout(pauseTimeout);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % greetings.length);
      return;
    }

    const timer = setTimeout(() => {
      setText((prev) =>
        isDeleting
          ? currentWord.substring(0, prev.length - 1)
          : currentWord.substring(0, prev.length + 1)
      );
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, greetings]);

  const name = hero.name || identity.name;
  const avatarSrc = hero.avatar || '/images/ferry.png';
  const intro = hero.intro || 'I am';
  const isCv = hero.primaryCta?.href?.endsWith('.pdf');
  const headline = hero.headline || 'Fullstack Developer';

  return (
    <section className="relative min-h-[80vh] sm:min-h-[85vh] flex flex-col justify-center pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-44 lg:pb-28 bg-background text-foreground overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 text-left">
        <div className="max-w-5xl">
          {/* Eyebrow / Intro Row: Typing greeting + 'I am' + Name & Photo Capsule */}
          <div className="inline-flex flex-wrap items-center gap-2.5 sm:gap-3.5 mb-5 sm:mb-7">
            <div className="flex items-center text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              <span className="min-w-[1ch] inline-block">{text}</span>
              <span
                className="inline-block w-0.5 sm:w-0.75 h-[0.9em] bg-accent ml-1 align-middle animate-pulse"
                aria-hidden="true"
              />
              <span className="ml-2.5 sm:ml-3 font-semibold text-muted">
                {intro}
              </span>
            </div>

            {/* Name + Photo Capsule */}
            <div className="inline-flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1 rounded-full bg-surface-raised border border-border shadow-xs hover:border-foreground/30 transition-colors">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden relative shrink-0 border border-background shadow-xs bg-surface-muted">
                <Image
                  src={avatarSrc}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 24px, 32px"
                  priority
                />
              </div>
              <span className="font-bold text-foreground text-sm sm:text-base md:text-lg tracking-tight pr-1.5 sm:pr-2">
                {name}
              </span>
            </div>
          </div>

          {/* Main Headline: Fullstack Developer (No blue pill, bold display font) */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[92px] font-black tracking-tight text-foreground leading-[1.05]">
            {headline}
          </h1>

          {/* Sub-headline: from Indonesia [Flag] (Larger font with the same muted tone as previous '&') */}
          <div className="flex items-center gap-3 sm:gap-4 text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold tracking-tight text-muted/70 mt-2 sm:mt-3">
            <span>{hero.locationText || 'from Indonesia'}</span>
            <span
              className="inline-flex flex-col w-7 h-5 sm:w-10 sm:h-7 rounded-xs overflow-hidden border border-border shadow-xs shrink-0 align-middle"
              title="Indonesia"
              aria-label="Bendera Indonesia"
            >
              <span className="w-full h-1/2 bg-[#E70011]" />
              <span className="w-full h-1/2 bg-white" />
            </span>
          </div>

          {/* Bottom Row: CTAs on Left, Clean Description on Right */}
          <div className="mt-12 sm:mt-16 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Left: Button Cluster (See My CV & Let's Collaborate) */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={hero.primaryCta?.href || '/cv.pdf'}
                target={isCv ? '_blank' : undefined}
                rel={isCv ? 'noopener noreferrer' : undefined}
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 shadow-sm transition-all active:translate-y-[1px]"
              >
                <span>{hero.primaryCta?.label || 'See My CV'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {hero.secondaryCta && (
                <Link
                  href={hero.secondaryCta.href}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-surface-raised border border-border hover:border-foreground/30 text-foreground font-medium text-sm shadow-xs transition-all active:translate-y-[1px]"
                >
                  <span>{hero.secondaryCta.label || "Let's Collaborate"}</span>
                  <ArrowUpRight className="w-4 h-4 text-muted" />
                </Link>
              )}
            </div>

            {/* Right: Concise Description Paragraph */}
            {hero.description && (
              <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed max-w-md md:max-w-lg md:text-right text-pretty">
                {hero.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
