'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SiteIdentity, ContactData, AboutData, EducationItem, ExperienceItem } from '@/lib/types';
import { ArrowRight, ArrowUpRight, FileText, Mail } from 'lucide-react';
import { ShinyText } from '@/components/ui/shiny-text';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Lanyard = dynamic(
  () => import('@/components/ui/lanyard').then((mod) => mod.Lanyard),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted">
        <div className="w-8 h-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
        <span className="text-xs font-mono uppercase tracking-wider">Loading 3D Card...</span>
      </div>
    ),
  }
);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutMeSectionProps {
  identity: SiteIdentity;
  about?: AboutData;
  contact: ContactData;
  education?: EducationItem[];
  experience?: ExperienceItem;
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  );
}

export function AboutMeSection({
  identity,
  about,
  contact,
  experience,
}: AboutMeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const lanyardCardRef = useRef<HTMLDivElement>(null);
  const [shouldLoadLanyard, setShouldLoadLanyard] = useState(false);

  // Viewport-based lazy loading: only instantiate Three.js when nearing viewport
  useEffect(() => {
    const el = lanyardCardRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoadLanyard(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadLanyard(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const name = about?.name || identity.name;
  const status = about?.status || 'Information System Student - Freelancer';
  const description =
    about?.description ||
    about?.paragraphs?.[0] ||
    'I’m an Information Systems student at Horizon University Indonesia, a participant in the Artificial Intelligence learning path at GDGOC Widyatama 2025, and co-founder of JDNirwana, a software development agency. As a Full-Stack Developer, I build web applications, analyze client requirements, and translate business needs into practical digital solutions.';

  const currentRole = experience?.role || 'Full-Stack Developer';
  const currentOrg = experience?.organization || 'JDNirwana';
  const currentUrl = experience?.url || 'nirwana.biz.id';
  const formattedUrl = currentUrl.startsWith('http') ? currentUrl : `https://${currentUrl}`;

  const renderStatus = () => {
    const match = status.match(/information systems? students?/i);
    if (match && match.index !== undefined) {
      const matchedText = match[0];
      const before = status.slice(0, match.index);
      const after = status.slice(match.index + matchedText.length);
      return (
        <>
          {before}
          <ShinyText
            text={matchedText}
            color="#52525b"
            shineColor="#09090b"
            speed={3}
            shineWidth={45}
            className="font-medium"
          />
          {after}
        </>
      );
    }
    return (
      <ShinyText
        text={status}
        color="#52525b"
        shineColor="#09090b"
        speed={3}
        shineWidth={45}
        className="font-medium"
      />
    );
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      // 1. Entrance animation for the Main Card Container itself
      if (cardRef.current) {
        tl.fromTo(
          cardRef.current,
          { y: 40, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
        );
      }

      // 2. Entrance animation for Left Column children
      if (textColRef.current) {
        tl.fromTo(
          textColRef.current.children,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.12, ease: 'power3.out' },
          '-=0.55'
        );
      }

      // 3. Entrance animation for 3D Lanyard Card
      if (lanyardCardRef.current) {
        tl.fromTo(
          lanyardCardRef.current,
          { y: 28, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out' },
          '-=0.5'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-me"
      className="relative z-10 py-12 sm:py-16 lg:py-24 bg-transparent text-foreground overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card Container with Entrance Animation */}
        <div
          ref={cardRef}
          className="rounded-3xl border border-border bg-surface p-6 sm:p-10 lg:p-12 shadow-xs transition-shadow duration-300 hover:shadow-sm will-change-transform"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Top block (Name, Status, Bio, Current Role) aligned to top, Bottom block (Socials + 2 balanced CTAs) aligned to bottom */}
            <div
              ref={textColRef}
              className="lg:col-span-7 flex flex-col justify-between py-1 lg:py-2 gap-8 lg:gap-0"
            >
              {/* Top Block: Name, Status, Bio Description & Current Role Highlight */}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.12]">
                    {name}
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-muted font-normal">
                    {renderStatus()}
                  </p>
                </div>

                <p className="text-sm sm:text-base lg:text-[17px] text-foreground/80 leading-relaxed max-w-xl text-pretty">
                  {description}
                </p>

                {/* Current Role Capsule */}
                <div className="pt-1">
                  <div className="inline-flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 sm:p-3.5 rounded-2xl bg-surface-raised border border-border/80 max-w-xl">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-semibold">
                            Current Role
                      </span>
                    </div>
                    <span className="hidden sm:inline-block text-border" aria-hidden="true">|</span>
                    <div className="text-xs sm:text-sm font-medium text-foreground flex items-center flex-wrap gap-1.5">
                      <span>{currentRole} at</span>
                      <a
                        href={formattedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-accent hover:underline inline-flex items-center gap-1 group/role focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xs"
                      >
                        <span>{currentOrg}</span>
                        <span className="text-xs font-normal text-muted group-hover/role:text-accent font-mono">
                          ({currentUrl})
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover/role:text-accent transition-transform group-hover/role:-translate-y-0.5 group-hover/role:translate-x-0.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Block: 2-Tier Action Area */}
              <div className="space-y-4 pt-4 lg:pt-0 max-w-lg">
                {/* 1. Upper Tier: Social Media Links */}
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted font-medium mr-1">
                    Connect Online:
                  </span>
                  {contact.github && (
                    <a
                      href={contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Profile"
                      className="w-9 h-9 rounded-full bg-surface-raised border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <GitHubIcon />
                    </a>
                  )}
                  {contact.linkedin && (
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn Profile"
                      className="w-9 h-9 rounded-full bg-surface-raised border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <LinkedInIcon />
                    </a>
                  )}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      aria-label="Send Email"
                      className="w-9 h-9 rounded-full bg-surface-raised border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* 2. Lower Tier: 2 Balanced Symmetrical CTAs (Left: Connect, Right: Resume) */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Left CTA: Get in Touch */}
                  <Link
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2.5 p-2 sm:p-2.5 rounded-full bg-surface-raised border border-border hover:border-accent/60 hover:bg-surface-raised/90 transition-all duration-200 group shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent flex items-center justify-center text-white shadow-xs transition-transform duration-200 group-hover:translate-x-0.5 shrink-0">
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </span>
                    <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground truncate">
                      Get in Touch
                    </span>
                  </Link>

                  {/* Right CTA: Resume */}
                  {contact.cv && (
                    <a
                      href={contact.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 p-2 sm:p-2.5 rounded-full bg-surface border border-border hover:border-accent/60 hover:bg-surface-raised transition-all duration-200 group shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent text-foreground"
                    >
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shadow-xs transition-transform duration-200 group-hover:-translate-y-0.5 shrink-0">
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </span>
                      <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground truncate">
                        Resume
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: 3D Interactive Lanyard Card */}
            <div className="lg:col-span-5 flex justify-center items-center h-full">
              <div
                ref={lanyardCardRef}
                className="w-full h-105 sm:h-120 lg:h-135 rounded-2xl sm:rounded-3xl bg-surface-raised border border-border/70 relative overflow-hidden flex items-center justify-center"
              >
                {shouldLoadLanyard ? (
                  <Lanyard
                    frontImage="/images/about-photo.png"
                    backImage="/images/animated-photo.png"
                    imageFit="cover"
                    orientation="portrait"
                    finish="glossy"
                    metal="silver"
                    strapColor="#2563eb"
                    cardColor="#ffffff"
                    interactive={true}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted">
                    <div className="w-8 h-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
                    <span className="text-xs font-mono uppercase tracking-wider">Loading 3D Card...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
