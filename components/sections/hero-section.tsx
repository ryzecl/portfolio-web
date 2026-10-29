'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { HeroData, SiteIdentity } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { IndonesiaFlag } from '@/components/ui/indonesia-flag';
import { TechText } from '@/components/ui/tech-text';
import { ShinyText } from '@/components/ui/shiny-text';

const MicroSlats = dynamic(
  () => import('@/components/ui/micro-slats').then((mod) => mod.MicroSlats),
  { ssr: false }
);

interface HeroSectionProps {
  hero: HeroData;
  identity: SiteIdentity;
}

export function HeroSection({ hero, identity }: HeroSectionProps) {
  const greetings =
    hero.greetings && hero.greetings.length > 0
      ? hero.greetings
      : [
          'HALO!',
          'HELLO!',
          'HOLA!',
          'BONJOUR!',
          'CIAO!',
          'KONNICHIWA!',
          'ANNYEONG!',
          'NI HAO!',
          'NAMASTE!',
          'GUTEN TAG!',
          'PRIVET!',
          'SAWASDEE!',
          'MARHABAN!',
          'MERHABA!',
          'ALOHA!',
          'OLÀ!',
        ];

  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Allow TechText canvas to measure layout and warm up before crossfading
    const readyTimer = setTimeout(() => {
      setCanvasReady(true);
    }, 180);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(readyTimer);
    };
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

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

  const headlineWords = headline.split(' ');
  const widestWord = headlineWords.find((w) => w.toLowerCase().includes('developer')) || headlineWords[0] || headline;

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-dvh w-full flex flex-col justify-center pt-20 pb-10 sm:pt-24 sm:pb-12 bg-background text-foreground overflow-hidden"
    >
      {/* MicroSlats Ambient Background from ReactBits (Mount only when client is active to eliminate SSR/TBT blocking) */}
      {isMounted && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-25 dark:opacity-35 transition-opacity duration-1000">
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
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 text-center sm:text-left my-auto">
        <div className="max-w-5xl mx-auto sm:mx-0 flex flex-col items-center sm:items-start">
          {/* Eyebrow / Intro Row */}
          <div className="flex flex-col sm:inline-flex sm:flex-row items-center justify-center sm:justify-start gap-2.5 sm:gap-4 mb-4 sm:mb-7">
            {/* Top on Mobile: Typing Greeting + I am */}
            <div className="flex items-center text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              <span className="min-w-[1ch] inline-block">{text}</span>
              <span
                className="inline-block w-[2.5px] sm:w-[3.5px] h-[0.9em] bg-accent ml-1 align-middle animate-pulse"
                aria-hidden="true"
              />
              <span className="ml-2 sm:ml-3 font-semibold text-muted">
                {intro}
              </span>
            </div>

            {/* Bottom on Mobile: Name + Photo Capsule */}
            <div className="aura aura-dual text-accent rounded-full">
              <div className="inline-flex items-center gap-2.5 sm:gap-4 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full bg-surface-raised border border-border shadow-xs hover:border-foreground/30 transition-colors">
                <div className="w-8 h-8 sm:w-16 sm:h-16 md:w-18 md:h-18 aspect-square rounded-full overflow-hidden relative shrink-0 border-2 border-background shadow-xs bg-surface-muted flex items-center justify-center font-bold text-xs sm:text-base text-muted select-none">
                  <span>FN</span>
                  <Image
                    src={avatarSrc}
                    alt={name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 32px, (max-width: 768px) 64px, 72px"
                    priority
                  />
                </div>
                <span className="font-bold text-foreground text-sm sm:text-xl md:text-2xl tracking-tight pr-2 sm:pr-3 whitespace-nowrap">
                  {name}
                </span>
              </div>
            </div>
          </div>

          {/* Main Headline: Progressive Enhancement with SSR Fallback H1 + Interactive TechText */}
          <div className="w-full py-1 flex justify-center sm:justify-start relative min-h-28 sm:min-h-22 md:min-h-28 lg:min-h-36 xl:min-h-40">
            {/* 1. Semantic SSR Fallback H1: Visible for SEO and before client canvas warms up */}
            <h1
              className={`w-full font-black tracking-tight text-foreground uppercase select-none transition-opacity duration-500 ${
                canvasReady ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'
              }`}
            >
              {/* Mobile layout: 2 stacked lines matching TechText dimensions */}
              <span className="sm:hidden flex flex-col items-center gap-1 text-[2.75rem] leading-[1.05] font-black tracking-tighter">
                {headlineWords.map((word, idx) => (
                  <span key={idx} className="block">{word}</span>
                ))}
              </span>

              {/* Desktop layout: single clean headline matching TechText */}
              <span className="hidden sm:block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px] font-black leading-none tracking-tight">
                {headline}
              </span>
            </h1>

            {/* 2. Interactive TechText Canvas: Mounted only on client, restricted to active viewport */}
            {isMounted && (
              <div
                className={`w-full transition-opacity duration-500 ${
                  canvasReady ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden="true"
              >
                {isMobile ? (
                  /* Mobile: 2 stacked words */
                  <div className="w-full flex flex-col items-center gap-1.5">
                    {headlineWords.map((word, idx) => (
                      <div key={idx} className="h-14 w-full">
                        <TechText
                          text={word}
                          fitText={widestWord}
                          align="center"
                          fontWeight={900}
                          fontSize={150}
                          letterSpacing={-0.03}
                          color="currentColor"
                          accentColor="#2563eb"
                          lineStyle="dashed"
                          draggable={true}
                          clickKick={true}
                          sweep={true}
                          labels={true}
                          selection={true}
                          guides={false}
                          className="text-foreground"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Desktop: Single continuous line */
                  <div className="h-20 sm:h-22 md:h-28 lg:h-36 xl:h-40 w-full">
                    <TechText
                      text={headline}
                      align="left"
                      fontWeight={900}
                      fontSize={120}
                      letterSpacing={-0.03}
                      color="currentColor"
                      accentColor="#2563eb"
                      lineStyle="dashed"
                      draggable={true}
                      clickKick={true}
                      sweep={true}
                      labels={true}
                      selection={true}
                      guides={false}
                      className="text-foreground"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sub-headline: from Indonesia [Flag] */}
          <div className="flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3.5 text-xl sm:text-3xl md:text-4xl lg:text-[46px] font-semibold tracking-tight mt-2 sm:mt-3">
            <ShinyText
              text={hero.locationText || 'from Indonesia'}
              color="#52525b"
              shineColor="#09090b"
              speed={3}
              shineWidth={45}
            />
            <IndonesiaFlag className="w-7 h-4.75 sm:w-9 sm:h-6 md:w-11 md:h-7.25 lg:w-12 lg:h-8" />
          </div>

          {/* Bottom Row: CTA on Left, Clean Description on Right */}
          <div className="mt-8 sm:mt-12 lg:mt-14 pt-2 sm:pt-4 flex flex-col items-center sm:items-start md:flex-row md:items-center md:justify-between gap-6 sm:gap-8 w-full">
            {/* Left: Action Button */}
            <div className="flex items-center justify-center sm:justify-start">
              <Link
                href={hero.primaryCta?.href || '#about-me'}
                {...(hero.primaryCta?.href?.startsWith('http') || hero.primaryCta?.href?.endsWith('.pdf')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 shadow-sm transition-all active:translate-y-px"
              >
                <span>{hero.primaryCta?.label || 'View More'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Right: Concise Description Paragraph */}
            {hero.description && (
              <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed max-w-md md:max-w-lg text-center sm:text-left md:text-right text-pretty">
                {hero.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
