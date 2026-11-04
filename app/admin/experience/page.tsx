// app/admin/experience/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { Briefcase } from 'lucide-react';
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
            <Briefcase className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
            Work & Career Experience
          </h1>
        </div>
        <p className="text-xs text-muted">
          Kelola riwayat pekerjaan profesional, agensi, dan magang industri.
        </p>
      </div>

      <ExperienceClientWrapper experiences={experiences || []} />
    </div>
  );
}
