'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroData, SiteIdentity } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { MicroSlats } from '@/components/ui/micro-slats';

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

  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

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
  const avatarSrc = hero.avatar || '/images/linkedin-photo.png';
  const intro = hero.intro || 'I am';
  const headline = hero.headline || 'Fullstack Developer';

  // GSAP Entrance Animation (Top: Intro & Headline; Bottom: Location & Bottom row)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // 1. Intro from top
      if (introRef.current) {
        gsap.fromTo(
          introRef.current,
          { y: -35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
        );
      }

      // 2. Headline Split Text from top
      const chars = headlineRef.current?.querySelectorAll('.headline-char');
      if (chars && chars.length > 0) {
        gsap.fromTo(
          chars,
          { y: -55, opacity: 0, rotateX: 35 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.85,
            stagger: 0.035,
            ease: 'back.out(1.4)',
            delay: 0.25,
          }
        );
      }

      // 3. Location from bottom
      if (locationRef.current) {
        gsap.fromTo(
          locationRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', delay: 0.45 }
        );
      }

      // 4. Bottom Row from bottom
      if (bottomRowRef.current) {
        gsap.fromTo(
          bottomRowRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.6 }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [headline]);

  const headlineWords = headline.split(' ');

  return (
    <section
      ref={containerRef}
      className="relative h-screen h-[100dvh] min-h-[100dvh] w-full flex flex-col justify-center pt-20 pb-10 sm:pt-24 sm:pb-12 bg-background text-foreground overflow-hidden"
    >
      {/* MicroSlats Ambient Background from ReactBits */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25 dark:opacity-35">
        <MicroSlats
          preset="swell"
          color="#2563eb"
          glintColor="#ffffff"
          backgroundColor="transparent"
          slatWidth={14}
          slatHeight={6}
          gap={3}
          speed={0.8}
          scale={1.2}
          interactive={true}
          className="w-full h-full pointer-events-auto"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 text-left my-auto">
        <div className="max-w-5xl">
          {/* Eyebrow / Intro Row: Animating from TOP via GSAP */}
          <div
            ref={introRef}
            className="inline-flex flex-wrap items-center gap-3 sm:gap-4 mb-5 sm:mb-7"
          >
            <div className="flex items-center text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              <span className="min-w-[1ch] inline-block">{text}</span>
              <span
                className="inline-block w-[2.5px] sm:w-[3.5px] h-[0.9em] bg-accent ml-1 align-middle animate-pulse"
                aria-hidden="true"
              />
              <span className="ml-2.5 sm:ml-3 font-semibold text-muted">
                {intro}
              </span>
            </div>

            {/* Name + Photo Capsule */}
            <div className="inline-flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-surface-raised border border-border shadow-xs hover:border-foreground/30 transition-colors">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 aspect-square rounded-full overflow-hidden relative shrink-0 border-2 border-background shadow-xs bg-surface-muted">
                <Image
                  src={avatarSrc}
                  alt={name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 72px"
                  priority
                />
              </div>
              <span className="font-bold text-foreground text-base sm:text-xl md:text-2xl tracking-tight pr-2 sm:pr-3 whitespace-nowrap">
                {name}
              </span>
            </div>
          </div>

          {/* Main Headline: Split-Text Character Stagger Animating from TOP via GSAP */}
          <h1
            ref={headlineRef}
            aria-label={headline}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[86px] xl:text-[92px] font-black tracking-tight text-foreground leading-[1.05] text-balance overflow-hidden py-1"
          >
            {headlineWords.map((word, wIdx) => (
              <span
                key={wIdx}
                className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0"
              >
                {word.split('').map((char, cIdx) => (
                  <span
                    key={cIdx}
                    className="headline-char inline-block will-change-transform"
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {/* Sub-headline: from Indonesia [Flag] - Animating from BOTTOM via GSAP */}
          <div
            ref={locationRef}
            className="flex items-center gap-2.5 sm:gap-3.5 text-xl sm:text-3xl md:text-4xl lg:text-[46px] font-semibold tracking-tight text-muted/70 mt-2 sm:mt-3"
          >
            <span>{hero.locationText || 'from Indonesia'}</span>
            <span
              className="inline-flex flex-col w-6 h-4 sm:w-9 sm:h-6 rounded-xs overflow-hidden border border-border shadow-xs shrink-0 align-middle"
              title="Indonesia"
              aria-label="Bendera Indonesia"
            >
              <span className="w-full h-1/2 bg-[#E70011]" />
              <span className="w-full h-1/2 bg-white" />
            </span>
          </div>

          {/* Bottom Row: CTA on Left, Clean Description on Right - Animating from BOTTOM via GSAP */}
          <div
            ref={bottomRowRef}
            className="mt-8 sm:mt-12 lg:mt-14 pt-2 sm:pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8"
          >
            {/* Left: See My CV Action Button */}
            <div className="flex items-center">
              <Link
                href={hero.primaryCta?.href || '/cv.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 shadow-sm transition-all active:translate-y-[1px]"
              >
                <span>{hero.primaryCta?.label || 'See My CV'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
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
