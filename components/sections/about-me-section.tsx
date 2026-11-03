'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SiteIdentity, ContactData, AboutData, EducationItem, ExperienceItem } from '@/lib/types';
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  Mail,
  Layers,
  Sparkles,
  Move3d,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Lanyard = dynamic(
  () => import('@/components/ui/lanyard').then((mod) => mod.Lanyard),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted">
        <div className="w-8 h-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
        <span className="text-xs uppercase tracking-wider font-medium">Loading 3D Card...</span>
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
  const headerRef = useRef<HTMLDivElement>(null);
  const bentoGridRef = useRef<HTMLDivElement>(null);
  const lanyardCardRef = useRef<HTMLDivElement>(null);
  const [shouldLoadLanyard, setShouldLoadLanyard] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      { rootMargin: '100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const name = about?.name || identity.name;
  const description =
    about?.description ||
    about?.paragraphs?.[0] ||
    'I’m an Information Systems student at Horizon University Indonesia, a participant in the Artificial Intelligence learning path at GDGOC Widyatama 2025, and co-founder of JDNirwana, a software development agency. As a Full-Stack Developer, I build web applications, analyze client requirements, and translate business needs into practical digital solutions.';

  const currentRole = experience?.role || 'Full-Stack Developer';
  const currentOrg = experience?.organization || 'JDNirwana';
  const currentUrl = experience?.url || 'nirwana.biz.id';
  const formattedUrl = currentUrl.startsWith('http') ? currentUrl : `https://${currentUrl}`;

  const defaultFocus = [
    'Full-stack web & mobile apps',
    'Backend & REST API architecture',
    'Relational database design',
    'Business process optimization',
  ];
  const focusAreas = about?.focus && about.focus.length > 0 ? about.focus : defaultFocus;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
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

        if (bentoGridRef.current) {
          tl.fromTo(
            bentoGridRef.current.children,
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out' },
            '-=0.4'
          );
        }
      }, sectionRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-me"
      className="py-16 sm:py-24 lg:py-28 bg-transparent text-foreground overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-4 border-b border-border/80"
        >
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-accent font-bold text-xs" aria-hidden="true">✦</span>
              <span className="text-xs uppercase tracking-widest text-muted font-semibold">
                About Me
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.08]">
              Software, Systems &<br />Real-World Needs
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-muted max-w-sm md:text-right leading-relaxed text-pretty">
            Bridging structured information systems with production-grade fullstack web and mobile engineering.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div
          ref={bentoGridRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch"
        >
          {/* Left Column (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 justify-between">
            {/* Top Narrative Card */}
            <div className="group rounded-2xl bg-surface border border-border hover:border-accent/40 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-border text-xs text-muted">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="font-semibold text-foreground">{name}</span>
                    <span className="text-border">|</span>
                    <span>Horizon University & JDNirwana</span>
                  </div>

                  <span className="text-xs text-muted">
                    Based in Indonesia (GMT+7)
                  </span>
                </div>

                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed text-pretty">
                  {description}
                </p>
              </div>

              {/* Bottom Actions & Socials inside Narrative Card */}
              <div className="pt-6 mt-6 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Social Connect Icons */}
                <div className="flex items-center gap-2">
                  {contact.github && (
                    <a
                      href={contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Profile"
                      className="w-9 h-9 rounded-xl bg-surface-raised border border-border/80 flex items-center justify-center text-muted hover:text-foreground hover:border-accent transition-colors"
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
                      className="w-9 h-9 rounded-xl bg-surface-raised border border-border/80 flex items-center justify-center text-muted hover:text-foreground hover:border-accent transition-colors"
                    >
                      <LinkedInIcon />
                    </a>
                  )}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      aria-label="Send Email"
                      className="w-9 h-9 rounded-xl bg-surface-raised border border-border/80 flex items-center justify-center text-muted hover:text-foreground hover:border-accent transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-3">
                  {contact.cv && (
                    <a
                      href={contact.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-raised border border-border hover:border-accent/60 text-xs font-semibold text-foreground transition-all duration-200 shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      <span>Resume</span>
                    </a>
                  )}
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background hover:bg-accent hover:text-white text-xs font-semibold transition-all duration-200 shadow-2xs"
                  >
                    <span>Get in Touch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Row: Agency Venture + Engineering Pillars Subgrid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* Card A: Co-Founder Venture */}
              <div className="group rounded-2xl bg-surface border border-border hover:border-accent/40 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-accent uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20">
                      Agency Venture
                    </span>
                    <a
                      href={formattedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-full bg-surface-raised border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent/50 transition-colors"
                      aria-label={`Visit ${currentOrg}`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">
                      {currentOrg}
                    </h4>
                    <p className="text-xs text-muted font-medium mt-0.5">
                      {currentRole}
                    </p>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Co-founded software agency crafting custom web applications, client solutions, and business automation.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-border/50 text-[11px] text-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Active Client Operations</span>
                </div>
              </div>

              {/* Card B: Core Engineering Focus */}
              <div className="group rounded-2xl bg-surface border border-border hover:border-accent/40 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-raised border border-border">
                      Core Focus
                    </span>
                    <Layers className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">
                      Engineering Pillars
                    </h4>
                    <p className="text-xs text-muted font-medium mt-0.5">
                      Primary development disciplines
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    {focusAreas.map((focus) => (
                      <div key={focus} className="flex items-center gap-2 text-xs text-foreground/85">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/80 shrink-0" />
                        <span className="truncate">{focus}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-border/50 text-[11px] text-muted flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span>Architecture & Modeling</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Lanyard ID Pass Card (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              ref={lanyardCardRef}
              className="group rounded-2xl bg-surface border border-border hover:border-accent/40 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between h-[390px] sm:h-[450px] lg:h-full relative overflow-hidden"
            >
              {/* Top Pass Header */}
              <div className="flex items-center justify-between gap-2 z-10">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface-raised border border-border text-[11px] font-medium text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Interactive ID Pass</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-muted bg-surface-raised/70 border border-border/60 px-2 py-1 rounded-md select-none">
                  <Move3d className="w-3 h-3 text-accent" />
                  <span>Drag to Rotate</span>
                </div>
              </div>

              {/* 3D Canvas Area */}
              <div className="grow w-full relative flex items-center justify-center min-h-[290px] sm:min-h-[340px] lg:min-h-0">
                {shouldLoadLanyard ? (
                  <Lanyard
                    frontImage="/images/about-photo.png"
                    backImage="/images/animated-photo.png"
                    imageFit="cover"
                    orientation="portrait"
                    finish="glossy"
                    metal="silver"
                    strapColor="#09090b"
                    strapText="FERRY NOER HENDRIAWAN • FULLSTACK DEVELOPER"
                    strapLength={isMobile ? 0.26 : 0.4}
                    size={isMobile ? 0.82 : 0.65}
                    cardColor="#ffffff"
                    interactive={true}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted">
                    <div className="w-8 h-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
                    <span className="text-xs uppercase tracking-wider font-medium">Loading 3D Card...</span>
                  </div>
                )}
              </div>

              {/* Bottom Pass Meta */}
              <div className="z-10 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted">
                <span>FNH • Verified 2026</span>
                <span className="text-accent/80 font-medium">Physics Simulated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}