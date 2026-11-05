'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectMediaViewerProps {
  title: string;
  coverImage?: string;
  previewImages?: string[];
  className?: string;
}

function getImageLabel(src: string): string {
  const filename = src.split('/').pop()?.toLowerCase() || '';
  if (filename.includes('dashboard')) return 'Analytics Dashboard';
  if (filename.includes('seo')) return 'SEO & Metadata Management';
  if (filename.includes('login') || filename.includes('auth')) return 'Authentication Portal';
  if (filename.includes('brava-cms') || filename.includes('cover') || filename.includes('overview')) return 'Platform Overview';
  if (filename.includes('compro') || filename.includes('home')) return 'Homepage Interface';
  if (filename.includes('pos') || filename.includes('retail')) return 'Point of Sale & Checkout';
  if (filename.includes('court') || filename.includes('reservation')) return 'Reservation & Booking Schedule';
  const cleanName = filename
    .replace(/\.[^/.]+$/, '')
    .replace(/-\d{10,}$/, '')
    .replace(/[-_]/g, ' ');
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
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
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const total = allImages.length;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  // Keyboard navigation & ESC for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
        return;
      }
      if (total <= 1) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, total, isLightboxOpen]);

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

  // Mouse drag-to-slide support for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseStartX(e.clientX);
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseStartX !== null) {
      if (Math.abs(e.clientX - mouseStartX) > 8) {
        setIsDragging(true);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX !== null) {
      const diff = mouseStartX - e.clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    setMouseStartX(null);
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleMouseLeave = () => {
    setMouseStartX(null);
    setIsDragging(false);
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
        <div className="relative aspect-16/10 w-full bg-surface-raised">
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
      <>
        <div
          className={cn(
            'w-full rounded-2xl border border-border bg-surface overflow-hidden shadow-sm relative group',
            className
          )}
        >
          <div className="relative aspect-16/10 w-full bg-surface-raised cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
            <Image
              src={allImages[0]}
              alt={`${title} - Cover`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
              priority
            />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border text-foreground hover:text-accent shadow-xs">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-surface/80 hover:bg-surface border border-border text-foreground cursor-pointer z-50"
              aria-label="Tutup pratinjau"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-6xl max-h-[85vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={allImages[0]}
                alt={title}
                className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // 3. Multi-image Interactive Carousel / Slider (16:10 Aspect Ratio)
  return (
    <>
      <div
        className={cn('w-full space-y-3 select-none', className)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-roledescription="carousel"
        aria-label={`${title} screenshot carousel`}
      >
        {/* Main Viewport */}
        <div
          className="relative aspect-16/10 w-full rounded-2xl border border-border bg-surface-raised overflow-hidden shadow-sm group cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={allImages[currentIndex]}
            alt={`${title} - Preview ${currentIndex + 1} of ${total}`}
            fill
            className="object-cover transition-all duration-300 pointer-events-none"
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
          />

          {/* Prev Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous preview slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/90 hover:bg-surface border border-border text-foreground flex items-center justify-center backdrop-blur-sm transition-all shadow-md cursor-pointer hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next preview slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/90 hover:bg-surface border border-border text-foreground flex items-center justify-center backdrop-blur-sm transition-all shadow-md cursor-pointer hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Top-Right Lightbox Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            aria-label="Perbesar gambar"
            className="absolute top-3 right-3 p-2 rounded-xl bg-surface/85 hover:bg-surface border border-border text-foreground hover:text-accent backdrop-blur-sm transition-all shadow-xs cursor-pointer z-10 opacity-0 group-hover:opacity-100"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Slide Context Label */}
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-surface/90 border border-border backdrop-blur-sm font-mono text-xs text-foreground flex items-center gap-2 shadow-xs pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-medium text-foreground">{getImageLabel(allImages[currentIndex])}</span>
          </div>

          {/* Slide Counter Overlay */}
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-surface/90 border border-border backdrop-blur-sm font-mono text-xs text-foreground pointer-events-none">
            <span className="font-bold text-accent">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-muted mx-1">/</span>
            <span className="text-muted">{String(total).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Thumbnails & Helpers */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Jump to slide ${idx + 1}`}
                className={cn(
                  'relative w-16 h-10 sm:w-20 sm:h-12 aspect-16/10 rounded-lg border overflow-hidden shrink-0 transition-all cursor-pointer',
                  currentIndex === idx
                    ? 'border-accent ring-2 ring-accent/50 scale-102'
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

          <div className="flex items-center gap-2 text-[11px] font-mono text-muted hidden sm:flex shrink-0">
            <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px]">
              Geser (Swipe / Drag) atau Panah Keyboard
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-50 text-white font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-accent">{title}</span>
              <span className="text-muted/60">—</span>
              <span className="text-muted">{getImageLabel(allImages[currentIndex])}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>
                {currentIndex + 1} / {total}
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Tutup pratinjau"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Image & Navigation */}
          <div
            className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={allImages[currentIndex]}
              alt={`${title} - Preview Fullscreen`}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* Modal Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Modal Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
