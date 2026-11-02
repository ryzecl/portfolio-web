'use client';

import React from 'react';
import { SkillGroup } from '@/lib/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TechIcon } from '@/components/ui/tech-icon';
import { Code2, Smartphone, Server, Database, Cpu } from 'lucide-react';

interface TechStackCatalogProps {
  groups: SkillGroup[];
  searchQuery?: string;
}

function getGroupIcon(title: string) {
  const normalized = title.toLowerCase();
  if (normalized.includes('programming') || normalized.includes('language')) {
    return <Code2 className="w-4 h-4 text-accent" />;
  }
  if (normalized.includes('frontend') || normalized.includes('mobile')) {
    return <Smartphone className="w-4 h-4 text-accent" />;
  }
  if (normalized.includes('backend') || normalized.includes('cloud')) {
    return <Server className="w-4 h-4 text-accent" />;
  }
  if (normalized.includes('data') || normalized.includes('devops')) {
    return <Database className="w-4 h-4 text-accent" />;
  }
  return <Cpu className="w-4 h-4 text-accent" />;
}

export function TechStackCatalog({
  groups,
  searchQuery = '',
}: TechStackCatalogProps) {
  if (groups.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-surface border border-border text-muted text-sm">
        No technologies found matching &ldquo;{searchQuery}&rdquo;.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      {groups.map((group) => {
        const icon = getGroupIcon(group.title);
        return (
          <Card
            key={group.title}
            className="group relative flex flex-col justify-between bg-surface border-border hover:border-accent/40 transition-all duration-300 overflow-hidden"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-transparent group-hover:bg-accent/70 transition-all duration-300" />

            <div>
              <CardHeader className="p-5 sm:p-6 pb-3 sm:pb-4 space-y-2 border-b border-border/50">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-surface-raised border border-border flex items-center justify-center shrink-0">
                      {icon}
                    </div>
                    <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                      {group.title}
                    </CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] sm:text-[11px] tracking-wider border-border bg-surface-raised text-foreground/80 shrink-0"
                  >
                    {group.technologies.length} Tools
                  </Badge>
                </div>

                {group.description && (
                  <CardDescription className="text-xs text-muted leading-relaxed">
                    {group.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="p-5 sm:p-6 pt-4 sm:pt-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {group.technologies.map((tech) => (
                    <div
                      key={tech}
                      className="group/item flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-surface-raised/70 border border-border/70 hover:border-accent/50 hover:bg-surface-raised transition-all duration-200"
                    >
                      <div className="w-6 h-6 rounded-md bg-surface border border-border/70 flex items-center justify-center shrink-0">
                        <TechIcon
                          name={tech}
                          className="w-3.5 h-3.5"
                          colored={true}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground/90 group-hover/item:text-foreground truncate transition-colors">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
