// components/ui/alert-dialog.tsx
'use client';

import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogSizeContext = React.createContext<'default' | 'sm'>('default');

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/70 backdrop-blur-xs animate-macos-overlay',
      className
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
  size?: 'default' | 'sm';
}

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, size = 'default', children, ...props }, ref) => (
  <AlertDialogSizeContext.Provider value={size}>
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed inset-0 m-auto z-50 h-fit w-full outline-none focus:outline-none animate-macos-modal',
          size === 'sm'
            ? 'max-w-[320px] rounded-[22px] border border-border bg-surface text-foreground p-5 shadow-2xl flex flex-col gap-2.5'
            : 'max-w-lg rounded-2xl border border-border bg-surface text-foreground p-6 shadow-2xl flex flex-col gap-4',
          className
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  </AlertDialogSizeContext.Provider>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const size = React.useContext(AlertDialogSizeContext);
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5',
        size === 'sm' ? 'text-center' : 'text-center sm:text-left',
        className
      )}
      {...props}
    />
  );
};
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const size = React.useContext(AlertDialogSizeContext);
  return (
    <div
      className={cn(
        size === 'sm'
          ? 'grid grid-cols-2 gap-2.5 pt-3 border-t border-border/60 mt-1 w-full'
          : 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0 mt-2',
        className
      )}
      {...props}
    />
  );
};
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  const size = React.useContext(AlertDialogSizeContext);
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cn(
        size === 'sm'
          ? 'text-[15px] font-semibold font-sans tracking-tight text-foreground text-center'
          : 'text-base font-semibold font-sans tracking-tight text-foreground',
        className
      )}
      {...props}
    />
  );
});
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  const size = React.useContext(AlertDialogSizeContext);
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn(
        size === 'sm'
          ? 'text-xs text-muted leading-relaxed text-center font-sans px-1'
          : 'text-xs text-muted leading-relaxed font-sans',
        className
      )}
      {...props}
    />
  );
});
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & {
    variant?: ButtonProps['variant'];
  }
>(({ className, variant, ...props }, ref) => {
  const size = React.useContext(AlertDialogSizeContext);
  return (
    <AlertDialogPrimitive.Action asChild ref={ref}>
      <Button
        variant={variant}
        size="sm"
        className={cn(
          'cursor-pointer',
          size === 'sm'
            ? 'w-full h-9 rounded-xl bg-red-600 hover:bg-red-700 text-white font-sans font-semibold text-xs border-0 shadow-2xs'
            : 'font-sans text-xs',
          className
        )}
        {...props}
      />
    </AlertDialogPrimitive.Action>
  );
});
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => {
  const size = React.useContext(AlertDialogSizeContext);
  return (
    <AlertDialogPrimitive.Cancel asChild ref={ref}>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          'cursor-pointer',
          size === 'sm'
            ? 'w-full h-9 rounded-xl bg-surface-raised hover:bg-surface-muted text-foreground border border-border font-sans font-medium text-xs mt-0 shadow-2xs'
            : 'mt-2 sm:mt-0 font-sans text-xs',
          className
        )}
        {...props}
      />
    </AlertDialogPrimitive.Cancel>
  );
});
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
