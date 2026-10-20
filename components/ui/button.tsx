import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', href, external, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary:
        'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm active:translate-y-[1px]',
      secondary:
        'bg-zinc-100 text-zinc-900 border border-zinc-200 hover:bg-zinc-200/80 active:translate-y-[1px]',
      outline:
        'border border-zinc-300 text-zinc-900 hover:bg-zinc-100 active:translate-y-[1px]',
      ghost:
        'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:translate-y-[1px]',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-2 min-h-[36px] rounded-full gap-1.5',
      md: 'text-sm px-5 py-2.5 min-h-[44px] rounded-full gap-2',
      lg: 'text-base px-6 py-3 min-h-[48px] rounded-full gap-2.5',
    };

    const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClassName}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
