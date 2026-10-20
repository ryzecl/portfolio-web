'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Bookmark, Mail } from 'lucide-react';
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-zinc-200 shadow-sm backdrop-blur-md text-zinc-900 font-medium text-xs hover:border-zinc-300 transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-zinc-900 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                {site.identity.wordmark.slice(0, 2)}
              </span>
              <span className="font-mono tracking-tight font-medium">
                {site.identity.wordmark}
              </span>
            </Link>
          </div>

          {/* Floating Pill Nav Bar (Inspired by the reference screenshot) */}
          <nav
            aria-label="Main Navigation"
            className="pointer-events-auto hidden md:flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/90 shadow-sm shadow-zinc-200/40 transition-all duration-200 mx-auto"
          >
            {/* Identity badge inside pill */}
            <Link
              href="/"
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full text-zinc-900 hover:opacity-85 transition-opacity"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-900 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                FN
              </div>
              <span className="text-xs font-semibold tracking-tight whitespace-nowrap text-zinc-900">
                {site.identity.name}
              </span>
            </Link>

            <div className="h-3.5 w-[1px] bg-zinc-200 mx-1" />

            {/* Links */}
            <div className="flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                // If link is Contact, style as a clean button capsule
                if (item.href === '/contact') {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200',
                        isActive
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                          : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
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
                        ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Optional CV or Quick Action if available */}
            {site.contact.cv && (
              <a
                href={site.contact.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 inline-flex items-center gap-1 text-xs font-mono px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200/70 transition-all"
              >
                <span>CV</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </nav>

          {/* Right Action Button (Dark rounded squircle from reference screenshot) */}
          <div className="pointer-events-auto hidden md:flex items-center">
            <Link
              href="/contact"
              className="w-10 h-10 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-200 flex items-center justify-center shadow-sm active:translate-y-[1px]"
              title="Get in touch"
              aria-label="Contact Ferry"
            >
              <Bookmark className="w-4 h-4 fill-white" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="pointer-events-auto md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2.5 rounded-full bg-white/95 backdrop-blur-md border border-zinc-200 text-zinc-900 hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-sm"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-zinc-900" />
              ) : (
                <Menu className="w-5 h-5 text-zinc-900" />
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
          className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-xs md:hidden flex flex-col pt-20 px-6 pb-8 animate-in fade-in duration-200"
        >
          <div className="flex flex-col gap-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                FN
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {site.identity.name}
                </p>
                <p className="text-xs text-zinc-500">
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
                        ? 'bg-zinc-100 text-zinc-900 font-semibold'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                    )}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium text-center hover:bg-zinc-800 transition-colors"
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
