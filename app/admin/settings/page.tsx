// app/admin/settings/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { Settings } from 'lucide-react';
import { SiteSettingsForm } from '@/components/admin/site-settings-form';
import site from '@/data/site.json';

export const metadata: Metadata = {
  title: 'Site Settings · Admin CMS',
};

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  // Query row site_settings untuk key social_links
  const { data: settingRow } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'social_links')
    .single();

  // Fallback ke data site.json jika di database belum ada
  const socials = settingRow?.value || {
    email: site.contact.email,
    github: site.contact.github,
    linkedin: site.contact.linkedin,
    whatsapp: (site.contact as any).whatsapp || '',
    spotify: (site.contact as any).spotify || '',
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
            <Settings className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
            Site Settings & Metadata
          </h1>
        </div>
        <p className="text-xs text-muted">
          Konfigurasi tautan profil sosial, kontak email, dan parameter situs publik.
        </p>
      </div>

      <SiteSettingsForm socials={socials} />
    </div>
  );
}
