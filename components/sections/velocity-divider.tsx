'use client';

import React from 'react';
import { ScrollVelocity } from '@/components/ui/scroll-velocity';

interface VelocityDividerProps {
  items?: string[];
}

export function VelocityDivider({ items }: VelocityDividerProps) {
  const defaultItems = [
    'SOFTWARE DEVELOPER',
    'SYSTEM ANALYST',
    'IT ENTHUSIAST',
    'FULLSTACK DEVELOPER',
  ];

  const list = items && items.length > 0 ? items : defaultItems;

  // Create two variations of the ticker stream for dual opposing tracks
  const track1 = list.join('   ✦   ');
  const track2 = [...list].reverse().join('   ✦   ');

  return (
    <div
      className="relative w-full border-y border-border/40 bg-surface/30 backdrop-blur-xs py-4 sm:py-6 overflow-hidden select-none z-20"
      aria-label="Professional roles ticker"
    >
      {/* Subtle background glow/accent overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/[0.03] to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <ScrollVelocity
        texts={[track1, track2]}
        velocity={60}
        numCopies={4}
        fadeEdges={true}
        pauseOnHover={true}
        outlineAlternate={true}
        parallaxClassName="py-1"
        scrollerClassName="flex whitespace-nowrap text-center font-jakarta text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight"
        className="text-foreground/90 transition-colors duration-300"
      />
    </div>
  );
}
