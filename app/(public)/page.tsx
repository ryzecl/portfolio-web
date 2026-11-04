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
  let certificates = featuredCertificates;
  let dynamicTechnologies: { name: string; category: string; iconKey: string }[] = [];
  let dynamicSkillGroups = skillGroups;

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

    const { data: dbCertificates } = await supabase
      .from('certificates')
      .select('*')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });

    if (dbCertificates && dbCertificates.length > 0) {
      // Prioritaskan yang punya priority > 0 (No 1 = Spotlight Card Utama)
      const sorted = [...dbCertificates].sort((a, b) => {
        const pA = a.priority && a.priority > 0 ? a.priority : 999;
        const pB = b.priority && b.priority > 0 ? b.priority : 999;
        return pA - pB;
      });

      const chosen = sorted.slice(0, 4);
      certificates = chosen.map((item) => {
        // Format tahun untuk tampilan bento header (e.g. 2026)
        let displayYear = item.issue_date || '';
        if (displayYear.includes('-') && displayYear.length >= 4) {
          try {
            const d = new Date(displayYear);
            if (!isNaN(d.getTime())) displayYear = d.getFullYear().toString();
          } catch {}
        }

        return {
          id: item.id,
          title: item.title,
          issuer: item.issuer,
          issueDate: displayYear,
          category: item.category,
          credentialId: item.credential_id || '',
          credentialUrl: item.credential_url || '',
          imageUrl: '/images/certificates/placeholder-cert.png',
          skills: item.skills || [],
          featured: (item.priority ?? 0) > 0,
          summary: item.summary || '',
        };
      });
    }

    const { data: dbTechCategories } = await supabase
      .from('tech_categories')
      .select('id, title, slug, priority, description, technologies(id, name, slug, icon_key)')
      .order('priority', { ascending: true });

    if (dbTechCategories && dbTechCategories.length > 0) {
      const allTechs: { name: string; category: string; iconKey: string }[] = [];
      const groups: typeof skillGroups = [];

      for (const cat of dbTechCategories) {
        const techList = cat.technologies || [];
        if (techList.length > 0) {
          groups.push({
            title: cat.title,
            priority: cat.priority,
            description: cat.description || undefined,
            technologies: techList.map((t: any) => t.name),
          });

          for (const t of techList) {
            allTechs.push({
              name: t.name,
              category: cat.title,
              iconKey: t.icon_key,
            });
          }
        }
      }

      if (allTechs.length > 0) {
        dynamicTechnologies = allTechs;
      }
      if (groups.length > 0) {
        dynamicSkillGroups = groups;
      }
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
            certificates={certificates}
          />

          <TechStack
            groups={dynamicSkillGroups}
            technologies={dynamicTechnologies}
            contact={site.contact}
            spotify={site.spotify}
          />
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
