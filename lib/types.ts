export interface SiteIdentity {
  name: string;
  wordmark: string;
  domain?: string;
  title: string;
  location: string;
  statusLabel: string;
}

export interface HeroData {
  greetings?: string[];
  greeting?: string;
  intro?: string;
  name?: string;
  avatar?: string;
  eyebrow?: string;
  headline: string;
  headlineTag?: string;
  headlineRest?: string;
  headlineLight?: string;
  headlineBold?: string;
  headlinePart1?: string;
  headlinePart2?: string;
  headlinePart3?: string;
  locationText?: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface AboutData {
  name?: string;
  status?: string;
  description?: string;
  heading: string;
  subheading?: string;
  paragraphs: string[];
  focus: string[];
  achievements?: string[];
}

export interface EducationItem {
  institution: string;
  program: string;
  major?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  is_current?: boolean;
  gpa?: string;
  achievements?: string[];
  note?: string;
  description?: string;
}

export interface ContactData {
  email: string;
  github: string;
  linkedin: string;
  whatsapp?: string;
  instagram?: string;
  cv: string;
}

export interface FooterData {
  copyrightName: string;
  closingLine: string;
}

export interface SpotifyTrack {
  song: string;
  artist: string;
  album?: string;
  albumArtUrl: string;
  trackUrl: string;
}

export interface SpotifyData {
  lastfmUsername?: string;
  discordUserId?: string;
  tagline: string;
  lore: string;
  defaultTrack: SpotifyTrack;
  playlistUrl?: string;
}

export interface SiteData {
  identity: SiteIdentity;
  hero: HeroData;
  navigation: NavigationItem[];
  about: AboutData;
  education: EducationItem[];
  contact: ContactData;
  footer: FooterData;
  velocityScroll?: string[];
  spotify?: SpotifyData;
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
  type?: string;
  industry?: string;
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
  description?: string;
  technologies: string[];
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  category: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  skills: string[];
  featured: boolean;
  summary: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  tags: string[];
  featured: boolean;
}

