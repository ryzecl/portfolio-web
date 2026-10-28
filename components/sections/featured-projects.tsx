'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectItem } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FeaturedProjectsProps {
  projects: ProjectItem[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
        );
      }

      if (gridRef.current) {
        tl.fromTo(
          gridRef.current.children,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.15, ease: 'power3.out' },
          '-=0.4'
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!projects || projects.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-16 sm:py-24 lg:py-32 bg-transparent text-foreground overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Section Header: Left (Eyebrow + Large Title), Right (Description) */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-2 border-b border-border/80"
        >
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold text-xs" aria-hidden="true">✦</span>
              <span className="text-xs font-mono uppercase tracking-widest text-muted font-semibold">
                Selected Works
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.08]">
              Featured<br />Projects
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-muted max-w-sm md:text-right leading-relaxed text-pretty">
            A curated selection showcasing practical engineering, user experience design, and real-world results.
          </p>
        </div>

        {/* 2-Column Project Card Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {projects.map((project, idx) => {
            const hasCoverImage = Boolean(project.coverImage && project.coverImage.trim() !== '');
            const coverSrc = hasCoverImage ? project.coverImage! : '/images/project-placeholder.png';
            const yearText = project.year || '2026';
            const roleOrCategory = project.role || project.category || 'Full-Stack Developer';

            return (
              <article key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block space-y-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-3xl"
                >
                  {/* Image Preview Container */}
                  <div className="relative aspect-[16/10] w-full rounded-3xl border border-border/80 bg-surface-raised overflow-hidden shadow-xs transition-all duration-300 group-hover:border-accent/40 group-hover:shadow-md">
                    <Image
                      src={coverSrc}
                      alt={project.visual?.alt || `${project.title} Preview`}
                      fill
                      className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 600px"
                      priority={idx < 2}
                    />

                    {/* Floating Circular Action Button */}
                    <div
                      className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white"
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Metadata Row Below Image */}
                  <div className="space-y-1.5 px-1">
                    {/* Line 1: Title + Year Pill */}
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <span className="px-3 py-0.5 rounded-full text-xs font-mono border border-border bg-surface-raised text-muted font-medium shrink-0">
                        {yearText}
                      </span>
                    </div>

                    {/* Line 2: Role / Category */}
                    <p className="text-xs sm:text-sm font-mono text-muted uppercase tracking-wider">
                      {roleOrCategory}
                    </p>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Centered "View All Projects" CTA Button */}
        <div ref={ctaRef} className="pt-6 sm:pt-8 flex justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-border bg-surface hover:bg-surface-raised hover:border-accent font-semibold text-sm text-foreground transition-all duration-200 shadow-xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
