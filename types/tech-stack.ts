// types/tech-stack.ts

export interface TechCategory {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  priority: number;
  created_at: string;
  technologies?: Technology[];
}

export interface Technology {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  icon_key: string;
  created_at: string;
  category?: TechCategory;
}

export interface ActionState {
  error?: string;
  errors?: Record<string, string>;
  values?: Record<string, any>;
  success?: boolean;
  message?: string;
}
