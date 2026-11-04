// components/ui/calendar.tsx
'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'p-3 bg-surface border border-border rounded-xl text-foreground w-fit select-none shadow-xl',
        className
      )}
      classNames={{
        months: 'relative flex flex-col space-y-4',
        month: 'space-y-4',
        month_caption:
          'flex justify-center items-center h-8 relative font-mono text-sm font-semibold text-foreground',
        caption_label: 'text-sm font-semibold tracking-wide text-foreground',
        nav: 'flex items-center justify-between absolute inset-x-0 top-0 h-8 px-1 z-10 pointer-events-none',
        button_previous:
          'h-7 w-7 bg-surface-raised/80 hover:bg-surface-raised border border-border/80 rounded-lg p-0 flex items-center justify-center text-muted hover:text-foreground transition-colors pointer-events-auto cursor-pointer shadow-xs',
        button_next:
          'h-7 w-7 bg-surface-raised/80 hover:bg-surface-raised border border-border/80 rounded-lg p-0 flex items-center justify-center text-muted hover:text-foreground transition-colors pointer-events-auto cursor-pointer shadow-xs',
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex justify-between mb-2',
        weekday:
          'text-muted rounded-md w-8 font-mono font-normal text-xs text-center select-none',
        week: 'flex w-full mt-1 justify-between',
        day: 'h-8 w-8 text-center text-xs p-0 relative flex items-center justify-center',
        day_button:
          'h-8 w-8 p-0 font-mono text-xs rounded-lg hover:bg-surface-raised hover:text-foreground transition-colors flex items-center justify-center cursor-pointer',
        selected:
          'bg-foreground text-background font-bold hover:bg-foreground hover:text-background rounded-lg shadow-sm',
        today: 'border border-accent/70 text-accent font-semibold',
        outside: 'text-muted/40 opacity-25',
        disabled: 'text-muted/20 opacity-20 pointer-events-none',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === 'left') {
            return <ChevronLeft className="h-4 w-4" />;
          }
          return <ChevronRight className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';
