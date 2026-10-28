import React from 'react';
import { ContactData, SiteIdentity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Mail, ArrowUpRight } from 'lucide-react';

interface ContactCtaProps {
  contact: ContactData;
  identity: SiteIdentity;
}

export function ContactCta({ contact, identity }: ContactCtaProps) {
  return (
    <section className="py-24 bg-transparent text-foreground" id="contact">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-surface border border-border p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row md:items-center justify-between gap-10 shadow-sm">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted font-medium">
              <span className="text-accent font-bold">04</span>
              <span className="text-border">/</span>
              <span>Collaboration & Opportunities</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
              Let’s build something practical.
            </h2>

            <p className="text-base text-muted leading-relaxed font-normal">
              I am open to internship opportunities, full-stack or backend developer roles (especially Laravel, Next.js, and modern APIs), and collaborating on software projects.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-muted">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>Based in {identity.location} · {identity.statusLabel}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Button href="/contact" size="lg" variant="primary">
              <Mail className="w-4 h-4 mr-1" />
              <span>Get in touch</span>
            </Button>

            <Button href="/projects" size="lg" variant="secondary">
              <span>Review full catalog</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
