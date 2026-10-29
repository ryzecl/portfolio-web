import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'accent' | 'success';
}

function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variants = {
    default:
      'border-transparent bg-foreground text-background hover:bg-foreground/80',
    secondary:
      'border-border bg-surface-raised text-foreground hover:bg-surface-raised/80',
    outline:
      'border-border text-foreground hover:bg-surface-raised',
    accent:
      'border-accent/30 bg-accent/10 text-accent font-semibold',
    success:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 select-none',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
