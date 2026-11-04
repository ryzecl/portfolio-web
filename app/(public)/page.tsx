import React from 'react';
import {
  getSiteData,
  getFeaturedProjects,
  getAllExperiences,
  getAllSkillGroups,
  getFeaturedCertificates,
} from '@/lib/data';
import { createClient } from '@/lib/server';
import { HeroSection } from '@/components/sections/hero-section';
import { VelocityDivider } from '@/components/sections/velocity-divider';
import { AboutMeSection } from '@/components/sections/about-me-section';
import { ExperienceEducationSection } from '@/components/sections/experience-education-section';
import { FeaturedProjects } from '@/components/sections/featured-projects';
import { CredentialsTeaser } from '@/components/sections/credentials-teaser';
import { TechStack } from '@/components/sections/tech-stack';
import { ContactCta } from '@/components/sections/contact-cta';
import { GradualBlur } from '@/components/ui/gradual-blur';

export default async function HomePage() {
  const site = getSiteData();
  const featuredProjects = getFeaturedProjects(4);
  const fallbackExperiences = getAllExperiences();
  const skillGroups = getAllSkillGroups();
  const featuredCertificates = getFeaturedCertificates(4);

  let experiences = fallbackExperiences;
  let education = site.education;

  try {
    const supabase = await createClient();
    const { data: dbExperiences } = await supabase
      .from('experiences')
      .select('*')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });

    if (dbExperiences && dbExperiences.length > 0) {
      experiences = dbExperiences.map((item) => ({
        organization: item.organization,
        role: item.role,
        type: item.industry || '',
        industry: item.industry || '',
        startDate: item.start_date,
        endDate: item.end_date || '',
        current: item.is_current ?? !item.end_date,
        summary: item.description || '',
        responsibilities: item.highlights || [],
        technologies: item.technologies || [],
        url: item.organization_url || '',
      }));
    }

    const { data: dbEducations } = await supabase
      .from('educations')
      .select('*')
      .order('priority', { ascending: true })
      .order('start_date', { ascending: false });

    if (dbEducations && dbEducations.length > 0) {
      education = dbEducations.map((item) => ({
        institution: item.institution || item.organization || '',
        program: item.program || '',
        major: item.major || item.role || '',
        startDate: item.start_date,
        endDate: item.is_current || !item.end_date ? 'Present' : item.end_date,
        is_current: item.is_current ?? !item.end_date,
        gpa: item.gpa || '',
        achievements: item.achievements || item.highlights || [],
        note: item.description || '',
        description: item.description || '',
      }));
    }
  } catch {
    // Fallback otomatis ke data JSON jika database belum terisi atau koneksi offline
  }

  return (
    <div className="flex flex-col">
      {/* Existing Hero Section */}
      <HeroSection hero={site.hero} identity={site.identity} />

      {/* Velocity Scroll Divider between Hero and About Me */}
      <VelocityDivider items={site.velocityScroll} />

      {/* Main Content Area Below Hero with Dot Matrix Pattern */}
      <div className="relative bg-tech-dots">
        {/* Smooth Top Transition from Hero into Dot Matrix */}
        <div
          className="absolute top-0 inset-x-0 h-24 pointer-events-none bg-linear-to-b from-background to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10">
          {/* About Me Section — Positioned directly below Hero and Divider */}
          <AboutMeSection
            identity={site.identity}
            about={site.about}
            contact={site.contact}
            experience={experiences[0]}
          />

          {/* Featured Projects — Positioned directly below About Me */}
          <FeaturedProjects projects={featuredProjects} />

          {/* Experiences & Education Section */}
          <ExperienceEducationSection
            experiences={experiences}
            education={education}
          />

          {/* Credentials Teaser (Certificates Only) */}
          <CredentialsTeaser
            certificates={featuredCertificates}
          />

          <TechStack groups={skillGroups} contact={site.contact} spotify={site.spotify} />
          <ContactCta contact={site.contact} identity={site.identity} />
        </div>
      </div>

      {/* Gradual Blur Effect at the bottom of the viewport (Desktop only) */}
      <GradualBlur
        target="page"
        position="bottom"
        height="6rem"
        strength={1.5}
        zIndex={30}
        autoHide={false}
        className="hidden sm:block"
      />
    </div>
  );
}
