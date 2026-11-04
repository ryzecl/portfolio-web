// components/app-sidebar.tsx
'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Cpu,
  Award,
  Briefcase,
  GraduationCap,
  Settings,
  Sparkles,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import { SidebarSpotifyCard } from '@/components/admin/sidebar-spotify-card';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// Daftar workspace/brand portofolio
const brandData = {
  teams: [
    {
      name: 'Ferry Portfolio',
      logo: Sparkles,
      plan: 'Next.js 16 · Supabase',
    },
  ],
  navMain: [
    {
      title: 'Overview',
      url: '/admin',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Projects',
      url: '/admin/projects',
      icon: FolderKanban,
      items: [
        { title: 'All Projects', url: '/admin/projects' },
        { title: 'New Project', url: '/admin/projects/new' },
        { title: 'Categories', url: '/admin/projects/categories' },
      ],
    },
    {
      title: 'Tech Stack',
      url: '/admin/tech-stack',
      icon: Cpu,
      items: [
        { title: 'All Technologies', url: '/admin/tech-stack' },
        { title: 'Categories', url: '/admin/tech-stack/categories' },
      ],
    },
    {
      title: 'Certificates',
      url: '/admin/certificates',
      icon: Award,
      items: [
        { title: 'All Certificates', url: '/admin/certificates' },
        { title: 'Categories', url: '/admin/certificates/categories' },
      ],
    },
    {
      title: 'Experience',
      url: '/admin/experience',
      icon: Briefcase,
    },
    {
      title: 'Education',
      url: '/admin/education',
      icon: GraduationCap,
    },
    {
      title: 'Site Settings',
      url: '/admin/settings',
      icon: Settings,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r border-border/80" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={brandData.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={brandData.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarSpotifyCard />
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
