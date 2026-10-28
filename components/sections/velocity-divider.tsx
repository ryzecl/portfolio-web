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
    'SOFTWARE DEVELOPER',
    'SYSTEM ANALYST',
    'IT ENTHUSIAST',
    'FULLSTACK DEVELOPER',
  ];

  const list = items && items.length > 0 ? items : defaultItems;

  // Render track items with blue accent separator matching Hero MicroSlats (#2563eb)
  const renderTrack = (trackItems: string[]) => (
    <span className="inline-flex items-center">
      {trackItems.map((item, i) => (
        <span key={i} className="inline-flex items-center">
          <span>{item}</span>
          <span
            className="text-accent font-bold mx-4 sm:mx-6 text-sm sm:text-base select-none drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]"
            aria-hidden="true"
          >
            ✦
          </span>
        </span>
      ))}
    </span>
  );

  const track1 = renderTrack(list);
  const track2 = renderTrack([...list].reverse());

  return (
    <div
      className="relative w-full border-y border-blue-600/20 bg-blue-950/[0.08] backdrop-blur-xs py-4 sm:py-6 overflow-hidden select-none z-20"
      aria-label="Professional roles ticker"
    >
      {/* Subtle horizontal blue accent wash matching MicroSlats */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/[0.08] to-transparent pointer-events-none"
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
