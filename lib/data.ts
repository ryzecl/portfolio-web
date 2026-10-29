import siteJson from '@/data/site.json';
import projectsJson from '@/data/projects.json';
import experienceJson from '@/data/experience.json';
import skillsJson from '@/data/skills.json';

import {
  SiteData,
  ProjectItem,
  ExperienceItem,
  SkillGroup,
} from './types';

export function getSiteData(): SiteData {
  return siteJson as SiteData;
}

export function getAllProjects(): ProjectItem[] {
  return (projectsJson.projects || []) as ProjectItem[];
}

export function getFeaturedProjects(limit?: number): ProjectItem[] {
  const featured = getAllProjects().filter((project) => project.featured);
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  return getAllProjects().find((project) => project.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return getAllProjects().map((project) => project.slug);
}

export function getAllExperiences(): ExperienceItem[] {
  return (experienceJson.experiences || []) as ExperienceItem[];
}

export function getAllSkillGroups(): SkillGroup[] {
  const groups = (skillsJson.groups || []) as SkillGroup[];
  return [...groups].sort((a, b) => a.priority - b.priority);
}

export function getProjectCategories(): string[] {
  const projects = getAllProjects();
  const categories = new Set<string>();
  projects.forEach((p) => {
    if (p.category) {
      categories.add(p.category);
    }
  });
  return Array.from(categories);
}
