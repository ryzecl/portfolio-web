// components/team-switcher.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo?: React.ElementType;
    plan: string;
  }[];
}) {
  const activeTeam = teams[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-border overflow-hidden shrink-0 bg-surface">
            <Image
              src="/images/ferry.png"
              alt="Ferry Noer Hendriawan"
              width={32}
              height={32}
              className="size-full object-cover"
              priority
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-mono font-semibold text-foreground">
              {activeTeam.name}
            </span>
            <span className="truncate text-xs font-mono text-muted">
              {activeTeam.plan}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
