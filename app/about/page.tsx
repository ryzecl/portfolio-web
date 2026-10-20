import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import {
  getSiteData,
  getAllExperiences,
  getAllSkillGroups,
} from '@/lib/data';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { JsonLd } from '@/components/ui/json-ld';
import {
  GraduationCap,
  Briefcase,
  Building2,
  Mail,
  ArrowUpRight,
} from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteData();
  const title = `About ${site.identity.name}`;
  const description = `${site.identity.name} is an Information Systems student and software developer based in ${site.identity.location}. Learn about his background, work experience, education, and technical skills.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: '/about',
      type: 'profile',
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: `About ${site.identity.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/og-image.png'],
    },
    alternates: {
      canonical: '/about',
    },
  };
}

export default function AboutPage() {
  const site = getSiteData();
  const experiences = getAllExperiences();
  const skillGroups = getAllSkillGroups();
  const baseUrl = `https://${site.identity.domain}`;

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `About ${site.identity.name}`,
    url: `${baseUrl}/about`,
    mainEntity: {
      '@type': 'Person',
      name: site.identity.name,
      jobTitle: site.identity.title,
      description: site.about.paragraphs[0],
      url: baseUrl,
      sameAs: [site.contact.github, site.contact.linkedin].filter(Boolean),
      alumniOf: site.education.map((edu) => ({
        '@type': 'CollegeOrUniversity',
        name: edu.institution,
        department: edu.program,
      })),
      hasCredential: experiences.map((exp) => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: exp.type,
        recognizedBy: {
          '@type': 'Organization',
          name: exp.organization,
          ...(exp.url ? { url: exp.url } : {}),
        },
      })),
    },
  };

  return (
    <div className="pt-32 pb-24 sm:pt-40 sm:pb-32 bg-background text-foreground">
      <JsonLd data={profilePageSchema} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Profile Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-8 space-y-6">
            <SectionHeading
              number="ABOUT"
              eyebrow="Profile & Philosophy"
              title={site.identity.name}
              description={`${site.identity.title} · Based in ${site.identity.location}`}
              className="mb-6"
            />

            <div className="space-y-5 text-lg text-muted font-normal leading-relaxed">
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

          <div className="md:col-span-4 flex justify-center md:justify-end pt-2">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border border-border shadow-md bg-surface-raised">
              <Image
                src="/images/ferry.png"
                alt={site.identity.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 200px, 240px"
                priority
              />
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="p-8 rounded-3xl bg-surface border border-border space-y-6 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-wider text-muted font-medium">
              Core Competencies
            </p>
            <h2 className="text-xl font-bold text-foreground">
              What I Focus On
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {site.about.focus.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-surface-raised border border-border"
              >
                <span className="text-accent text-sm font-mono mt-0.5 select-none">-</span>
                <span className="text-sm font-medium text-foreground">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-8 scroll-mt-28" id="experience">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted font-medium">
              <Briefcase className="w-4 h-4 text-accent" />
              <span>Professional History</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Work Experience & Projects
            </h2>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l border-border space-y-12">
            {experiences.map((exp, idx) => (
              <div key={idx} className="relative space-y-4">
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent border-4 border-background" />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-mono text-muted flex items-center gap-2 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-accent" />
                      <span>{exp.organization}</span>
                      <span className="text-border">·</span>
                      <span className="text-xs">{exp.type}</span>
                    </p>
                  </div>

                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/30 font-medium">
                    {exp.current ? 'Present' : `${exp.startDate} - ${exp.endDate}`}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  {exp.summary}
                </p>

                {/* Responsibilities list */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-mono uppercase tracking-wider text-muted font-medium">
                      Key Responsibilities & Deliverables
                    </p>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, rIdx) => (
                        <li
                          key={rIdx}
                          className="text-xs sm:text-sm text-muted flex items-start gap-2.5"
                        >
                          <span className="text-accent font-mono text-xs mt-0.5">
                            ›
                          </span>
                          <span className="text-foreground/90">{resp}</span>
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
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-surface-raised border border-border text-foreground/80 font-medium"
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
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted font-medium">
              <GraduationCap className="w-4 h-4 text-accent" />
              <span>Academic Education</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Education
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {site.education.map((edu, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {edu.institution}
                  </h3>
                  <p className="text-base text-muted">
                    {edu.program}
                  </p>
                  {edu.note && (
                    <p className="text-xs font-mono text-muted">
                      Status: {edu.startDate} - Ongoing
                    </p>
                  )}
                </div>

                {edu.gpa && (
                  <div className="p-4 rounded-xl bg-surface-raised border border-border text-center shrink-0">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted font-medium">
                      Current GPA
                    </p>
                    <p className="text-2xl font-black font-mono text-accent">
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
            <p className="text-xs font-mono uppercase tracking-wider text-muted font-medium">
              Stack Architecture
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Technical Tooling
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm"
              >
                <h3 className="text-base font-bold text-foreground">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-raised border border-border text-foreground/90 font-medium hover:border-accent/40 transition-colors"
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
