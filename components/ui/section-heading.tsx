import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  number?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  number,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'space-y-3 mb-10 md:mb-14',
        align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl',
        className
      )}
    >
      <div
        className={cn(
          'inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-zinc-500 font-medium',
          align === 'center' && 'justify-center'
        )}
      >
        {number && (
          <span className="text-zinc-900 font-bold">{number}</span>
        )}
        {number && eyebrow && <span className="text-zinc-300">/</span>}
        {eyebrow && <span>{eyebrow}</span>}
      </div>

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-900 text-balance">
        {title}
      </h2>

      {description && (
        <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed text-balance">
          {description}
        </p>
      )}
    </div>
  );
}
