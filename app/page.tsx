import React from 'react';
import {
  getSiteData,
  getFeaturedProjects,
  getAllExperiences,
  getAllSkillGroups,
} from '@/lib/data';
import { HeroSection } from '@/components/sections/hero-section';
import { AboutMeSection } from '@/components/sections/about-me-section';
import { ExperienceEducationSection } from '@/components/sections/experience-education-section';
import { FeaturedProjects } from '@/components/sections/featured-projects';
import { TechStack } from '@/components/sections/tech-stack';
import { ContactCta } from '@/components/sections/contact-cta';
import { GradualBlur } from '@/components/ui/gradual-blur';

export default function HomePage() {
  const site = getSiteData();
  const featuredProjects = getFeaturedProjects();
  const experiences = getAllExperiences();
  const skillGroups = getAllSkillGroups();

  return (
    <div className="flex flex-col">
      {/* Existing Hero Section — Kept completely untouched */}
      <HeroSection hero={site.hero} identity={site.identity} />

      {/* Main Content Area Below Hero with Dot Matrix Pattern */}
      <div className="relative bg-tech-dots">
        {/* Smooth Top Transition from Hero into Dot Matrix */}
        <div
          className="absolute top-0 inset-x-0 h-24 pointer-events-none bg-gradient-to-b from-background to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10">
          {/* About Me Section — Positioned directly below Hero */}
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
            education={site.education}
          />

          <TechStack groups={skillGroups} contact={site.contact} />
          <ContactCta contact={site.contact} identity={site.identity} />
        </div>
      </div>

      {/* Gradual Blur Effect at the bottom of the viewport (ReactBits) */}
      <GradualBlur
        target="page"
        position="bottom"
        height="6rem"
        strength={1.5}
        zIndex={30}
        autoHide={true}
      />
    </div>
  );
}
