// components/ui/theme-toggle.tsx
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Toggle theme"
        className={cn(
          'relative inline-flex size-9 items-center justify-center rounded-full border border-border/80 bg-surface/80 backdrop-blur-md opacity-70 pointer-events-none',
          className
        )}
      >
        <span className="size-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface/90 backdrop-blur-md text-foreground transition-all duration-300 hover:border-accent/50 hover:bg-surface-raised active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer shadow-2xs',
        className
      )}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      {/* Sun icon: Kuning cerah dengan transisi rotasi dan scale */}
      <Sun
        className={cn(
          'size-4 text-amber-400 transition-all duration-300',
          isDark
            ? '-rotate-90 scale-0 opacity-0 absolute'
            : 'rotate-0 scale-100 opacity-100'
        )}
      />

      {/* Moon icon: Hitam / Zinc pekat dengan transisi rotasi dan scale */}
      <Moon
        className={cn(
          'size-4 text-zinc-900 dark:text-zinc-100 transition-all duration-300',
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0 absolute'
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
