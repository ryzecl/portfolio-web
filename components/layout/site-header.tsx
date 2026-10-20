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

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-5 transition-all duration-300 pointer-events-none',
          scrolled && 'py-3.5'
        )}
      >
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
          {/* Mobile brand indicator */}
          <div className="pointer-events-auto md:hidden">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/95 border border-border shadow-sm backdrop-blur-md text-foreground font-medium text-xs hover:border-accent/40 transition-colors"
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
              <span className="font-mono tracking-tight font-medium text-foreground">
                {site.identity.wordmark}
              </span>
            </Link>
          </div>

          {/* Floating Pill Nav Bar */}
          <nav
            aria-label="Main Navigation"
            className="pointer-events-auto hidden md:flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-full bg-surface/90 backdrop-blur-md border border-border shadow-md transition-all duration-200 mx-auto"
          >
            {/* Identity badge inside pill */}
            <Link
              href="/"
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full text-foreground hover:opacity-85 transition-opacity"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-border relative shrink-0">
                <Image
                  src="/images/ferry.png"
                  alt="Ferry logo"
                  fill
                  className="object-cover"
                  sizes="24px"
                  priority
                />
              </div>
              <span className="text-xs font-semibold tracking-tight whitespace-nowrap text-foreground">
                {site.identity.name}
              </span>
            </Link>

            <div className="h-3.5 w-[1px] bg-border mx-1" />

            {/* Links */}
            <div className="flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                if (item.href === '/contact') {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200',
                        isActive
                          ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                          : 'bg-surface-raised text-foreground border-border hover:border-accent/40'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200',
                      isActive
                        ? 'bg-surface-raised text-foreground font-semibold border border-border'
                        : 'text-muted hover:text-foreground hover:bg-surface-raised/50'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Optional CV if present */}
            {site.contact.cv && (
              <a
                href={site.contact.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 inline-flex items-center gap-1 text-xs font-mono px-3 py-1 rounded-full bg-surface-raised border border-border text-foreground hover:text-accent hover:border-accent/40 transition-all"
              >
                <span>CV</span>
                <ArrowUpRight className="w-3 h-3 text-accent" />
              </a>
            )}
          </nav>

          {/* Right Action Button */}
          <div className="pointer-events-auto hidden md:flex items-center">
            <Link
              href="/contact"
              className="w-10 h-10 rounded-2xl bg-surface border border-border hover:border-accent/50 text-foreground transition-all duration-200 flex items-center justify-center shadow-sm active:translate-y-[1px]"
              title="Get in touch"
              aria-label="Contact Ferry"
            >
              <Mail className="w-4 h-4 text-accent" />
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
