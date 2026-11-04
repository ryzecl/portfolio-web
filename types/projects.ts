// types/projects.ts
import { Technology } from '@/types/tech-stack';

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  priority: number;
  created_at: string;
}

export interface Project {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  summary: string;
  description: string | null;
  problem: string | null;
  solution: string | null;
  contribution: string | null;
  role: string | null;
  year: string | null;
  status: 'Completed' | 'In Progress' | 'Archived';
  featured: boolean;
  cover_image: string | null;
  preview_images: string[];
  demo_url: string | null;
  repo_url: string | null;
  highlights: string[];
  architecture: string[];
  priority: number;
  created_at: string;
  updated_at: string;
  category?: ProjectCategory;
  technologies?: Technology[];
}

export interface ProjectActionState {
  error?: string;
  success?: boolean;
  message?: string;
}
