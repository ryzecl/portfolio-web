// app/admin/settings/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
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
        <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
          Site Settings
        </h1>
        <p className="text-xs text-muted">
          Configure social links, contact coordinates, and public portfolio parameters.
        </p>
      </div>

      <SiteSettingsForm socials={socials} />
    </div>
  );
}
