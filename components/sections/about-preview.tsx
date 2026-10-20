import React from 'react';
import Link from 'next/link';
import { AboutData, EducationItem, ExperienceItem } from '@/lib/types';
import { SectionHeading } from '@/components/ui/section-heading';
import { ArrowUpRight, CheckCircle2, GraduationCap, Briefcase } from 'lucide-react';

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
    <section className="py-20 border-t border-zinc-200 bg-white" id="about">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="02"
          eyebrow="Profile & Background"
          title={about.heading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main narrative & focus */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4 text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
              {about.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 font-medium">
                Primary Focus Pillars
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {about.focus.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80"
                  >
                    <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0" />
                    <span className="text-xs font-medium text-zinc-800">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-900 hover:underline group"
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
              <div className="p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-zinc-900" />
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-medium">
                      Current Role
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    Active
                  </span>
                </div>

                {experiences.slice(0, 1).map((exp, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-base font-bold text-zinc-900">
                      {exp.role}
                    </p>
                    <p className="text-xs font-mono text-zinc-500">
                      {exp.organization} · {exp.type}
                    </p>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {exp.summary}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Education card */}
            {education.length > 0 && (
              <div className="p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200 space-y-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-zinc-900" />
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-medium">
                    Academic Background
                  </span>
                </div>

                {education.map((edu, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-sm font-semibold text-zinc-900">
                      {edu.program}
                    </p>
                    <p className="text-xs font-mono text-zinc-500">
                      {edu.institution}
                    </p>
                    {edu.gpa && (
                      <p className="text-xs font-mono text-zinc-800 font-medium pt-1">
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
