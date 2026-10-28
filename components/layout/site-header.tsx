'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { SiteData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
  site: SiteData;
}

export function SiteHeader({ site }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsHovered(false);
  }, [pathname]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setIsHovered(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Gentle 150ms buffer so it feels calm and doesn't snap abruptly
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  const navLinks = site.navigation || [];
  // Primary navigation for center pill (exclude contact which lives as the CTA button)
  const primaryNavLinks = navLinks.filter((item) => item.href !== '/contact');

  // When scrolled down and NOT hovered, pill collapses into minimal logo + 3-dots indicator
  const isCollapsed = scrolled && !isHovered;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-4 sm:px-6 py-5 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none',
          scrolled && 'py-3'
        )}
      >
        {/* Interactive Floating Capsule Navbar with smooth fluid transition */}
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
              : 'p-1.5 gap-1 sm:gap-1.5'
          )}
        >
          {/* Brand Wordmark */}
          <Link
            href="/"
            className="text-xs sm:text-sm font-bold font-mono tracking-tight text-foreground px-2.5 py-1 rounded-full hover:bg-surface-raised transition-colors shrink-0"
          >
            {site.identity.wordmark || 'FNH.'}
          </Link>

          {/* 3-dots Loading / Menu indicator (Smooth fluid fade) */}
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

          {/* Expandable Navigation Cluster: Nav links + CTA + Mobile Toggle */}
          <div
            className={cn(
              'flex items-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden',
              isCollapsed
                ? 'max-w-0 opacity-0 pointer-events-none -translate-x-1 scale-95'
                : 'max-w-150 opacity-100 translate-x-0 scale-100'
            )}
          >
            {/* Desktop Nav Links */}
            <nav
              aria-label="Main Navigation"
              className="hidden sm:flex items-center gap-0.5 shrink-0"
            >
              {primaryNavLinks.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-xs font-medium px-3 sm:px-3.5 py-1.5 rounded-full transition-all duration-200',
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

            {/* Let's Collaborate Action Button (Desktop/Tablet only, hidden on mobile) */}
            <Link
              href="/contact"
              className={cn(
                'hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 sm:px-4 py-1.5 rounded-full transition-all duration-200 shadow-xs hover:-translate-y-0.5 active:translate-y-0 shrink-0 ml-0.5 sm:ml-1',
                pathname === '/contact'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-foreground text-background hover:opacity-90'
              )}
              title="Let's Collaborate"
            >
              <span>Let&apos;s Collaborate</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={
                mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              className="sm:hidden p-1.5 rounded-full text-foreground hover:bg-surface-raised transition-colors focus:outline-none ml-1"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-foreground" />
              ) : (
                <Menu className="w-4 h-4 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer with Smooth Slide & Scale Transition */}
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileMenuOpen}
        className={cn(
          'fixed inset-0 z-40 bg-background/80 backdrop-blur-md sm:hidden flex flex-col pt-20 px-4 pb-8 transition-all duration-300 ease-out',
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMobileMenuOpen(false);
        }}
      >
        <div
          className={cn(
            'flex flex-col gap-2 bg-surface border border-border rounded-3xl p-6 shadow-2xl max-w-sm mx-auto w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            mobileMenuOpen
              ? 'translate-y-0 scale-100 opacity-100'
              : '-translate-y-5 scale-95 opacity-0'
          )}
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-border">
            <div>
              <p className="text-sm font-bold font-mono text-foreground">
                {site.identity.wordmark || 'FNH.'}
              </p>
              <p className="text-xs text-muted">
                {site.identity.name}
              </p>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-full text-muted hover:text-foreground hover:bg-surface-raised transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 py-3">
            {navLinks.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center justify-between',
                    isActive
                      ? 'bg-surface-raised text-accent font-semibold border border-border/80 shadow-2xs'
                      : 'text-muted hover:text-foreground hover:bg-surface-raised/60'
                  )}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-2xl bg-foreground text-background text-sm font-semibold text-center hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Let&apos;s Collaborate</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
