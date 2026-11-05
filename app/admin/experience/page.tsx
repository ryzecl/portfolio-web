// app/admin/experience/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { ExperienceClientWrapper } from '@/components/admin/experience-client-wrapper';

export const metadata: Metadata = {
  title: 'Work Experience · Admin CMS',
};

export default async function AdminExperiencePage() {
  const supabase = await createClient();

  // Query data pengalaman kerja/karir
  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
          Work Experience
        </h1>
        <p className="text-xs text-muted">
          Manage career history, employment milestones, and industry roles.
        </p>
      </div>

      <ExperienceClientWrapper experiences={experiences || []} />
    </div>
  );
}
