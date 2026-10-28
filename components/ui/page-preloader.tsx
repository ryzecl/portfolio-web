'use client';

import React, { useState, useEffect } from 'react';

interface PagePreloaderProps {
  brandName?: string;
}

export function PagePreloader({ brandName = 'FNH .' }: PagePreloaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

  useEffect(() => {
    // Respect user's motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsLoaded(true);
      setIsDestroyed(true);
      return;
    }

    // Wait until document and fonts are warm, then lift the curtain smoothly
    const handleReady = () => {
      // Small graceful buffer (400ms) to allow WebGL, Canvas, and GSAP to prepare first frame
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 400);
      return () => clearTimeout(timer);
    };

    if (document.readyState === 'complete') {
      handleReady();
    } else {
      window.addEventListener('load', handleReady, { once: true });
    }

    // Safety timeout: ensure preloader dismisses within 1.2s even on slow networks
    const safetyTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 1200);

    return () => {
      window.removeEventListener('load', handleReady);
      clearTimeout(safetyTimer);
    };
  }, []);

  // Remove completely from DOM after fade-out transition finishes (700ms)
  useEffect(() => {
    if (isLoaded) {
      const destroyTimer = setTimeout(() => {
        setIsDestroyed(true);
      }, 750);
      return () => clearTimeout(destroyTimer);
    }
  }, [isLoaded]);

  if (isDestroyed) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground transition-all duration-700 ease-out select-none ${
        isLoaded ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100'
      }`}
      aria-hidden={isLoaded}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Brand Monogram */}
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-2xl sm:text-3xl font-jakarta text-foreground">
            {brandName}
          </span>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>

        {/* Minimal High-Precision Accent Progress Bar */}
        <div className="w-36 sm:w-44 h-0.5 bg-border rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-accent rounded-full animate-preloader-line" />
        </div>
      </div>
    </div>
  );
}
