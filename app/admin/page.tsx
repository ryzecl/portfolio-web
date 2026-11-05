// app/admin/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { createClient } from '@/lib/server';

export const metadata: Metadata = {
  title: 'Overview · Admin CMS',
};

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { count: projectsCount },
    { count: techCount },
    { count: certsCount },
    { count: expCount },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('technologies').select('*', { count: 'exact', head: true }),
    supabase.from('certificates').select('*', { count: 'exact', head: true }),
    supabase.from('experiences').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    {
      title: 'Projects',
      count: projectsCount ?? 0,
      description: 'Showcase items & blueprints',
      href: '/admin/projects',
    },
    {
      title: 'Tech Stack',
      count: techCount ?? 0,
      description: 'Cataloged tools & skills',
      href: '/admin/tech-stack',
    },
    {
      title: 'Certificates',
      count: certsCount ?? 0,
      description: 'Verified credentials',
      href: '/admin/certificates',
    },
    {
      title: 'Experience',
      count: expCount ?? 0,
      description: 'Career & employment milestones',
      href: '/admin/experience',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
          Overview
        </h1>
        <p className="text-xs text-muted">
          Portfolio content management and database state.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="group">
            <Card className="bg-surface border-border transition-colors hover:border-accent/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-mono text-muted uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold font-mono text-foreground">
                  {stat.count}
                </div>
                <p className="text-xs text-muted">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
