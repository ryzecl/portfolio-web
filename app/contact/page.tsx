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
    <div className="pt-32 pb-24 sm:pt-40 sm:pb-32 bg-background text-foreground">
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
            <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-xs font-mono uppercase tracking-wider text-muted font-medium">
                  Current Availability
                </span>
              </div>

              <div>
                <p className="text-base font-bold text-foreground">
                  {site.identity.statusLabel}
                </p>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Open to full-stack and backend developer internships, engineering roles, and selective projects.
                </p>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center gap-2 text-xs font-mono text-muted">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>Location: {site.identity.location} (Remote / Hybrid)</span>
              </div>
            </div>

            {/* Direct Connect Options */}
            <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-foreground">
                Direct Channels
              </h3>

              <div className="space-y-3">
                {site.contact.email ? (
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface-raised border border-border hover:border-accent/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-accent" />
                      <span className="text-xs font-mono text-foreground/90">
                        {site.contact.email}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-muted group-hover:text-accent">
                      Email
                    </span>
                  </a>
                ) : (
                  <div className="p-3 rounded-xl bg-surface-raised border border-border text-xs font-mono text-muted">
                    <p className="text-foreground font-semibold mb-0.5">Direct Message</p>
                    <p className="text-[11px] text-muted">Use the contact form to connect directly.</p>
                  </div>
                )}

                {site.contact.github && (
                  <a
                    href={site.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface-raised border border-border hover:border-accent/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <GithubIcon className="w-4 h-4 text-foreground" />
                      <span className="text-xs font-mono text-foreground/90">GitHub</span>
                    </div>
                    <span className="text-[11px] font-mono text-muted group-hover:text-accent">
                      Profile
                    </span>
                  </a>
                )}

                {site.contact.linkedin && (
                  <a
                    href={site.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface-raised border border-border hover:border-accent/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <LinkedinIcon className="w-4 h-4 text-accent" />
                      <span className="text-xs font-mono text-foreground/90">LinkedIn</span>
                    </div>
                    <span className="text-[11px] font-mono text-muted group-hover:text-accent">
                      Connect
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 space-y-3">
            <div className="mb-2 space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                Send a Message
              </h3>
              <p className="text-xs text-muted">
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
