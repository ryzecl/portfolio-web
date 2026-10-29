'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export interface ComboboxOption {
  value: string;
  label: string;
  badge?: string;
  count?: number;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search category...',
  emptyText = 'No options found.',
  className,
  triggerClassName,
  popoverClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find(
    (opt) => opt.value.toLowerCase() === value.toLowerCase()
  );

  return (
    <div className={cn('relative', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'flex h-10 w-full sm:w-[240px] items-center justify-between rounded-full border border-border bg-surface-raised px-4 py-2 text-xs text-foreground transition-all duration-200 hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer shadow-xs select-none',
              triggerClassName
            )}
          >
            <span className="truncate font-medium">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 text-muted opacity-70" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            'w-[var(--radix-popover-trigger-width)] min-w-[240px] p-0 rounded-2xl border border-border bg-surface shadow-2xl backdrop-blur-xl',
            popoverClassName
          )}
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected =
                    option.value.toLowerCase() === value.toLowerCase();

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-xl cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Check
                          className={cn(
                            'h-3.5 w-3.5 text-accent shrink-0 transition-opacity',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span
                          className={cn(
                            'truncate',
                            isSelected && 'font-semibold text-accent'
                          )}
                        >
                          {option.label}
                        </span>
                      </div>
                      {typeof option.count === 'number' && (
                        <span className="ml-auto font-mono text-[10px] text-muted px-1.5 py-0.5 rounded-full bg-surface-raised border border-border">
                          {option.count}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
