'use client';

import React, { useEffect, useRef } from 'react';
import { SkillGroup, ContactData } from '@/lib/types';
import { Marquee } from '@/components/ui/marquee';
import { GitHubCalendarCard } from '@/components/ui/github-calendar-card';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
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
  SiVite,
  SiFirebase,
  SiExpo,
  SiFlutter,
  SiDart,
  SiInertia,
  SiExpress,
  SiBootstrap,
  SiDaisyui,
  SiNodedotjs,
  SiBun,
  SiCpanel,
  SiGreensock,
} from 'react-icons/si';
import { RiverpodLogo, MazerLogo } from '@/components/ui/tech-icon';

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
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current text-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
  { name: 'React Native', category: 'Mobile Framework', icon: <SiReact className="w-4 h-4 text-[#61DAFB]" /> },
  { name: 'Expo', category: 'Mobile Tooling', icon: <SiExpo className="w-4 h-4 text-foreground" /> },
  { name: 'Flutter', category: 'Mobile Framework', icon: <SiFlutter className="w-4 h-4 text-[#02569B]" /> },
  { name: 'Dart', category: 'Language', icon: <SiDart className="w-4 h-4 text-[#0175C2]" /> },
  { name: 'TypeScript', category: 'Language', icon: <SiTypescript className="w-4 h-4 text-[#3178C6]" /> },
  { name: 'JavaScript', category: 'Language', icon: <SiJavascript className="w-4 h-4 text-[#F7DF1E]" /> },
  { name: 'Tailwind CSS', category: 'Styling', icon: <SiTailwindcss className="w-4 h-4 text-[#06B6D4]" /> },
  { name: 'Bootstrap', category: 'CSS Framework', icon: <SiBootstrap className="w-4 h-4 text-[#7952B3]" /> },
  { name: 'daisyUI', category: 'UI Components', icon: <SiDaisyui className="w-4 h-4 text-[#1AD1A5]" /> },
  { name: 'Mazer Template', category: 'Admin Template', icon: <MazerLogo className="w-4 h-4" /> },
  { name: 'Vite', category: 'Build Tool', icon: <SiVite className="w-4 h-4 text-[#646CFF]" /> },
  { name: 'Inertia.js', category: 'Fullstack Monolith', icon: <SiInertia className="w-4 h-4 text-[#9553E9]" /> },
  { name: 'shadcn/ui', category: 'Component System', icon: <SiShadcnui className="w-4 h-4 text-foreground" /> },
  { name: 'React Bits', category: 'Creative UI', icon: <ReactBitsIcon /> },
  { name: 'GSAP', category: 'Animation', icon: <SiGreensock className="w-4 h-4 text-[#88CE02]" /> },
  { name: 'Figma', category: 'Design', icon: <SiFigma className="w-4 h-4 text-[#F24E1E]" /> },
];

const row2Techs: TechPill[] = [
  { name: 'Laravel', category: 'Backend', icon: <SiLaravel className="w-4 h-4 text-[#FF2D20]" /> },
  { name: 'Node.js', category: 'Runtime & Backend', icon: <SiNodedotjs className="w-4 h-4 text-[#5FA04E]" /> },
  { name: 'Express.js', category: 'Backend Framework', icon: <SiExpress className="w-4 h-4 text-foreground" /> },
  { name: 'Bun', category: 'Runtime & Tooling', icon: <SiBun className="w-4 h-4 text-foreground" /> },
  { name: 'PHP', category: 'Language', icon: <SiPhp className="w-4 h-4 text-[#777BB4]" /> },
  { name: 'Firebase', category: 'BaaS & Auth', icon: <SiFirebase className="w-4 h-4 text-[#FFCA28]" /> },
  { name: 'Supabase', category: 'BaaS & Database', icon: <SiSupabase className="w-4 h-4 text-[#3ECF8E]" /> },
  { name: 'cPanel', category: 'Hosting & Deployment', icon: <SiCpanel className="w-4 h-4 text-[#FF6C2C]" /> },
  { name: 'Riverpod', category: 'State Management', icon: <RiverpodLogo className="w-4 h-4" /> },
  { name: 'PostgreSQL', category: 'Database', icon: <SiPostgresql className="w-4 h-4 text-[#4169E1]" /> },
  { name: 'MySQL', category: 'Database', icon: <SiMysql className="w-4 h-4 text-[#4479A1]" /> },
  { name: 'Prisma ORM', category: 'Database ORM', icon: <SiPrisma className="w-4 h-4 text-foreground" /> },
  { name: 'Golang', category: 'Language', icon: <SiGo className="w-4 h-4 text-[#00ADD8]" /> },
  { name: 'Cloudflare', category: 'Cloud & Edge', icon: <SiCloudflare className="w-4 h-4 text-[#F38020]" /> },
  { name: 'Docker', category: 'DevOps', icon: <SiDocker className="w-4 h-4 text-[#2496ED]" /> },
  { name: 'Git', category: 'VCS', icon: <SiGit className="w-4 h-4 text-[#F05032]" /> },
  { name: 'GitHub', category: 'Collaboration', icon: <SiGithub className="w-4 h-4 text-foreground" /> },
  { name: 'REST APIs', category: 'Architecture', icon: <RestApiIcon /> },
  { name: 'Midtrans Payment', category: 'Payment Gateway', icon: <MidtransIcon /> },
];

export function TechStack({ contact }: TechStackProps) {
  const username = 'ryzecl';
  const githubUrl = contact?.github || 'https://github.com/ryzecl';

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (calendarRef.current) {
        gsap.fromTo(
          calendarRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: calendarRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 lg:py-32 bg-transparent text-foreground overflow-hidden space-y-12 sm:space-y-16" id="skills">
      {/* Section Header */}
      <div ref={headerRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </div>

      {/* Infinite Marquee Rows (Magic UI Pattern with Edge Fade Masks) - Full width edge-to-edge */}
      <div className="relative w-full overflow-hidden space-y-4 py-2 mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] sm:mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
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
      <div ref={calendarRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <GitHubCalendarCard username={username} githubUrl={githubUrl} />
      </div>
    </section>
  );
}
