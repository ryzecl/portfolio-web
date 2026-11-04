// types/settings.ts

export interface SiteSocialSettings {
  email: string;
  github: string;
  linkedin: string;
  whatsapp?: string;
  instagram?: string;
  spotify?: string;
}

export interface SiteHeroSettings {
  greeting: string;
  headline: string;
  locationText: string;
  description: string;
}
