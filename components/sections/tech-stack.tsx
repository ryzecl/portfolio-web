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
        return <Terminal className="w-4 h-4 text-zinc-900" />;
      case 'frontend':
        return <Layout className="w-4 h-4 text-zinc-900" />;
      case 'backend':
        return <Cpu className="w-4 h-4 text-zinc-900" />;
      case 'data & tools':
      default:
        return <Database className="w-4 h-4 text-zinc-900" />;
    }
  };

  return (
    <section className="py-20 border-t border-zinc-200 bg-white" id="skills">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="03"
          eyebrow="Capabilities & Tools"
          title="Technical Stack"
          description="Technologies and tooling applied throughout frontend, backend architectures, APIs, and client systems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group) => (
            <div
              key={group.title}
              className="p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200/90 flex flex-col justify-between hover:border-zinc-300 transition-all shadow-xs group"
            >
              <div>
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-zinc-200/70">
                  {getGroupIcon(group.title)}
                  <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                    {group.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-white border border-zinc-200 text-zinc-700 font-medium group-hover:text-zinc-900 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-200/60 text-[11px] font-mono text-zinc-400">
                {group.technologies.length} core tools
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
