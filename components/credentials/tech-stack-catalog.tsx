'use client';

import React from 'react';
import { SkillGroup } from '@/lib/types';
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
    <div className="rounded-2xl bg-surface border border-border divide-y divide-border/60 overflow-hidden shadow-2xs">
      {groups.map((group) => {
        const icon = getGroupIcon(group.title);
        return (
          <div
            key={group.title}
            className="group relative p-5 sm:p-6 lg:p-7 hover:bg-surface-raised/30 transition-colors duration-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start">
              {/* Left Column: Category Spec & Details */}
              <div className="md:col-span-4 lg:col-span-3 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-surface-raised border border-border flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <h4 className="text-base font-bold text-foreground tracking-tight">
                    {group.title}
                  </h4>
                </div>

                {group.description && (
                  <p className="text-xs text-muted leading-relaxed">
                    {group.description}
                  </p>
                )}

                <div className="pt-1">
                  <span className="inline-block font-mono text-[11px] text-muted px-2 py-0.5 rounded-md bg-surface-raised border border-border/80">
                    {group.technologies.length} {group.technologies.length === 1 ? 'Technology' : 'Technologies'}
                  </span>
                </div>
              </div>

              {/* Right Column: Minimalist Technical Matrix Grid */}
              <div className="md:col-span-8 lg:col-span-9">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
                  {group.technologies.map((tech) => (
                    <div
                      key={tech}
                      className="group/item flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-raised/50 border border-border/60 hover:border-accent/40 hover:bg-surface-raised transition-all duration-150 cursor-default"
                    >
                      <TechIcon
                        name={tech}
                        className="w-4 h-4 shrink-0 opacity-80 group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-150"
                        colored={true}
                      />
                      <span className="text-xs font-mono font-medium text-foreground/90 group-hover/item:text-foreground truncate transition-colors">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
