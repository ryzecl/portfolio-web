// components/ui/date-picker.tsx
'use client';

import * as React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface DatePickerProps {
  value?: Date | string | null;
  onChange?: (date: Date | undefined) => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  disabledPlaceholder?: string;
  displayFormat?: string;
  className?: string;
  allowClear?: boolean;
}

export function DatePicker({
  value,
  onChange,
  name,
  placeholder = 'Pilih tanggal',
  disabled = false,
  disabledPlaceholder,
  displayFormat = 'MMM yyyy',
  className,
  allowClear = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse initial or incoming value
  const parseDate = (val?: Date | string | null): Date | undefined => {
    if (!val) return undefined;
    if (val instanceof Date) return isValid(val) ? val : undefined;
    // Check if ISO date string (e.g. YYYY-MM-DD or full ISO)
    try {
      const parsed = parseISO(val);
      if (isValid(parsed)) return parsed;
    } catch {
      // Fallback: try new Date(val)
      const d = new Date(val);
      if (isValid(d)) return d;
    }
    return undefined;
  };

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(() =>
    parseDate(value)
  );

  React.useEffect(() => {
    setSelectedDate(parseDate(value));
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(undefined);
    if (onChange) {
      onChange(undefined);
    }
  };

  const isoValue = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  return (
    <div className={cn('relative inline-block w-full', className)}>
      {name && <input type="hidden" name={name} value={disabled ? '' : isoValue} />}

      <Popover open={disabled ? false : open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-between text-left font-mono text-xs rounded-lg h-9 px-3 border-border bg-surface-raised hover:bg-surface-raised/80',
              !selectedDate && !disabled && 'text-muted',
              disabled && 'opacity-60 cursor-not-allowed bg-surface-raised/40 text-muted font-normal'
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <CalendarIcon className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="truncate">
                {disabled
                  ? disabledPlaceholder || 'Present'
                  : selectedDate
                  ? format(selectedDate, displayFormat)
                  : placeholder}
              </span>
            </div>

            {allowClear && selectedDate && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleClear(e as any);
                  }
                }}
                className="p-0.5 rounded hover:bg-surface text-muted hover:text-foreground transition-colors ml-1"
              >
                <X className="w-3 h-3" />
              </span>
            )}
          </Button>
        </PopoverTrigger>

        {!disabled && (
          <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-2xl z-50" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              defaultMonth={selectedDate || new Date()}
            />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
