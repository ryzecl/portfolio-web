import React from 'react';
import Link from 'next/link';
import { AboutData, EducationItem, ExperienceItem } from '@/lib/types';
import { SectionHeading } from '@/components/ui/section-heading';
import { ArrowUpRight, GraduationCap, Briefcase } from 'lucide-react';

interface AboutPreviewProps {
  about: AboutData;
  education: EducationItem[];
  experiences: ExperienceItem[];
}

export function AboutPreview({
  about,
  education,
  experiences,
}: AboutPreviewProps) {
  return (
    <section className="py-20 border-t border-border bg-background text-foreground" id="about">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="02"
          eyebrow="Profile & Background"
          title={about.heading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main narrative & focus */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4 text-base sm:text-lg text-muted font-normal leading-relaxed">
              {about.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs font-mono uppercase tracking-wider text-muted mb-4 font-medium">
                Core Engineering Pillars
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {about.focus.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-surface border border-border"
                  >
                    <span className="text-accent text-sm font-mono select-none">-</span>
                    <span className="text-xs font-medium text-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground hover:text-accent group"
              >
                <span>Read detailed biography & timeline</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Side card: Experience & Education snapshot */}
          <div className="lg:col-span-5 space-y-6">
            {/* Experience card */}
            {experiences.length > 0 && (
              <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-accent" />
                    <span className="text-xs font-mono uppercase tracking-wider text-muted font-medium">
                      Current Role
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/30 font-medium">
                    Active
                  </span>
                </div>

                {experiences.slice(0, 1).map((exp, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-base font-bold text-foreground">
                      {exp.role}
                    </p>
                    <p className="text-xs font-mono text-muted">
                      {exp.organization} · {exp.type}
                    </p>
                    <p className="text-xs text-muted leading-relaxed">
                      {exp.summary}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Education card */}
            {education.length > 0 && (
              <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono uppercase tracking-wider text-muted font-medium">
                    Academic Background
                  </span>
                </div>

                {education.map((edu, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {edu.program}
                    </p>
                    <p className="text-xs font-mono text-muted">
                      {edu.institution}
                    </p>
                    {edu.gpa && (
                      <p className="text-xs font-mono text-accent font-medium pt-1">
                        Current GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
