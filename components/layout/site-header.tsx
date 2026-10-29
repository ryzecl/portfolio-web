'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, FolderGit2, SendHorizontal, ArrowUpRight } from 'lucide-react';
import { SiteData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
  site: SiteData;
}

const mobileNavItems = [
  { label: 'Home', href: '/', icon: House },
  { label: 'Project', href: '/projects', icon: FolderGit2 },
  { label: 'Contact', href: '/contact', icon: SendHorizontal },
];

export function SiteHeader({ site }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  const navLinks = site.navigation || [];
  // Primary navigation for center pill (exclude contact which lives as the action CTA button on desktop)
  const primaryNavLinks = navLinks.filter((item) => item.href !== '/contact');

  // When scrolled down and NOT hovered, desktop pill collapses into minimal logo + 3-dots indicator
  const isCollapsed = scrolled && !isHovered;

  const isItemActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Header Bar (Glass Acrylic Look, Wordmark Only) */}
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-40 sm:hidden flex items-center justify-between px-5 py-3.5 bg-white/40 dark:bg-background/50 backdrop-blur-xl backdrop-saturate-180 border-b border-white/40 dark:border-white/10 shadow-[inset_0_-1px_0_rgba(255,255,255,0.4)] transition-all duration-300'
        )}
      >
        <Link
          href="/"
          className="text-base font-bold font-mono tracking-wider text-foreground hover:text-accent transition-colors"
        >
          {site.identity.wordmark || 'FNH.'}
        </Link>
      </header>

      {/* Desktop Floating Capsule Header (sm and up) */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 hidden sm:flex items-center justify-center px-6 py-5 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none',
          scrolled && 'py-3'
        )}
      >
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              handleMouseLeave();
            }
          }}
          className={cn(
            'pointer-events-auto flex items-center rounded-full bg-surface/90 backdrop-blur-md border border-border shadow-md transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] select-none',
            isCollapsed
              ? 'px-3.5 py-1.5 gap-2 hover:border-foreground/40 cursor-pointer shadow-sm hover:shadow-md'
              : 'p-1.5 gap-1.5'
          )}
        >
          {/* Brand Wordmark */}
          <Link
            href="/"
            className="text-xs sm:text-sm font-bold font-mono tracking-tight text-foreground px-2.5 py-1 rounded-full hover:bg-surface-raised transition-colors shrink-0"
          >
            {site.identity.wordmark || 'FNH.'}
          </Link>

          {/* 3-dots Loading / Menu indicator (Smooth fluid fade on scroll) */}
          <div
            className={cn(
              'flex items-center gap-1.5 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
              isCollapsed
                ? 'max-w-15 opacity-100 pr-1'
                : 'max-w-0 opacity-0 pointer-events-none'
            )}
            aria-hidden="true"
            title="Hover to expand menu"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-[pulse_1.4s_ease-in-out_infinite]" />
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-[pulse_1.4s_ease-in-out_0.25s_infinite]" />
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-[pulse_1.4s_ease-in-out_0.5s_infinite]" />
          </div>

          {/* Navigation Cluster: Desktop expandable links + CTA */}
          <div
            className={cn(
              'flex items-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
              isCollapsed
                ? 'max-w-0 opacity-0 pointer-events-none -translate-x-1 scale-95 overflow-hidden'
                : 'max-w-150 opacity-100 translate-x-0 scale-100 overflow-hidden'
            )}
          >
            {/* Desktop Nav Links */}
            <nav
              aria-label="Desktop Navigation"
              className="flex items-center gap-0.5 shrink-0"
            >
              {primaryNavLinks.map((item) => {
                const isActive = isItemActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200',
                      isActive
                        ? 'bg-surface-raised text-foreground font-semibold border border-border shadow-2xs'
                        : 'text-muted hover:text-foreground hover:bg-surface-raised/50'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Let's Collaborate Action Button */}
            <Link
              href="/contact"
              className={cn(
                'inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 shadow-xs shrink-0 ml-1',
                pathname === '/contact'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-foreground text-background hover:opacity-80'
              )}
              title="Let's Collaborate"
            >
              <span>Let&apos;s Collaborate</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Glass Acrylic Bottom Navigation Bar (sm:hidden) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-white/40 dark:bg-background/50 backdrop-blur-xl backdrop-saturate-180 border-t border-white/50 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 px-6"
      >
        <div className="max-w-md mx-auto flex items-center justify-around">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 py-1 px-4 min-w-[64px] min-h-[46px] transition-all duration-200 active:scale-95"
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors stroke-[1.8]',
                    active
                      ? 'text-accent'
                      : 'text-foreground/75 hover:text-foreground'
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] tracking-wider transition-colors',
                    active
                      ? 'font-bold text-accent'
                      : 'font-medium text-foreground/75 hover:text-foreground'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
