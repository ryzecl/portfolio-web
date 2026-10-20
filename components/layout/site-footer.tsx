import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SiteData } from '@/lib/types';
import { ArrowUpRight, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/icons';

interface SiteFooterProps {
  site: SiteData;
}

export function SiteFooter({ site }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface mt-24 text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Identity & Closing line */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-border relative shrink-0">
                <Image
                  src="/images/ferry.png"
                  alt="Ferry logo"
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-raised border border-border text-foreground">
                {site.identity.wordmark}
              </span>
              <span className="text-base font-bold text-foreground">
                {site.identity.name}
              </span>
            </div>
            <p className="text-sm text-muted font-normal leading-relaxed max-w-sm">
              {site.footer.closingLine}
            </p>
            <p className="text-xs font-mono text-muted/80">
              {site.identity.title} · {site.identity.location}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <p className="font-mono text-xs tracking-wider uppercase text-muted font-medium">
              Navigation
            </p>
            <ul className="space-y-2 text-sm">
              {site.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect / Actions */}
          <div className="md:col-span-3 space-y-3">
            <p className="font-mono text-xs tracking-wider uppercase text-muted font-medium">
              Connect
            </p>
            <div className="flex flex-col space-y-2 text-sm">
              {site.contact.email && (
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-muted hover:text-accent transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-accent" />
                  <span>{site.contact.email}</span>
                </a>
              )}
              {site.contact.github && (
                <a
                  href={site.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent transition-colors inline-flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-foreground" />
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3 text-muted" />
                </a>
              )}
              {site.contact.linkedin && (
                <a
                  href={site.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent transition-colors inline-flex items-center gap-1.5"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-accent" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-muted" />
                </a>
              )}
              <Link
                href="/contact"
                className="text-foreground hover:text-accent font-semibold text-xs font-mono inline-flex items-center gap-1 pt-1"
              >
                <span>View contact details</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <p>© {currentYear} {site.footer.copyrightName}. All rights reserved.</p>
          <p className="text-[11px] text-muted/70">
            Engineered with Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
