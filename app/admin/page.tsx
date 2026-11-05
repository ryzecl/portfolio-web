// app/admin/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { createClient } from '@/lib/server';
import { getVercelAnalytics } from '@/lib/vercel-analytics';
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard';

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
    analyticsData,
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('technologies').select('*', { count: 'exact', head: true }),
    supabase.from('certificates').select('*', { count: 'exact', head: true }),
    supabase.from('experiences').select('*', { count: 'exact', head: true }),
    getVercelAnalytics(),
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
    <div className="space-y-8">
      {/* 1. Header Overview */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
          Overview
        </h1>
        <p className="text-xs text-muted">
          Portfolio content management, database state, and traffic insights.
        </p>
      </div>

      {/* 2. Database Content Metric Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
            Content Management (Supabase)
          </h2>
        </div>
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

      <Separator className="bg-border/60" />

      {/* 3. Vercel Web Analytics & Traffic Insights (Shadcn Charts) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Traffic & Audience (Vercel Analytics)</span>
          </h2>
          <span className="text-[11px] font-mono text-muted">Last 14 days</span>
        </div>
        <AnalyticsDashboard data={analyticsData} />
      </div>
    </div>
  );
}
