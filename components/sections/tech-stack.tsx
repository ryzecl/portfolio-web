'use client';

import React from 'react';
import { SkillGroup, ContactData } from '@/lib/types';
import { Marquee } from '@/components/ui/marquee';
import { GitHubCalendarCard } from '@/components/ui/github-calendar-card';
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiGo,
  SiTailwindcss,
  SiShadcnui,
  SiLaravel,
  SiPhp,
  SiFigma,
  SiCloudflare,
  SiPostgresql,
  SiMysql,
  SiSupabase,
  SiPrisma,
  SiDocker,
  SiGit,
  SiGithub,
  SiHtml5,
} from 'react-icons/si';

interface TechStackProps {
  groups?: SkillGroup[];
  contact?: ContactData;
}

interface TechPill {
  name: string;
  category: string;
  icon: React.ReactNode;
}

function ReactBitsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current text-[#00E5FF]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function MidtransIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 2.18l7 3.89v4.93c0 4.54-3.03 8.79-7 9.92-3.97-1.13-7-5.38-7-9.92V8.07l7-3.89z" fill="#00AEFF" />
      <path d="M7 11h10v2H7z" fill="#002B49" />
    </svg>
  );
}

function RestApiIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current text-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h16M16 6l4 6-4 6M8 18l-4-6 4-6" />
    </svg>
  );
}

const row1Techs: TechPill[] = [
  { name: 'Next.js', category: 'Framework', icon: <SiNextdotjs className="w-4 h-4 text-foreground" /> },
  { name: 'React', category: 'UI Library', icon: <SiReact className="w-4 h-4 text-[#61DAFB]" /> },
  { name: 'TypeScript', category: 'Language', icon: <SiTypescript className="w-4 h-4 text-[#3178C6]" /> },
  { name: 'JavaScript', category: 'Language', icon: <SiJavascript className="w-4 h-4 text-[#F7DF1E]" /> },
  { name: 'Golang', category: 'Language', icon: <SiGo className="w-4 h-4 text-[#00ADD8]" /> },
  { name: 'Tailwind CSS', category: 'Styling', icon: <SiTailwindcss className="w-4 h-4 text-[#06B6D4]" /> },
  { name: 'shadcn/ui', category: 'Component System', icon: <SiShadcnui className="w-4 h-4 text-foreground" /> },
  { name: 'React Bits', category: 'Creative UI', icon: <ReactBitsIcon /> },
  { name: 'Laravel', category: 'Backend', icon: <SiLaravel className="w-4 h-4 text-[#FF2D20]" /> },
  { name: 'PHP', category: 'Backend', icon: <SiPhp className="w-4 h-4 text-[#777BB4]" /> },
  { name: 'Figma', category: 'Design', icon: <SiFigma className="w-4 h-4 text-[#F24E1E]" /> },
];

const row2Techs: TechPill[] = [
  { name: 'Cloudflare', category: 'Cloud & Edge', icon: <SiCloudflare className="w-4 h-4 text-[#F38020]" /> },
  { name: 'PostgreSQL', category: 'Database', icon: <SiPostgresql className="w-4 h-4 text-[#4169E1]" /> },
  { name: 'MySQL', category: 'Database', icon: <SiMysql className="w-4 h-4 text-[#4479A1]" /> },
  { name: 'Supabase', category: 'BaaS & Auth', icon: <SiSupabase className="w-4 h-4 text-[#3ECF8E]" /> },
  { name: 'Prisma ORM', category: 'Database ORM', icon: <SiPrisma className="w-4 h-4 text-foreground" /> },
  { name: 'Docker', category: 'DevOps', icon: <SiDocker className="w-4 h-4 text-[#2496ED]" /> },
  { name: 'Git', category: 'VCS', icon: <SiGit className="w-4 h-4 text-[#F05032]" /> },
  { name: 'GitHub', category: 'Collaboration', icon: <SiGithub className="w-4 h-4 text-foreground" /> },
  { name: 'REST APIs', category: 'Architecture', icon: <RestApiIcon /> },
  { name: 'Midtrans Payment', category: 'Payment Gateway', icon: <MidtransIcon /> },
  { name: 'HTML5 & CSS3', category: 'Markup', icon: <SiHtml5 className="w-4 h-4 text-[#E34F26]" /> },
];

export function TechStack({ contact }: TechStackProps) {
  const username = 'ryzecl';
  const githubUrl = contact?.github || 'https://github.com/ryzecl';

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-transparent text-foreground overflow-hidden" id="skills">
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
