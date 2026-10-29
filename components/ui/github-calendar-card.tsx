'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SpotifyModal } from '@/components/ui/spotify-modal';
import { SpotifyData } from '@/lib/types';

interface ContributionDay {
  date: string;
  level: number;
  count: number;
  text: string;
}

interface MonthItem {
  name: string;
  colspan: number;
}

interface GitHubCalendarCardProps {
  username?: string;
  githubUrl?: string;
  spotify?: SpotifyData;
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

// 5-level palette matching our cobalt blue theme
const LEVEL_COLORS: Record<number, string> = {
  0: 'bg-border/60 hover:border-border',
  1: 'bg-blue-200 border-blue-300',
  2: 'bg-blue-400 border-blue-500',
  3: 'bg-blue-600 border-blue-700',
  4: 'bg-blue-800 border-blue-900',
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function GitHubCalendarCard({
  username = 'ryzecl',
  githubUrl = 'https://github.com/ryzecl',
  spotify,
}: GitHubCalendarCardProps) {
  const [days, setDays] = useState<ContributionDay[]>([]);
  const [months, setMonths] = useState<MonthItem[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isSubscribed = true;

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/github-contributions?username=${encodeURIComponent(username)}`);
        const json = await res.json();

        if (isSubscribed && json.success) {
          if (Array.isArray(json.days)) setDays(json.days);
          if (Array.isArray(json.months)) setMonths(json.months);
          if (typeof json.totalContributions === 'number') setTotal(json.totalContributions);
        }
      } catch (err) {
        console.error('Error fetching GitHub calendar:', err);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [username]);

  // Group days into columns of 7 days (weeks)
  const weeks = useMemo(() => {
    if (!days.length) return [];

    const weekList: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    days.forEach((day, idx) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || idx === days.length - 1) {
        weekList.push(currentWeek);
        currentWeek = [];
      }
    });

    return weekList;
  }, [days]);

  // Determine which week index starts a new month for column labels
  const monthLabels = useMemo(() => {
    if (!weeks.length) return [];

    const labels: { weekIndex: number; name: string }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, wIdx) => {
      const firstDayInWeek = week[0];
      if (firstDayInWeek) {
        const dateObj = new Date(firstDayInWeek.date);
        const month = dateObj.getMonth();
        if (month !== lastMonth) {
          labels.push({ weekIndex: wIdx, name: MONTH_NAMES[month] });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [weeks]);

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
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

        <div className="flex flex-row items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          {/* Headphone Check SlingButton Trigger & Shadcn Modal */}
          <SpotifyModal spotifyData={spotify} className="flex-1 sm:flex-initial justify-between sm:justify-start" />

          {/* View GitHub Link Button */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-surface-raised border border-border text-xs sm:text-sm font-mono font-medium text-foreground hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-2xs flex-1 sm:flex-initial"
          >
            <GitHubIcon />
            <span>View GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Heatmap Area */}
      <div className="overflow-x-auto py-2">
        {!mounted || loading ? (
          <div className="w-full h-36 flex flex-col items-center justify-center gap-2 text-xs font-mono text-muted animate-pulse">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span>Fetching live GitHub contributions...</span>
          </div>
        ) : weeks.length > 0 ? (
          <div className="inline-block min-w-full">
            {/* Month Labels Header */}
            <div className="flex items-center gap-2 mb-2 select-none">
              <div className="w-6 shrink-0" aria-hidden="true" />
              <div className="flex text-[10px] font-mono text-muted relative h-4">
                {months.length > 0
                  ? months.map((m, i) => (
                      <span
                        key={i}
                        style={{ width: `${m.colspan * 16}px` }}
                        className="shrink-0 text-left overflow-visible"
                      >
                        {m.name}
                      </span>
                    ))
                  : monthLabels.map((lbl, i) => (
                      <span
                        key={i}
                        className="absolute text-left"
                        style={{ left: `${lbl.weekIndex * 16}px` }}
                      >
                        {lbl.name}
                      </span>
                    ))}
              </div>
            </div>

            {/* Grid Container */}
            <div className="flex items-start gap-2">
              {/* Day of Week Labels (Mon, Wed, Fri) */}
              <div className="w-6 shrink-0 flex flex-col justify-between text-[9px] font-mono text-muted py-0.5 select-none h-27">
                <span className="leading-3">Mon</span>
                <span className="leading-3">Wed</span>
                <span className="leading-3">Fri</span>
              </div>

              {/* 53 Weeks Grid */}
              <div className="flex gap-1">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((day) => {
                      const colorClass =
                        LEVEL_COLORS[day.level] || LEVEL_COLORS[0];

                      return (
                        <div
                          key={day.date}
                          title={day.text}
                          className={cn(
                            'w-3 h-3 rounded-[3px] border border-transparent transition-all duration-150 cursor-pointer hover:scale-125 hover:z-10',
                            colorClass
                          )}
                          aria-label={day.text}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Summary & Legend */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 mt-2 border-t border-border/60 text-xs font-mono text-muted">
              <div>
                {typeof total === 'number' && (
                  <span className="font-semibold text-foreground">
                    {total.toLocaleString()} contributions in the last year
                  </span>
                )}
              </div>

              {/* Color Legend */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto select-none">
                <span className="text-[10px]">Less</span>
                <div className="w-2.5 h-2.5 rounded-xs bg-border/60" />
                <div className="w-2.5 h-2.5 rounded-xs bg-blue-200" />
                <div className="w-2.5 h-2.5 rounded-xs bg-blue-400" />
                <div className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                <div className="w-2.5 h-2.5 rounded-xs bg-blue-800" />
                <span className="text-[10px]">More</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full py-8 text-center text-xs font-mono text-muted space-y-2">
            <p>Could not load contributions heatmap directly.</p>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline font-semibold inline-flex items-center gap-1"
            >
              <span>View full activity on github.com/{username}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
