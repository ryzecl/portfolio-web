'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { SiteIdentity, ContactData, EducationItem, ExperienceItem } from '@/lib/types';
import { ArrowRight, GraduationCap, Briefcase, Award, CheckCircle2 } from 'lucide-react';
import { Lanyard } from '@/components/ui/lanyard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutMeSectionProps {
  identity: SiteIdentity;
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
  contact,
  education,
  experience,
}: AboutMeSectionProps) {
  const primaryEdu = education?.[0];
  const activeExp = experience;

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);
  const lanyardRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Top Section Reveal
      const topTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      if (eyebrowRef.current) {
        topTl.fromTo(
          eyebrowRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        );
      }

      if (headlineRef.current) {
        topTl.fromTo(
          headlineRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
          '-=0.35'
        );
      }

      if (ctaRowRef.current) {
        topTl.fromTo(
          ctaRowRef.current,
          { y: 25, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.2)' },
          '-=0.45'
        );
      }

      // Bottom Row Reveal: 3D Lanyard & Two-Column Editorial Details
      const bottomTriggerEl = lanyardRef.current || sectionRef.current;
      const bottomTl = gsap.timeline({
        scrollTrigger: {
          trigger: bottomTriggerEl,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      if (lanyardRef.current) {
        bottomTl.fromTo(
          lanyardRef.current,
          { y: 50, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.95, ease: 'power3.out' }
        );
      }

      const cols = [col1Ref.current, col2Ref.current].filter(Boolean);
      if (cols.length > 0) {
        bottomTl.fromTo(
          cols,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.18,
            ease: 'power3.out',
          },
          '-=0.65'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-me"
      className="relative z-10 py-20 sm:py-28 lg:py-32 border-t border-border bg-background text-foreground overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Top Editorial Layout (Reference Design: Grey Dot + Large Bold Statement + Pill CTA) */}
        <div className="space-y-6 sm:space-y-8">
          {/* Eyebrow Dot */}
          <div ref={eyebrowRef} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted font-medium">
              Profile &amp; Perspective
            </span>
          </div>

          {/* Large Bold Editorial Headline Statement */}
          <h2
            ref={headlineRef}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black tracking-tight text-foreground leading-[1.18] max-w-5xl text-balance"
          >
            Full-Stack Developer &amp; Information Systems student based in Indonesia, passionate about crafting high-performance, user-centered digital solutions from architecture to polished code.®
          </h2>

          {/* Distinctive Pill CTA + Social Connections */}
          <div ref={ctaRowRef} className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
            {/* "Let's Collaborate" Pill Button */}
            <Link
              href={contact.email ? `mailto:${contact.email}` : '#contact'}
              className="inline-flex items-center gap-3.5 p-1.5 pr-6 rounded-full bg-surface-raised border border-border hover:border-accent/50 hover:bg-surface-raised/80 transition-all duration-200 group shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground shadow-sm transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </span>
              <span className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
                Let&apos;s Collaborate
              </span>
            </Link>

            {/* Social Media Links & Resume */}
            <div className="flex items-center gap-2.5">
              {contact.github && (
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
                  className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <LinkedInIcon />
                </a>
              )}
              {contact.cv && (
                <a
                  href={contact.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-surface border border-border text-xs sm:text-sm font-mono font-medium text-muted hover:text-foreground hover:border-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  See CV
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Editorial Grid: 3D Lanyard Card + 2 Distinct Content Columns */}
        <div className="pt-8 sm:pt-12 border-t border-border/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Side: ReactBits Interactive 3D Lanyard (Directly in section, no card frame) */}
            <div ref={lanyardRef} className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px]">
                <Lanyard
                  frontImage="/images/about-photo.png"
                  backImage="/images/about-photo.png"
                  imageFit="cover"
                  orientation="portrait"
                  finish="glossy"
                  metal="silver"
                  strapColor="#2563eb"
                  cardColor="#ffffff"
                  interactive={true}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Right Side: Two-Column Breakdown (Current Role vs Education & Achievements) */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-8">
              {/* Column 1: Bringing Ideas to Life / Current Active Role */}
              <div ref={col1Ref} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-accent">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase tracking-wider text-muted font-semibold">
                      Current Practice
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Bringing Ideas to Life
                  </h3>
                  <p className="text-xs font-mono text-accent font-medium">
                    {activeExp ? `${activeExp.role} · ${activeExp.organization}` : 'Full-Stack Developer'}
                  </p>
                </div>

                <p className="text-sm text-muted leading-relaxed">
                  Translating real-world business requirements into high-performance, user-centered digital applications—from intuitive interfaces to reliable backend architecture.
                </p>

                {/* CV Responsibilities in English */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted/80 font-semibold block">
                    Core Engineering Focus:
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-foreground/90">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>Architect and engineer fullstack web applications using Next.js, TypeScript, and Laravel.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>Design scalable relational database schemas (MySQL) and develop robust RESTful APIs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>Integrate payment gateways (Midtrans) and secure third-party deployment workflows.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>Deliver client solutions with clarity, maintainability, and measurable impact.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Column 2: Collaborate & Credentials / Education & Key Achievements */}
              <div ref={col2Ref} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-accent">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase tracking-wider text-muted font-semibold">
                      Academic Background
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Education &amp; Honors
                  </h3>
                  <p className="text-xs font-mono text-accent font-medium">
                    {primaryEdu ? `${primaryEdu.institution} · GPA ${primaryEdu.gpa || '3.96'}` : 'Information Systems'}
                  </p>
                </div>

                <p className="text-sm text-muted leading-relaxed">
                  Undergraduate Information Systems degree focusing on software engineering, database architecture, and digital system design with proven academic excellence.
                </p>

                {/* Verified Achievements & Distinctions */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted/80 font-semibold block">
                    Honors &amp; Achievements:
                  </span>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90">
                    <li className="flex items-start gap-2">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">Best Student GPA</span>
                        <p className="text-[11px] font-mono text-muted">Information Systems Department (2025 &amp; 2026)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">1st Winner — Web Solution Business &amp; Supply Chain</span>
                        <p className="text-[11px] font-mono text-muted">TechnoSpark Vol. 2 Competition at Horizon University Indonesia</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">Areas of Specialization</span>
                        <p className="text-[11px] font-mono text-muted">Software Engineering, Web Development &amp; System Design</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
