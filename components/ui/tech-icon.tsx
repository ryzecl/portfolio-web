import React from 'react';
import {
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiReact,
  SiTailwindcss,
  SiLaravel,
  SiMysql,
  SiPostgresql,
  SiFlutter,
  SiDart,
  SiFirebase,
  SiPhp,
  SiGo,
  SiDocker,
  SiSupabase,
  SiPrisma,
  SiGit,
  SiGithub,
  SiFigma,
  SiVite,
  SiInertia,
  SiExpo,
  SiExpress,
  SiBootstrap,
  SiDaisyui,
  SiNodedotjs,
  SiBun,
  SiCpanel,
  SiGreensock,
} from 'react-icons/si';
import { Braces, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MidtransLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('w-3.5 h-3.5 shrink-0', className)} aria-hidden="true">
      <path
        d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 2.18l7 3.89v4.93c0 4.54-3.03 8.79-7 9.92-3.97-1.13-7-5.38-7-9.92V8.07l7-3.89z"
        fill="#00AEFF"
      />
      <path d="M7 11h10v2H7z" fill="#002B49" />
    </svg>
  );
}

export function RiverpodLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('w-3.5 h-3.5 shrink-0', className)} aria-hidden="true" fill="none">
      <path
        d="M12 2.5C12 2.5 5.5 10.5 5.5 15.5C5.5 19.09 8.41 22 12 22C15.59 22 18.5 19.09 18.5 15.5C18.5 10.5 12 2.5 12 2.5Z"
        fill="#02569B"
      />
      <path
        d="M12 6.5C12 6.5 7.5 12.5 7.5 15.5C7.5 18 9.5 20 12 20C14.5 20 16.5 18 16.5 15.5C16.5 12.5 12 6.5 12 6.5Z"
        fill="#40C4FF"
      />
    </svg>
  );
}

export function MazerLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('w-3.5 h-3.5 shrink-0 fill-none stroke-current text-[#435EBE]', className)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

interface TechIconProps {
  name: string;
  className?: string;
  colored?: boolean;
}

export function TechIcon({ name, className = 'w-3.5 h-3.5 shrink-0', colored = true }: TechIconProps) {
  const normalized = name.toLowerCase().replace(/[\s\.-]/g, '');

  switch (normalized) {
    case 'nextjs':
    case 'next':
      return <SiNextdotjs className={cn(className, colored && 'text-foreground')} />;
    case 'typescript':
    case 'ts':
      return <SiTypescript className={cn(className, colored ? 'text-[#3178C6]' : 'text-foreground')} />;
    case 'javascript':
    case 'js':
      return <SiJavascript className={cn(className, colored ? 'text-[#F7DF1E]' : 'text-foreground')} />;
    case 'react':
    case 'reactjs':
      return <SiReact className={cn(className, colored ? 'text-[#61DAFB]' : 'text-foreground')} />;
    case 'reactnative':
    case 'reactnativeapp':
      return <SiReact className={cn(className, colored ? 'text-[#61DAFB]' : 'text-foreground')} />;
    case 'expo':
      return <SiExpo className={cn(className, colored && 'text-foreground')} />;
    case 'tailwindcss':
    case 'tailwind':
      return <SiTailwindcss className={cn(className, colored ? 'text-[#06B6D4]' : 'text-foreground')} />;
    case 'bootstrap':
      return <SiBootstrap className={cn(className, colored ? 'text-[#7952B3]' : 'text-foreground')} />;
    case 'daisyui':
      return <SiDaisyui className={cn(className, colored ? 'text-[#1AD1A5]' : 'text-foreground')} />;
    case 'mazer':
    case 'mazertemplate':
    case 'mazeradmin':
      return <MazerLogo className={className} />;
    case 'laravel':
      return <SiLaravel className={cn(className, colored ? 'text-[#FF2D20]' : 'text-foreground')} />;
    case 'express':
    case 'expressjs':
      return <SiExpress className={cn(className, colored && 'text-foreground')} />;
    case 'nodejs':
    case 'node':
      return <SiNodedotjs className={cn(className, colored ? 'text-[#5FA04E]' : 'text-foreground')} />;
    case 'bun':
      return <SiBun className={cn(className, colored ? 'text-[#FBF0DF]' : 'text-foreground')} />;
    case 'cpanel':
      return <SiCpanel className={cn(className, colored ? 'text-[#FF6C2C]' : 'text-foreground')} />;
    case 'mysql':
      return <SiMysql className={cn(className, colored ? 'text-[#4479A1]' : 'text-foreground')} />;
    case 'postgresql':
    case 'postgres':
      return <SiPostgresql className={cn(className, colored ? 'text-[#4169E1]' : 'text-foreground')} />;
    case 'midtrans':
      return <MidtransLogo className={className} />;
    case 'flutter':
      return <SiFlutter className={cn(className, colored ? 'text-[#02569B]' : 'text-foreground')} />;
    case 'dart':
      return <SiDart className={cn(className, colored ? 'text-[#0175C2]' : 'text-foreground')} />;
    case 'firebase':
    case 'firestore':
      return <SiFirebase className={cn(className, colored ? 'text-[#FFCA28]' : 'text-foreground')} />;
    case 'riverpod':
      return <RiverpodLogo className={className} />;
    case 'restapi':
    case 'api':
    case 'rest':
      return <Braces className={cn(className, colored ? 'text-accent' : 'text-foreground')} />;
    case 'php':
      return <SiPhp className={cn(className, colored ? 'text-[#777BB4]' : 'text-foreground')} />;
    case 'go':
    case 'golang':
      return <SiGo className={cn(className, colored ? 'text-[#00ADD8]' : 'text-foreground')} />;
    case 'docker':
      return <SiDocker className={cn(className, colored ? 'text-[#2496ED]' : 'text-foreground')} />;
    case 'supabase':
      return <SiSupabase className={cn(className, colored ? 'text-[#3ECF8E]' : 'text-foreground')} />;
    case 'prisma':
      return <SiPrisma className={cn(className, colored ? 'text-[#2D3748]' : 'text-foreground')} />;
    case 'git':
      return <SiGit className={cn(className, colored ? 'text-[#F05032]' : 'text-foreground')} />;
    case 'github':
      return <SiGithub className={cn(className, colored ? 'text-foreground' : 'text-foreground')} />;
    case 'figma':
      return <SiFigma className={cn(className, colored ? 'text-[#F24E1E]' : 'text-foreground')} />;
    case 'vite':
      return <SiVite className={cn(className, colored ? 'text-[#646CFF]' : 'text-foreground')} />;
    case 'inertiajs':
    case 'inertia':
      return <SiInertia className={cn(className, colored ? 'text-[#9553E9]' : 'text-foreground')} />;
    case 'gsap':
    case 'greensock':
      return <SiGreensock className={cn(className, colored ? 'text-[#88CE02]' : 'text-foreground')} />;
    default:
      return <Terminal className={cn(className, 'text-muted')} />;
  }
}
