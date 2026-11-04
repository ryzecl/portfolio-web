// components/ui/sonner.tsx
'use client';

import * as React from 'react';
import { Toaster as Sonner, ToasterProps } from 'sonner';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

type SonnerProps = ToasterProps;

const Toaster = ({ ...props }: SonnerProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-right"
      icons={{
        success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
        error: <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
        warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
        info: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
        loading: <Loader2 className="w-4 h-4 text-accent animate-spin shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-[#18181b] group-[.toaster]:text-zinc-100 group-[.toaster]:border-[#27272a] group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl font-sans text-xs py-3 px-3.5 border flex items-center gap-2.5',
          title: 'group-[.toast]:text-zinc-100 font-medium text-xs sm:text-[13px]',
          description: 'group-[.toast]:text-zinc-400 text-xs font-normal mt-0.5',
          actionButton:
            'group-[.toast]:bg-accent group-[.toast]:text-white font-sans text-xs font-medium rounded-lg',
          cancelButton:
            'group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-300 font-sans text-xs rounded-lg',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
