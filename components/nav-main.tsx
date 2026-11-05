// components/nav-main.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export interface NavMainItemData {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

interface NavMainProps {
  items: NavMainItemData[];
}

function NavCollapsibleItem({
  item,
  pathname,
}: {
  item: NavMainItemData;
  pathname: string;
}) {
  const isItemActive =
    pathname === item.url || (item.url !== '/admin' && pathname.startsWith(item.url));
  const [isOpen, setIsOpen] = useState(isItemActive);

  // Otomatis buka collapsible ketika user berpindah ke rute di dalam grup ini
  useEffect(() => {
    if (isItemActive) {
      setIsOpen(true);
    }
  }, [isItemActive]);

  if (!item.items || item.items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          isActive={isItemActive}
          className={
            isItemActive
              ? 'bg-accent/10 text-accent font-medium border-l-2 border-accent rounded-l-none'
              : 'text-muted hover:text-foreground'
          }
        >
          <Link href={item.url}>
            <item.icon />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={isItemActive}
            className={`cursor-pointer w-full transition-colors ${
              isItemActive
                ? 'text-accent font-semibold bg-accent/5'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <item.icon className="shrink-0" />
            <span className="flex-1 text-left">{item.title}</span>
            <ChevronRight className="ml-auto w-4 h-4 text-muted/60 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => {
              const isSubActive = pathname === subItem.url;
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isSubActive}
                    className={
                      isSubActive
                        ? 'text-accent font-medium bg-accent/10'
                        : 'text-muted hover:text-foreground'
                    }
                  >
                    <Link href={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-mono text-[11px] tracking-wider uppercase text-muted/80">
        Data Management
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavCollapsibleItem key={item.title} item={item} pathname={pathname} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
