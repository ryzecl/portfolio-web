'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ExperienceItem, EducationItem } from '@/lib/types';
import { Plus, Minus, ArrowUpRight, Award, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ExperienceEducationSectionProps {
  experiences: ExperienceItem[];
  education: EducationItem[];
}

export function ExperienceEducationSection({
  experiences,
  education,
}: ExperienceEducationSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const expBlockRef = useRef<HTMLDivElement>(null);
  const eduBlockRef = useRef<HTMLDivElement>(null);

  // First item open by default (matching the reference design)
  const [openExp, setOpenExp] = useState<Record<number, boolean>>({ 0: true });
  const [openEdu, setOpenEdu] = useState<Record<number, boolean>>({ 0: true });

  const toggleExp = (index: number) => {
    setOpenExp((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleEdu = (index: number) => {
    setOpenEdu((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Reveal for Experiences block
      if (expBlockRef.current) {
        gsap.fromTo(
          expBlockRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: expBlockRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Reveal for Education block
      if (eduBlockRef.current) {
        gsap.fromTo(
          eduBlockRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: eduBlockRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="experience-education"
      className="relative z-10 py-16 sm:py-24 lg:py-32 bg-background text-foreground border-t border-border overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {/* ==================== 1. EXPERIENCES ==================== */}
        <div ref={expBlockRef} id="experiences" className="space-y-8 sm:space-y-12">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-xs font-mono uppercase tracking-widest text-muted font-medium">
                Career &amp; Practical Journey
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              Experiences
            </h2>
          </div>

          {/* Accordion List */}
          <div className="border-t border-border divide-y divide-border">
            {experiences.map((exp, index) => {
              const isOpen = !!openExp[index];
              const dateRange = exp.current
                ? `${exp.startDate} - Present`
                : `${exp.startDate} - ${exp.endDate}`;

              return (
                <div key={index} className="transition-colors">
                  {/* Accordion Trigger Header */}
                  <button
                    type="button"
                    onClick={() => toggleExp(index)}
                    aria-expanded={isOpen}
                    aria-controls={`exp-content-${index}`}
                    className="w-full py-6 sm:py-8 flex items-start justify-between gap-4 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm cursor-pointer"
                  >
                    <div className="space-y-1.5 pr-2">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-muted flex flex-wrap items-center gap-1.5">
                        <span>{dateRange}</span>
                        <span className="text-border">/</span>
                        <span className="text-foreground/80 font-medium">
                          {exp.organization}
                        </span>
                        {exp.type && (
                          <>
                            <span className="text-border hidden sm:inline">·</span>
                            <span className="text-muted/70 text-xs hidden sm:inline">
                              {exp.type}
                            </span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Plus / Minus Indicator Button */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center shrink-0 mt-1 transition-all duration-200 ${
                        isOpen
                          ? 'bg-foreground text-background border-foreground shadow-xs'
                          : 'bg-surface-raised text-muted group-hover:text-foreground group-hover:border-accent/50'
                      }`}
                      aria-hidden="true"
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" />
                      ) : (
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90 duration-200" />
                      )}
                    </div>
                  </button>

                  {/* Expandable Accordion Content */}
                  <div
                    id={`exp-content-${index}`}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100 pb-6 sm:pb-8'
                        : 'grid-rows-[0fr] opacity-0 pb-0'
                    }`}
                  >
                    <div className="overflow-hidden space-y-4">
                      {/* Summary */}
                      {exp.summary && (
                        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed max-w-3xl text-pretty">
                          {exp.summary}
                        </p>
                      )}

                      {/* Responsibilities / Key Deliverables */}
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-semibold block">
                            Key Focus &amp; Responsibilities:
                          </span>
                          <ul className="space-y-2 text-xs sm:text-sm text-foreground/90 max-w-3xl">
                            {exp.responsibilities.map((resp, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                <span className="leading-relaxed">{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tech stack & Optional link */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {exp.technologies?.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-md bg-surface-raised border border-border text-[11px] font-mono font-medium text-muted"
                          >
                            {tech}
                          </span>
                        ))}
                        {exp.url && (
                          <a
                            href={exp.url.startsWith('http') ? exp.url : `https://${exp.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-accent hover:underline ml-2"
                          >
                            <span>Visit {exp.organization}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================== 2. EDUCATION ==================== */}
        <div ref={eduBlockRef} id="education" className="space-y-8 sm:space-y-12">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-xs font-mono uppercase tracking-widest text-muted font-medium">
                Academic Background
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              Education
            </h2>
          </div>

          {/* Accordion List */}
          <div className="border-t border-border divide-y divide-border">
            {education.map((edu, index) => {
              const isOpen = !!openEdu[index];
              const dateRange = `${edu.startDate} - ${edu.endDate}`;

              return (
                <div key={index} className="transition-colors">
                  {/* Accordion Trigger Header */}
                  <button
                    type="button"
                    onClick={() => toggleEdu(index)}
                    aria-expanded={isOpen}
                    aria-controls={`edu-content-${index}`}
                    className="w-full py-6 sm:py-8 flex items-start justify-between gap-4 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm cursor-pointer"
                  >
                    <div className="space-y-1.5 pr-2">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                        {edu.program}
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-muted flex flex-wrap items-center gap-1.5">
                        <span>{dateRange}</span>
                        <span className="text-border">/</span>
                        <span className="text-foreground/80 font-medium">
                          {edu.institution}
                        </span>
                      </p>
                    </div>

                    {/* Plus / Minus Indicator Button */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center shrink-0 mt-1 transition-all duration-200 ${
                        isOpen
                          ? 'bg-foreground text-background border-foreground shadow-xs'
                          : 'bg-surface-raised text-muted group-hover:text-foreground group-hover:border-accent/50'
                      }`}
                      aria-hidden="true"
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" />
                      ) : (
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90 duration-200" />
                      )}
                    </div>
                  </button>

                  {/* Expandable Accordion Content */}
                  <div
                    id={`edu-content-${index}`}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100 pb-6 sm:pb-8'
                        : 'grid-rows-[0fr] opacity-0 pb-0'
                    }`}
                  >
                    <div className="overflow-hidden space-y-4">
                      {/* GPA Line (Matching Reference Screenshot) */}
                      {edu.gpa && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-raised border border-border text-xs sm:text-sm font-mono">
                          <span className="font-semibold text-foreground">GPA:</span>
                          <span className="text-accent font-bold">{edu.gpa}</span>
                        </div>
                      )}

                      {/* Note */}
                      {edu.note && (
                        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed max-w-3xl text-pretty">
                          {edu.note}
                        </p>
                      )}

                      {/* Achievements / Honors */}
                      {edu.achievements && edu.achievements.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-semibold block">
                            Key Distinctions &amp; Honors:
                          </span>
                          <ul className="space-y-2 text-xs sm:text-sm text-foreground/90 max-w-3xl">
                            {edu.achievements.map((ach, aIdx) => (
                              <li key={aIdx} className="flex items-start gap-2.5">
                                <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{ach}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
