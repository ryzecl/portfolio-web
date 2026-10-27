import React from 'react';
import {
  getSiteData,
  getFeaturedProjects,
  getAllExperiences,
  getAllSkillGroups,
} from '@/lib/data';
import { HeroSection } from '@/components/sections/hero-section';
import { AboutMeSection } from '@/components/sections/about-me-section';
import { FeaturedProjects } from '@/components/sections/featured-projects';
import { TechStack } from '@/components/sections/tech-stack';
import { ContactCta } from '@/components/sections/contact-cta';

export default function HomePage() {
  const site = getSiteData();
  const featuredProjects = getFeaturedProjects();
  const experiences = getAllExperiences();
  const skillGroups = getAllSkillGroups();

  return (
    <div className="flex flex-col">
      {/* Existing Hero Section — Kept completely untouched */}
      <HeroSection hero={site.hero} identity={site.identity} />

      {/* About Me Section — Positioned directly below Hero */}
      <AboutMeSection
        identity={site.identity}
        contact={site.contact}
        education={site.education}
        experience={experiences[0]}
      />

      <FeaturedProjects projects={featuredProjects} />
      <TechStack groups={skillGroups} />
      <ContactCta contact={site.contact} identity={site.identity} />
    </div>
  );
}
