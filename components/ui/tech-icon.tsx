'use client';

import React, { useState } from 'react';
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
  SiCloudflare,
  SiShadcnui,
  // Popular additions
  SiPython,
  SiDjango,
  SiFlask,
  SiFastapi,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiRedis,
  SiMongodb,
  SiGraphql,
  SiKubernetes,
  SiRust,
  SiCplusplus,
  SiSharp,
  SiOpenjdk,
  SiSpringboot,
  SiRuby,
  SiRubyonrails,
  SiNginx,
  SiLinux,
  SiUbuntu,
  SiPnpm,
  SiYarn,
  SiHtml5,
  SiCss,
  SiSass,
  SiZedindustries,
  SiAndroidstudio,
  SiCodeigniter,
  SiOpencode,
  SiLaragon,
  SiXampp,
  SiSpotify,
  SiVercel,
  SiGooglegemini,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { Braces, Terminal, KeyRound, Layers } from 'lucide-react';
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

export function GoogleAntigravityLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('w-3.5 h-3.5 shrink-0', className)} fill="none" aria-hidden="true">
      {/* Google 4-Color Floating Antigravity Prism */}
      <path
        d="M12 2L3.5 16.5H10L12 13L14 16.5H20.5L12 2Z"
        fill="#4285F4"
      />
      <path
        d="M12 2L20.5 16.5H15L12 11.5L12 2Z"
        fill="#EA4335"
      />
      <circle cx="12" cy="11.5" r="2.2" fill="#FBBC05" />
      <path
        d="M4 20.5C7.5 19 16.5 19 20 20.5"
        stroke="#34A853"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const AntigravityLogo = GoogleAntigravityLogo;

interface DynamicCdnIconProps {
  slug: string;
  className?: string;
  fallback: React.ReactNode;
}

