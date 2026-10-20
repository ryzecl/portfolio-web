import React from 'react';
import { SkillGroup } from '@/lib/types';
import { SectionHeading } from '@/components/ui/section-heading';
import { Terminal, Cpu, Database, Layout } from 'lucide-react';

interface TechStackProps {
  groups: SkillGroup[];
}

export function TechStack({ groups }: TechStackProps) {
  const getGroupIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'programming languages':
        return <Terminal className="w-4 h-4 text-accent" />;
      case 'frontend':
        return <Layout className="w-4 h-4 text-accent" />;
      case 'backend':
        return <Cpu className="w-4 h-4 text-accent" />;
      case 'data & tools':
      default:
        return <Database className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <section className="py-20 border-t border-border bg-background text-foreground" id="skills">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="03"
          eyebrow="Capabilities & Tools"
          title="Technical Stack"
          description="Technologies applied throughout frontend interfaces, backend architectures, APIs, and client systems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group) => (
            <div
              key={group.title}
              className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between hover:border-accent/40 transition-all shadow-sm group"
            >
              <div>
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
                  {getGroupIcon(group.title)}
                  <h3 className="text-sm font-bold text-foreground tracking-tight">
                    {group.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-surface-raised border border-border text-foreground/90 font-medium group-hover:border-accent/30 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-border text-[11px] font-mono text-muted">
                {group.technologies.length} core tools
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
