import React from 'react';
import {
  getSiteData,
  getFeaturedProjects,
  getAllExperiences,
  getAllSkillGroups,
} from '@/lib/data';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturedProjects } from '@/components/sections/featured-projects';
import { AboutPreview } from '@/components/sections/about-preview';
import { TechStack } from '@/components/sections/tech-stack';
import { ContactCta } from '@/components/sections/contact-cta';

export default function HomePage() {
  const site = getSiteData();
  const featuredProjects = getFeaturedProjects();
  const experiences = getAllExperiences();
  const skillGroups = getAllSkillGroups();

  return (
    <div className="flex flex-col">
      <HeroSection hero={site.hero} identity={site.identity} />
      <FeaturedProjects projects={featuredProjects} />
      <AboutPreview
        about={site.about}
        education={site.education}
        experiences={experiences}
      />
      <TechStack groups={skillGroups} />
      <ContactCta contact={site.contact} identity={site.identity} />
    </div>
  );
}
