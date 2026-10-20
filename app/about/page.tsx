import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getSiteData,
  getAllExperiences,
  getAllSkillGroups,
} from '@/lib/data';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Building2,
  Mail,
  ArrowUpRight,
} from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteData();
  return {
    title: `About · ${site.identity.name}`,
    description: `Profile, education, background, and experience of ${site.identity.name}.`,
  };
}

export default function AboutPage() {
  const site = getSiteData();
  const experiences = getAllExperiences();
  const skillGroups = getAllSkillGroups();

  return (
    <div className="pt-32 pb-24 sm:pt-40 sm:pb-32 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Profile Header */}
        <div className="space-y-6">
          <SectionHeading
            number="ABOUT"
            eyebrow="Profile & Philosophy"
            title={site.identity.name}
            description={`${site.identity.title} · Based in ${site.identity.location}`}
            className="mb-6"
          />

          <div className="space-y-5 text-lg text-zinc-600 font-normal leading-relaxed max-w-3xl">
            {site.about.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">
              <Mail className="w-4 h-4 mr-1.5" />
              <span>Get in touch</span>
            </Button>
            <Button href="/projects" variant="secondary">
              <span>View my work</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200/90 space-y-6 shadow-xs">
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">
              Core Competencies
            </p>
            <h2 className="text-xl font-bold text-zinc-900">
              What I Focus On
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {site.about.focus.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-zinc-900 mt-0.5 shrink-0" />
                <span className="text-sm font-medium text-zinc-800">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline (#experience anchor) */}
        <div className="space-y-8 scroll-mt-28" id="experience">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-500 font-medium">
              <Briefcase className="w-4 h-4 text-zinc-900" />
              <span>Professional History</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">
              Work Experience & Projects
            </h2>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l border-zinc-200 space-y-12">
            {experiences.map((exp, idx) => (
              <div key={idx} className="relative space-y-4">
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-zinc-900 border-4 border-white shadow-xs" />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-mono text-zinc-500 flex items-center gap-2 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-zinc-700" />
                      <span>{exp.organization}</span>
                      <span className="text-zinc-300">·</span>
                      <span className="text-xs">{exp.type}</span>
                    </p>
                  </div>

                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    {exp.current ? 'Present' : `${exp.startDate} - ${exp.endDate}`}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                  {exp.summary}
                </p>

                {/* Responsibilities list */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">
                      Key Responsibilities & Deliverables
                    </p>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, rIdx) => (
                        <li
                          key={rIdx}
                          className="text-xs sm:text-sm text-zinc-600 flex items-start gap-2.5"
                        >
                          <span className="text-zinc-900 font-mono text-xs mt-0.5">
                            ›
                          </span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-500 font-medium">
              <GraduationCap className="w-4 h-4 text-zinc-900" />
              <span>Academic Education</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">
              Education
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {site.education.map((edu, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900">
                    {edu.institution}
                  </h3>
                  <p className="text-base text-zinc-600">
                    {edu.program}
                  </p>
                  {edu.note && (
                    <p className="text-xs font-mono text-zinc-400">
                      Status: {edu.startDate} - Ongoing
                    </p>
                  )}
                </div>

                {edu.gpa && (
                  <div className="p-4 rounded-xl bg-white border border-zinc-200 text-center shrink-0 shadow-xs">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
                      Current GPA
                    </p>
                    <p className="text-2xl font-black font-mono text-zinc-900">
                      {edu.gpa}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills Overview */}
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">
              Stack Architecture
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">
              Technical Tooling
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-4 shadow-xs"
              >
                <h3 className="text-base font-bold text-zinc-900">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 font-medium hover:text-zinc-900 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
