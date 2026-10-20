import React from 'react';
import type { Metadata } from 'next';
import { getSiteData } from '@/lib/data';
import { SectionHeading } from '@/components/ui/section-heading';
import { ContactForm } from '@/components/contact/contact-form';
import { Mail, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/icons';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteData();
  return {
    title: `Contact · ${site.identity.name}`,
    description: `Get in touch with ${site.identity.name} for internship opportunities and software collaborations.`,
  };
}

export default function ContactPage() {
  const site = getSiteData();

  return (
    <div className="pt-32 pb-24 sm:pt-40 sm:pb-32 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeading
          number="CONTACT"
          eyebrow="Initiate Conversation"
          title="Get In Touch"
          description="Let’s discuss internship opportunities, software engineering challenges, or collaborative web projects."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Direct channels & Availability status */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-medium">
                  Current Availability
                </span>
              </div>

              <div>
                <p className="text-base font-bold text-zinc-900">
                  {site.identity.statusLabel}
                </p>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Open to full-stack / backend developer internships and selective freelance engagements.
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-200/80 flex items-center gap-2 text-xs font-mono text-zinc-500">
                <MapPin className="w-3.5 h-3.5 text-zinc-900" />
                <span>Location: {site.identity.location} (Remote / Hybrid)</span>
              </div>
            </div>

            {/* Direct Connect Options */}
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900">
                Direct Channels
              </h3>

              <div className="space-y-3">
                {site.contact.email ? (
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 transition-colors group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-zinc-900" />
                      <span className="text-xs font-mono text-zinc-800">
                        {site.contact.email}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 group-hover:text-zinc-900">
                      Email ›
                    </span>
                  </a>
                ) : (
                  <div className="p-3 rounded-xl bg-white border border-zinc-200 text-xs font-mono text-zinc-500">
                    <p className="text-zinc-900 font-semibold mb-0.5">Direct Message</p>
                    <p className="text-[11px] text-zinc-400">Use the contact form to connect directly.</p>
                  </div>
                )}

                {site.contact.github && (
                  <a
                    href={site.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 transition-colors group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <GithubIcon className="w-4 h-4 text-zinc-900" />
                      <span className="text-xs font-mono text-zinc-800">GitHub</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 group-hover:text-zinc-900">
                      Visit ›
                    </span>
                  </a>
                )}

                {site.contact.linkedin && (
                  <a
                    href={site.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 transition-colors group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <LinkedinIcon className="w-4 h-4 text-zinc-900" />
                      <span className="text-xs font-mono text-zinc-800">LinkedIn</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 group-hover:text-zinc-900">
                      Connect ›
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-zinc-50 border border-zinc-200/90 shadow-xs">
            <div className="mb-6 space-y-1">
              <h3 className="text-lg font-bold text-zinc-900">
                Send a Message
              </h3>
              <p className="text-xs text-zinc-600">
                Direct inquiry regarding projects, internships, or engineering discussions.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
