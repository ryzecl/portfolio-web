import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 bg-background text-foreground">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-surface border border-border shadow-sm">
        <div className="w-12 h-12 rounded-full bg-surface-raised border border-border text-accent flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-muted uppercase tracking-wider font-medium">
            Error 404 · Page Not Found
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Page Not Located
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
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
