import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 bg-white">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-zinc-50 border border-zinc-200/90 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-medium">
            Error 404 · Page Not Found
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900">
            Lost in the Architecture
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            The page or project case study you requested could not be located in the catalog.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Button href="/" variant="primary" size="md">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Return to Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