function DynamicCdnIcon({ slug, className, fallback }: DynamicCdnIconProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <>{fallback}</>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${slug}`}
      alt={slug}
      className={cn(className, 'object-contain inline-block')}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

interface TechIconProps {
  name: string;
  className?: string;
  colored?: boolean;
}

export function TechIcon({ name, className = 'w-3.5 h-3.5 shrink-0', colored = true }: TechIconProps) {
  const cleanKey = (name || '').toLowerCase().trim();
  const normalized = cleanKey.replace(/[\s\.-]/g, '');

  const getIcon = () => {
    switch (normalized) {
    // Languages
    case 'python':
    case 'py':
      return <SiPython className={cn(className, colored ? 'text-[#3776AB]' : 'text-foreground')} />;
    case 'typescript':
    case 'ts':
      return <SiTypescript className={cn(className, colored ? 'text-[#3178C6]' : 'text-foreground')} />;
    case 'javascript':
    case 'js':
      return <SiJavascript className={cn(className, colored ? 'text-[#F7DF1E]' : 'text-foreground')} />;
    case 'php':
      return <SiPhp className={cn(className, colored ? 'text-[#777BB4]' : 'text-foreground')} />;
    case 'go':
    case 'golang':
      return <SiGo className={cn(className, colored ? 'text-[#00ADD8]' : 'text-foreground')} />;
    case 'rust':
      return <SiRust className={cn(className, colored ? 'text-[#DEA584]' : 'text-foreground')} />;
    case 'dart':
      return <SiDart className={cn(className, colored ? 'text-[#0175C2]' : 'text-foreground')} />;
    case 'cplusplus':
    case 'cpp':
    case 'c':
      return <SiCplusplus className={cn(className, colored ? 'text-[#00599C]' : 'text-foreground')} />;
    case 'csharp':
    case 'cs':
      return <SiSharp className={cn(className, colored ? 'text-[#239120]' : 'text-foreground')} />;
    case 'java':
    case 'openjdk':
      return <SiOpenjdk className={cn(className, colored ? 'text-[#EA2D2E]' : 'text-foreground')} />;
    case 'ruby':
      return <SiRuby className={cn(className, colored ? 'text-[#CC342D]' : 'text-foreground')} />;
    case 'html':
    case 'html5':
      return <SiHtml5 className={cn(className, colored ? 'text-[#E34F26]' : 'text-foreground')} />;
    case 'css':
    case 'css3':
      return <SiCss className={cn(className, colored ? 'text-[#1572B6]' : 'text-foreground')} />;
    case 'sass':
    case 'scss':
      return <SiSass className={cn(className, colored ? 'text-[#CC6699]' : 'text-foreground')} />;

    // Frontend Frameworks & Libraries
    case 'nextjs':
    case 'next':
    case 'nextdotjs':
      return <SiNextdotjs className={cn(className, colored && 'text-foreground')} />;
    case 'react':
    case 'reactjs':
      return <SiReact className={cn(className, colored ? 'text-[#61DAFB]' : 'text-foreground')} />;
    case 'vue':
    case 'vuejs':
    case 'vuedotjs':
      return <SiVuedotjs className={cn(className, colored ? 'text-[#4FC08D]' : 'text-foreground')} />;
    case 'angular':
      return <SiAngular className={cn(className, colored ? 'text-[#DD0031]' : 'text-foreground')} />;
    case 'svelte':
    case 'sveltedotjs':
      return <SiSvelte className={cn(className, colored ? 'text-[#FF3E00]' : 'text-foreground')} />;
    case 'reactnative':
    case 'reactnativeapp':
      return <SiReact className={cn(className, colored ? 'text-[#61DAFB]' : 'text-foreground')} />;
    case 'expo':
      return <SiExpo className={cn(className, colored && 'text-foreground')} />;
    case 'flutter':
      return <SiFlutter className={cn(className, colored ? 'text-[#02569B]' : 'text-foreground')} />;
    case 'tailwindcss':
    case 'tailwind':
      return <SiTailwindcss className={cn(className, colored ? 'text-[#06B6D4]' : 'text-foreground')} />;
    case 'bootstrap':
      return <SiBootstrap className={cn(className, colored ? 'text-[#7952B3]' : 'text-foreground')} />;
    case 'daisyui':
      return <SiDaisyui className={cn(className, colored ? 'text-[#1AD1A5]' : 'text-foreground')} />;
    case 'shadcnui':
    case 'shadcn':
      return <SiShadcnui className={cn(className, colored && 'text-foreground')} />;

    // Backend Frameworks & Runtimes
    case 'laravel':
      return <SiLaravel className={cn(className, colored ? 'text-[#FF2D20]' : 'text-foreground')} />;
    case 'nodejs':
    case 'node':
    case 'nodedotjs':
      return <SiNodedotjs className={cn(className, colored ? 'text-[#5FA04E]' : 'text-foreground')} />;
    case 'express':
    case 'expressjs':
      return <SiExpress className={cn(className, colored && 'text-foreground')} />;
    case 'bun':
      return <SiBun className={cn(className, colored && 'text-foreground')} />;
    case 'django':
      return <SiDjango className={cn(className, colored ? 'text-[#092E20]' : 'text-foreground')} />;
    case 'fastapi':
      return <SiFastapi className={cn(className, colored ? 'text-[#009688]' : 'text-foreground')} />;
    case 'flask':
      return <SiFlask className={cn(className, colored && 'text-foreground')} />;
    case 'springboot':
    case 'spring':
      return <SiSpringboot className={cn(className, colored ? 'text-[#6DB33F]' : 'text-foreground')} />;
    case 'rails':
    case 'rubyonrails':
      return <SiRubyonrails className={cn(className, colored ? 'text-[#D30001]' : 'text-foreground')} />;

    // Databases & BaaS
    case 'postgresql':
    case 'postgres':
      return <SiPostgresql className={cn(className, colored ? 'text-[#4169E1]' : 'text-foreground')} />;
    case 'mysql':
      return <SiMysql className={cn(className, colored ? 'text-[#4479A1]' : 'text-foreground')} />;
    case 'supabase':
      return <SiSupabase className={cn(className, colored ? 'text-[#3ECF8E]' : 'text-foreground')} />;
    case 'firebase':
      return <SiFirebase className={cn(className, colored ? 'text-[#FFCA28]' : 'text-foreground')} />;
    case 'redis':
      return <SiRedis className={cn(className, colored ? 'text-[#DC382D]' : 'text-foreground')} />;
    case 'mongodb':
    case 'mongo':
      return <SiMongodb className={cn(className, colored ? 'text-[#47A248]' : 'text-foreground')} />;
    case 'prisma':
      return <SiPrisma className={cn(className, colored ? 'text-foreground' : 'text-foreground')} />;
    case 'graphql':
      return <SiGraphql className={cn(className, colored ? 'text-[#E10098]' : 'text-foreground')} />;

    // DevOps & Tools
    case 'docker':
      return <SiDocker className={cn(className, colored ? 'text-[#2496ED]' : 'text-foreground')} />;
    case 'kubernetes':
    case 'k8s':
      return <SiKubernetes className={cn(className, colored ? 'text-[#326CE5]' : 'text-foreground')} />;
    case 'git':
      return <SiGit className={cn(className, colored ? 'text-[#F05032]' : 'text-foreground')} />;
    case 'github':
      return <SiGithub className={cn(className, colored && 'text-foreground')} />;
    case 'vite':
      return <SiVite className={cn(className, colored ? 'text-[#646CFF]' : 'text-foreground')} />;
    case 'pnpm':
      return <SiPnpm className={cn(className, colored ? 'text-[#F69220]' : 'text-foreground')} />;
    case 'yarn':
      return <SiYarn className={cn(className, colored ? 'text-[#2C8EBB]' : 'text-foreground')} />;
    case 'nginx':
      return <SiNginx className={cn(className, colored ? 'text-[#009639]' : 'text-foreground')} />;
    case 'linux':
      return <SiLinux className={cn(className, colored ? 'text-[#FCC624]' : 'text-foreground')} />;
    case 'ubuntu':
      return <SiUbuntu className={cn(className, colored ? 'text-[#E95420]' : 'text-foreground')} />;
    case 'cloudflare':
      return <SiCloudflare className={cn(className, colored ? 'text-[#F38020]' : 'text-foreground')} />;
    case 'cpanel':
      return <SiCpanel className={cn(className, colored ? 'text-[#FF6C2C]' : 'text-foreground')} />;
    case 'figma':
      return <SiFigma className={cn(className, colored ? 'text-[#F24E1E]' : 'text-foreground')} />;
    case 'inertiajs':
    case 'inertia':
      return <SiInertia className={cn(className, colored ? 'text-[#9553E9]' : 'text-foreground')} />;
    case 'gsap':
    case 'greensock':
      return <SiGreensock className={cn(className, colored ? 'text-[#88CE02]' : 'text-foreground')} />;

    // IDEs, Editors & Local Dev Environment
    case 'zed':
    case 'zedindustries':
    case 'zededitor':
      return <SiZedindustries className={cn(className, colored ? 'text-foreground' : 'text-foreground')} />;
    case 'androidstudio':
    case 'android':
      return <SiAndroidstudio className={cn(className, colored ? 'text-[#3DDC84]' : 'text-foreground')} />;
    case 'vscode':
    case 'visualstudiocode':
    case 'visualstudio':
      return <VscVscode className={cn(className, colored ? 'text-[#007ACC]' : 'text-foreground')} />;
    case 'laragon':
      return <SiLaragon className={cn(className, colored ? 'text-[#0E83CD]' : 'text-foreground')} />;
    case 'xampp':
      return <SiXampp className={cn(className, colored ? 'text-[#FB7A24]' : 'text-foreground')} />;
    case 'opencode':
      return <SiOpencode className={cn(className, colored ? 'text-foreground' : 'text-foreground')} />;
    case 'codeigniter':
    case 'ci':
    case 'ci4':
    case 'ci3':
      return <SiCodeigniter className={cn(className, colored ? 'text-[#EF4223]' : 'text-foreground')} />;
    case 'spotify':
      return <SiSpotify className={cn(className, colored ? 'text-[#1DB954]' : 'text-foreground')} />;
    case 'vercel':
      return <SiVercel className={cn(className, colored && 'text-foreground')} />;
    case 'antigravity':
    case 'googleantigravity':
    case 'agy':
      return <AntigravityLogo className={className} />;
    case 'gemini':
    case 'googlegemini':
      return <SiGooglegemini className={cn(className, colored ? 'text-[#1A73E8]' : 'text-foreground')} />;

    // Custom SVGs & Generics
    case 'midtrans':
      return <MidtransLogo className={className} />;
    case 'riverpod':
      return <RiverpodLogo className={className} />;
    case 'mazer':
    case 'mazertemplate':
      return <MazerLogo className={className} />;
    case 'restapi':
    case 'api':
    case 'rest':
      return <Braces className={cn(className, colored ? 'text-accent' : 'text-foreground')} />;
    case 'authentication':
    case 'auth':
      return <KeyRound className={cn(className, colored ? 'text-accent' : 'text-foreground')} />;
    case 'cmsdevelopment':
    case 'cms':
      return <Layers className={cn(className, colored ? 'text-accent' : 'text-foreground')} />;

    // Dynamic Fallback via SimpleIcons CDN
    default: {
      const cdnSlug = cleanKey
        .replace(/\+/g, 'plus')
        .replace(/#/g, 'sharp')
        .replace(/[\s_]+/g, '')
        .replace(/[^a-z0-9]/g, '');

      if (!cdnSlug || cdnSlug === 'terminal') {
        return <Terminal className={cn(className, 'text-muted')} />;
      }

      return (
        <DynamicCdnIcon
          slug={cdnSlug}
          className={className}
          fallback={<Terminal className={cn(className, 'text-muted')} />}
        />
      );
    }
    }
  };

  return (
    <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center">
      {getIcon()}
    </span>
  );
}
