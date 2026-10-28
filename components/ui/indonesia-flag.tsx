import React from 'react';
import { cn } from '@/lib/utils';

interface IndonesiaFlagProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function IndonesiaFlag({ className, size = 'md', ...props }: IndonesiaFlagProps) {
  // Size presets (3:2 aspect ratio)
  const sizeClasses = {
    sm: 'w-6 h-4',       // 24x16
    md: 'w-8 h-[22px]',  // ~32x22
    lg: 'w-11 h-[30px]', // ~44x30
  };

  return (
    <span
      role="img"
      aria-label="Bendera Indonesia"
      title="Indonesia"
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[5px] select-none',
        'ring-1 ring-black/15 shadow-[0_2px_5px_rgba(0,0,0,0.08)]',
        'transition-transform duration-200 hover:scale-105',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <svg
        viewBox="0 0 36 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle satin sheen / enamel reflection */}
          <linearGradient id="flag-sheen" x1="0" y1="0" x2="36" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="65%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
          </linearGradient>

          {/* Micro horizontal weave / fabric shadow */}
          <linearGradient id="flag-depth" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.05" />
            <stop offset="48%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#000000" stopOpacity="0.15" />
            <stop offset="52%" stopColor="#000000" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* Top Half: Official Indonesian Red (Pantone 186 C / #CE1126 / #E70011) */}
        <rect x="0" y="0" width="36" height="12" fill="#E70011" />

        {/* Bottom Half: Pure Crisp White */}
        <rect x="0" y="12" width="36" height="12" fill="#FFFFFF" />

        {/* Central seam subtle divider shadow */}
        <rect x="0" y="11.6" width="36" height="0.8" fill="#000000" fillOpacity="0.08" />

        {/* Depth & Satin Lighting Overlays */}
        <rect x="0" y="0" width="36" height="24" fill="url(#flag-depth)" />
        <rect x="0" y="0" width="36" height="24" fill="url(#flag-sheen)" />

        {/* Ultra-fine inner border to prevent white bleed on bright surfaces */}
        <rect
          x="0.5"
          y="0.5"
          width="35"
          height="23"
          rx="4.5"
          stroke="#000000"
          strokeOpacity="0.1"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </span>
  );
}
