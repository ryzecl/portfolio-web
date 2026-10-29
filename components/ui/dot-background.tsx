import React from 'react';

export function DotBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none"
      aria-hidden="true"
    >
      {/* Precision Ambient Dot Grid Pattern with Soft Radial Vignette */}
      <div
        className="absolute inset-0 opacity-[0.28] dark:opacity-[0.22]"
        style={{
          backgroundImage:
            'radial-gradient(var(--color-muted, #71717a) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          maskImage:
            'radial-gradient(ellipse 90% 65% at 50% 18%, #000 45%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 65% at 50% 18%, #000 45%, transparent 100%)',
        }}
      />

      {/* Soft Bottom Gradient Fade to Canvas */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}
