'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg';
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, size = 'default', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 text-xs',
      default: 'h-10 text-xs',
      lg: 'h-12 text-sm',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex w-full items-center rounded-full border border-border bg-surface-raised transition-colors focus-within:border-accent focus-within:ring-1 focus-within:ring-accent',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
InputGroup.displayName = 'InputGroup';

export interface InputGroupAddonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  placement?: 'left' | 'right';
}

const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, placement = 'left', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center text-muted shrink-0 select-none pointer-events-none',
          placement === 'left' ? 'pl-3.5 pr-2' : 'pr-3.5 pl-2',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
InputGroupAddon.displayName = 'InputGroupAddon';

export interface InputGroupInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  InputGroupInputProps
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'w-full flex-1 bg-transparent py-2 text-xs text-foreground placeholder:text-muted/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
InputGroupInput.displayName = 'InputGroupInput';

export { InputGroup, InputGroupAddon, InputGroupInput };
