// types/credentials.ts

export interface CertificateCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  priority: number;
  created_at: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  category: string;
  credential_id: string | null;
  credential_url: string | null;
  summary: string | null;
  skills: string[];
  featured: boolean;
  created_at: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  organization_url: string | null;
  industry: string | null;
  location?: string | null; // legacy fallback
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  highlights: string[];
  technologies?: string[];
  priority: number;
  created_at: string;
  updated_at?: string;
}

export interface EducationItem {
  id: string;
  major: string;
  program?: string | null; // e.g. "Bachelor's Degree", "Senior High School", "Diploma (D3)"
  institution: string;
  gpa?: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  achievements: string[];
  priority: number;
  created_at: string;
  updated_at?: string;
  // Aliases transisi
  role?: string;
  organization?: string;
  highlights?: string[];
  location?: string | null;
  organization_url?: string | null;
}

export interface GenericActionState {
  error?: string;
  success?: boolean;
  message?: string;
}
