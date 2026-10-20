'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Mail } from 'lucide-react';
import { SiteData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
  site: SiteData;
}

export function SiteHeader({ site }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = site.navigation || [];
  // Primary navigation for center pill (exclude contact which lives in the right CTA cluster)
  const primaryNavLinks = navLinks.filter((item) => item.href !== '/contact');

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-5 transition-all duration-300 pointer-events-none',
          scrolled && 'py-3.5'
        )}
      >
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Wordmark (visible on both mobile and desktop) */}
          <div className="pointer-events-auto flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface/90 border border-border shadow-xs backdrop-blur-md text-foreground font-medium text-xs hover:border-accent/40 transition-colors"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-border relative shrink-0">
                <Image
                  src="/images/ferry.png"
                  alt="Ferry logo"
                  fill
                  className="object-cover"
                  sizes="20px"
                  priority
                />
              </div>
              <span className="font-mono tracking-tight font-semibold text-foreground">
                {site.identity.wordmark}
              </span>
            </Link>
          </div>

          {/* Center Floating Pill Nav Bar (Desktop) */}
          <nav
            aria-label="Main Navigation"
            className="pointer-events-auto hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full bg-surface/90 backdrop-blur-md border border-border shadow-md transition-all duration-200"
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
                    'text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-200',
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

          {/* Right Action Cluster (CV & Contact Bubble CTA) */}
          <div className="pointer-events-auto hidden md:flex items-center gap-2">
            {/* CV Action */}
            {site.contact.cv && (
              <a
                href={site.contact.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono px-3.5 py-1.5 rounded-full bg-surface/90 backdrop-blur-md border border-border text-foreground hover:text-accent hover:border-accent/40 shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                title="Curriculum Vitae"
              >
                <span>CV</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
              </a>
            )}

            {/* Contact Bubble CTA */}
            <Link
              href="/contact"
              className={cn(
                'inline-flex items-center gap-2 text-xs font-medium px-4 py-1.5 rounded-full border shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
                pathname === '/contact'
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-sm'
                  : 'bg-surface/90 text-foreground border-border hover:border-accent/50 hover:text-accent'
              )}
              title="Get in touch"
            >
              <Mail className="w-3.5 h-3.5 text-accent" />
              <span>Contact</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="pointer-events-auto md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2.5 rounded-full bg-surface/95 backdrop-blur-md border border-border text-foreground hover:bg-surface-raised transition-colors focus:outline-none focus:ring-2 focus:ring-accent shadow-sm"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden flex flex-col pt-20 px-6 pb-8 animate-in fade-in duration-200"
        >
          <div className="flex flex-col gap-2 bg-surface border border-border rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-border relative shrink-0">
                <Image
                  src="/images/ferry.png"
                  alt="Ferry portrait"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {site.identity.name}
                </p>
                <p className="text-xs text-muted">
                  {site.identity.statusLabel}
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-1 py-4">
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
                      'px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between',
                      isActive
                        ? 'bg-surface-raised text-accent font-semibold border border-border'
                        : 'text-muted hover:text-foreground hover:bg-surface-raised/50'
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
              {site.contact.cv && (
                <a
                  href={site.contact.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-surface-raised border border-border text-foreground text-sm font-medium text-center flex items-center justify-center gap-1.5 hover:text-accent hover:border-accent/40 transition-colors"
                >
                  <span>View CV</span>
                  <ArrowUpRight className="w-4 h-4 text-accent" />
                </a>
              )}
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-full bg-foreground text-background text-sm font-semibold text-center hover:bg-white/90 transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
