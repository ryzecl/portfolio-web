// app/admin/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FolderKanban, Cpu, Award, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard Overview · Ferry Portfolio CMS',
};

export default function AdminOverviewPage() {
  const stats = [
    {
      title: 'Active Projects',
      count: '6',
      description: 'Featured on live portfolio',
      icon: FolderKanban,
      href: '/admin/projects',
    },
    {
      title: 'Tech Stack',
      count: '16',
      description: 'Categorized technologies',
      icon: Cpu,
      href: '/admin/tech-stack',
    },
    {
      title: 'Certificates',
      count: '8',
      description: 'Verified credentials',
      icon: Award,
      href: '/admin/certificates',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Admin Operations
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-mono">
            Welcome back, Ferry.
          </h1>
          <p className="text-sm text-muted">
            All database tables and storage buckets are synchronized with Supabase PostgreSQL.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="group">
            <Card className="bg-surface border-border transition-all duration-200 group-hover:border-accent/40 group-hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-mono text-muted uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <div className="w-8 h-8 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-foreground">
                  {stat.count}
                </div>
                <CardDescription className="text-xs text-muted flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
