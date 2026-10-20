import React from 'react';
import Link from 'next/link';
import { SiteData } from '@/lib/types';
import { ArrowUpRight, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/icons';

interface SiteFooterProps {
  site: SiteData;
}

export function SiteFooter({ site }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Identity & Closing line */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-900 text-white">
                {site.identity.wordmark}
              </span>
              <span className="text-base font-bold text-zinc-900">
                {site.identity.name}
              </span>
            </div>
            <p className="text-sm text-zinc-600 font-normal leading-relaxed max-w-sm">
              {site.footer.closingLine}
            </p>
            <p className="text-xs font-mono text-zinc-500">
              {site.identity.title} · {site.identity.location}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <p className="font-mono text-xs tracking-wider uppercase text-zinc-400 font-medium">
              Navigation
            </p>
            <ul className="space-y-2 text-sm">
              {site.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-zinc-600 hover:text-zinc-900 transition-colors inline-flex items-center gap-1"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect / Actions */}
          <div className="md:col-span-3 space-y-3">
            <p className="font-mono text-xs tracking-wider uppercase text-zinc-400 font-medium">
              Connect
            </p>
            <div className="flex flex-col space-y-2 text-sm">
              {site.contact.email && (
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-zinc-600 hover:text-zinc-900 transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-900" />
                  <span>{site.contact.email}</span>
                </a>
              )}
              {site.contact.github && (
                <a
                  href={site.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-zinc-900 transition-colors inline-flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-zinc-900" />
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              )}
              {site.contact.linkedin && (
                <a
                  href={site.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-zinc-900 transition-colors inline-flex items-center gap-1.5"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-zinc-900" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              )}
              {/* Fallback to contact page if direct socials are placeholders */}
              <Link
                href="/contact"
                className="text-zinc-900 font-semibold hover:underline text-xs font-mono inline-flex items-center gap-1 pt-1"
              >
                <span>View contact details</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>
            © {currentYear} {site.footer.copyrightName}. Built with Next.js,
            TypeScript & Tailwind CSS.
          </p>
          <p className="text-zinc-400">
            Clean White Editorial Architecture
          </p>
        </div>
      </div>
    </footer>
  );
}
