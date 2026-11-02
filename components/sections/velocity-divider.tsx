'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ScrollVelocity = dynamic(
  () => import('@/components/ui/scroll-velocity').then((mod) => mod.ScrollVelocity),
  { ssr: false }
);

interface VelocityDividerProps {
  items?: string[];
}

export function VelocityDivider({ items }: VelocityDividerProps) {
  const defaultItems = [
    'Fullstack Developer',
    'System Analyst',
    'Software Engineer',
    'AI Enthusiast',
  ];

  const list = items && items.length > 0 ? items : defaultItems;

  // Format to Title Case so curved letterforms ('a', 'o', 'e', 'g') render softly and with substance
  const formatLabel = (text: string) => {
    return text
      .toLowerCase()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const track = (
    <span className="inline-flex items-center">
      {list.map((item, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="font-bold tracking-tight text-foreground/85 hover:text-foreground transition-colors">
            {formatLabel(item)}
          </span>
          <span
            className="text-accent font-semibold mx-6 sm:mx-8 text-sm sm:text-base select-none"
            aria-hidden="true"
          >
            ✦
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      className="relative w-full border-y border-border/50 bg-surface/30 backdrop-blur-xs py-3.5 sm:py-4.5 overflow-hidden select-none z-20"
      aria-label="Professional capabilities ticker"
    >
      <ScrollVelocity
        texts={[track]}
        velocity={35}
        numCopies={4}
        fadeEdges={true}
        pauseOnHover={true}
        outlineAlternate={false}
        parallaxClassName="py-0.5"
        scrollerClassName="flex whitespace-nowrap text-center text-base sm:text-lg md:text-xl"
        className="transition-colors duration-300"
      />
    </div>
  );
}
