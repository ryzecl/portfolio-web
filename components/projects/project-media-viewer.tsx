'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectMediaViewerProps {
  title: string;
  coverImage?: string;
  previewImages?: string[];
  className?: string;
}

export function ProjectMediaViewer({
  title,
  coverImage,
  previewImages = [],
  className,
}: ProjectMediaViewerProps) {
  // Aggregate images: coverImage followed by previewImages (filtering out empty strings and duplicates)
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (coverImage && coverImage.trim() !== '') {
      list.push(coverImage.trim());
    }
    if (Array.isArray(previewImages)) {
      previewImages.forEach((img) => {
        if (img && img.trim() !== '' && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }
    return list;
  }, [coverImage, previewImages]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const total = allImages.length;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  // Keyboard navigation when focused
  useEffect(() => {
    if (total <= 1) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, total]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  // 1. Fallback: No real images uploaded yet -> 16:10 default project preview
  if (total === 0) {
    return (
      <div
        className={cn(
          'w-full rounded-2xl border border-border bg-surface overflow-hidden shadow-sm',
          className
        )}
      >
        <div className="relative aspect-[16/10] w-full bg-surface-raised">
          <Image
            src="/images/project-placeholder.png"
            alt={`${title} - Preview Placeholder`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      </div>
    );
  }

  // 2. Single Image (16:10 Cover only)
  if (total === 1) {
    return (
      <div
        className={cn(
          'w-full rounded-2xl border border-border bg-surface overflow-hidden shadow-sm',
          className
        )}
      >
        <div className="relative aspect-[16/10] w-full bg-surface-raised">
          <Image
            src={allImages[0]}
            alt={`${title} - Cover`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
          />
        </div>
      </div>
    );
  }

  // 3. Multi-image Interactive Carousel / Slider (16:10 Aspect Ratio)
  return (
    <div
      className={cn('w-full space-y-3 select-none', className)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label={`${title} screenshot carousel`}
    >
      {/* Main Viewport */}
      <div className="relative aspect-[16/10] w-full rounded-2xl border border-border bg-surface-raised overflow-hidden shadow-sm group">
        <Image
          src={allImages[currentIndex]}
          alt={`${title} - Preview ${currentIndex + 1} of ${total}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 1200px"
          priority
        />

        {/* Prev Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous preview slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/90 hover:bg-surface border border-border text-foreground flex items-center justify-center backdrop-blur-sm transition-all shadow-md cursor-pointer hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next preview slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/90 hover:bg-surface border border-border text-foreground flex items-center justify-center backdrop-blur-sm transition-all shadow-md cursor-pointer hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Counter Overlay */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-surface/90 border border-border backdrop-blur-sm font-mono text-xs text-foreground">
          <span className="font-bold text-accent">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-muted mx-1">/</span>
          <span className="text-muted">{String(total).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Thumbnails / Indicators */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to slide ${idx + 1}`}
              className={cn(
                'relative w-16 h-10 sm:w-20 sm:h-12 aspect-[16/10] rounded-lg border overflow-hidden shrink-0 transition-all cursor-pointer',
                currentIndex === idx
                  ? 'border-accent ring-1 ring-accent'
                  : 'border-border opacity-50 hover:opacity-85'
              )}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>

        <p className="text-[11px] font-mono text-muted hidden sm:block shrink-0">
          Slide or use arrow keys
        </p>
      </div>
    </div>
  );
}
