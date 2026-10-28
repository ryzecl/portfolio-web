'use client';

import React from 'react';
import { SkillGroup, ContactData } from '@/lib/types';
import { Marquee } from '@/components/ui/marquee';
import { GitHubCalendarCard } from '@/components/ui/github-calendar-card';
import {
  Code2,
  Layers,
  Database,
  Server,
  Cpu,
  Globe,
  Terminal,
  Palette,
  Send,
  Boxes,
  FileCode2,
  Workflow,
  Sparkles,
} from 'lucide-react';

interface TechStackProps {
  groups?: SkillGroup[];
  contact?: ContactData;
}

interface TechPill {
  name: string;
  category: string;
  icon: React.ReactNode;
}

const row1Techs: TechPill[] = [
  { name: 'Next.js', category: 'Framework', icon: <Globe className="w-4 h-4 text-foreground" /> },
  { name: 'React', category: 'UI Library', icon: <Code2 className="w-4 h-4 text-cyan-500" /> },
  { name: 'TypeScript', category: 'Language', icon: <FileCode2 className="w-4 h-4 text-blue-500" /> },
  { name: 'JavaScript', category: 'Language', icon: <FileCode2 className="w-4 h-4 text-amber-400" /> },
  { name: 'Tailwind CSS', category: 'Styling', icon: <Palette className="w-4 h-4 text-sky-400" /> },
  { name: 'Laravel', category: 'Backend', icon: <Server className="w-4 h-4 text-red-500" /> },
  { name: 'PHP', category: 'Backend', icon: <Cpu className="w-4 h-4 text-indigo-400" /> },
  { name: 'HTML5 & CSS3', category: 'Markup', icon: <Layers className="w-4 h-4 text-orange-500" /> },
  { name: 'Figma', category: 'Design', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
];

const row2Techs: TechPill[] = [
  { name: 'MySQL', category: 'Database', icon: <Database className="w-4 h-4 text-blue-600" /> },
  { name: 'PostgreSQL', category: 'Database', icon: <Database className="w-4 h-4 text-sky-600" /> },
  { name: 'Supabase', category: 'BaaS & Auth', icon: <Server className="w-4 h-4 text-emerald-500" /> },
  { name: 'Prisma ORM', category: 'Database ORM', icon: <Workflow className="w-4 h-4 text-teal-400" /> },
  { name: 'REST APIs', category: 'Architecture', icon: <Send className="w-4 h-4 text-accent" /> },
  { name: 'Git', category: 'VCS', icon: <Terminal className="w-4 h-4 text-orange-600" /> },
  { name: 'GitHub', category: 'Collaboration', icon: <Code2 className="w-4 h-4 text-foreground" /> },
  { name: 'Docker', category: 'DevOps', icon: <Boxes className="w-4 h-4 text-blue-500" /> },
  { name: 'Midtrans Payment', category: 'Integration', icon: <Layers className="w-4 h-4 text-emerald-600" /> },
];

export function TechStack({ contact }: TechStackProps) {
  const username = 'ryzecl';
  const githubUrl = contact?.github || 'https://github.com/ryzecl';

  return (
    <section className="py-16 sm:py-24 lg:py-32 border-t border-border bg-background text-foreground overflow-hidden" id="skills">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted font-medium">
              Capabilities &amp; Ecosystem
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Technical Stack &amp; Activity
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
            Everyday technologies, frameworks, and architecture patterns used to engineer responsive frontends, secure backend APIs, and real-world digital solutions.
          </p>
        </div>

        {/* Infinite Marquee Rows (Magic UI Pattern with Edge Fade Masks) */}
        <div className="relative w-full overflow-hidden space-y-4 py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          {/* Row 1: Forward Movement */}
          <Marquee pauseOnHover repeat={4} className="[--duration:40s]">
            {row1Techs.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-2.5 px-4 py-2 sm:py-2.5 rounded-full bg-surface border border-border hover:border-accent/50 hover:bg-surface-raised transition-all cursor-default shadow-2xs"
              >
                <span className="shrink-0">{tech.icon}</span>
                <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground">
                  {tech.name}
                </span>
                <span className="text-[10px] font-mono text-muted/80 bg-surface-raised px-1.5 py-0.5 rounded-sm border border-border/60">
                  {tech.category}
                </span>
              </div>
            ))}
          </Marquee>

          {/* Row 2: Reverse Movement */}
          <Marquee reverse pauseOnHover repeat={4} className="[--duration:42s]">
            {row2Techs.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-2.5 px-4 py-2 sm:py-2.5 rounded-full bg-surface border border-border hover:border-accent/50 hover:bg-surface-raised transition-all cursor-default shadow-2xs"
              >
                <span className="shrink-0">{tech.icon}</span>
                <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground">
                  {tech.name}
                </span>
                <span className="text-[10px] font-mono text-muted/80 bg-surface-raised px-1.5 py-0.5 rounded-sm border border-border/60">
                  {tech.category}
                </span>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Live GitHub Contributions Heatmap Card */}
        <div className="pt-4 sm:pt-6">
          <GitHubCalendarCard username={username} githubUrl={githubUrl} />
        </div>
      </div>
    </section>
  );
}
