export interface SiteIdentity {
  name: string;
  wordmark: string;
  domain?: string;
  title: string;
  location: string;
  statusLabel: string;
}

export interface HeroData {
  eyebrow: string;
  headline: string;
  headlineLight?: string;
  headlineBold?: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface AboutData {
  heading: string;
  paragraphs: string[];
  focus: string[];
}

export interface EducationItem {
  institution: string;
  program: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  note?: string;
}

export interface ContactData {
  email: string;
  github: string;
  linkedin: string;
  whatsapp: string;
  cv: string;
}

export interface FooterData {
  copyrightName: string;
  closingLine: string;
}

export interface SiteData {
  identity: SiteIdentity;
  hero: HeroData;
  navigation: NavigationItem[];
  about: AboutData;
  education: EducationItem[];
  contact: ContactData;
  footer: FooterData;
}

export interface ProjectVisual {
  type: string;
  image?: string;
  coverImage?: string;
  previewImages?: string[];
  alt: string;
}

export interface ProjectLinks {
  demo?: string;
  repository?: string;
  caseStudy?: string;
}

export interface ProjectItem {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  status: string;
  year?: string;
  role: string;
  featured: boolean;
  technologies: string[];
  highlights: string[];
  problem: string;
  solution: string;
  contribution: string;
  challenges: string[];
  learnings: string[];
  architecture?: string[];
  links: ProjectLinks;
  visual: ProjectVisual;
  coverImage?: string;
  previewImages?: string[];
  gallery?: Array<{ image: string; alt: string }>;
}

export interface ExperienceItem {
  organization: string;
  role: string;
  type: string;
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  url?: string;
}

export interface SkillGroup {
  title: string;
  priority: number;
  technologies: string[];
}
