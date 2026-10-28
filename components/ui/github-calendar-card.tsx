'use client';

import React, { useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { ArrowUpRight } from 'lucide-react';

interface GitHubCalendarCardProps {
  username?: string;
  githubUrl?: string;
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function GitHubCalendarCard({
  username = 'ryzecl',
  githubUrl = 'https://github.com/ryzecl',
}: GitHubCalendarCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-muted font-medium">
              Open Source &amp; Engineering Activity
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <span>Contributions on GitHub</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-raised border border-border text-muted font-normal">
              @{username}
            </span>
          </h3>
        </div>

        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-raised border border-border text-xs sm:text-sm font-mono font-medium text-foreground hover:border-accent hover:text-accent transition-colors self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <GitHubIcon />
          <span>View GitHub</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Calendar Area */}
      <div className="overflow-x-auto py-2 flex justify-center items-center min-h-40">
        {mounted ? (
          <GitHubCalendar
            username={username}
            blockSize={12}
            blockMargin={4}
            fontSize={12}
            colorScheme="light"
            theme={{
              light: ['#ebedf0', '#bfdbfe', '#60a5fa', '#2563eb', '#1d4ed8'],
              dark: ['#161b22', '#1e3a8a', '#1d4ed8', '#2563eb', '#60a5fa'],
            }}
            labels={{
              totalCount: '{{count}} contributions in the last year',
            }}
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center text-xs font-mono text-muted animate-pulse">
            Loading GitHub contributions...
          </div>
        )}
      </div>
    </div>
  );
}
