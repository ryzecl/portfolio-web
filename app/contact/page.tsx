import React from 'react';
import type { Metadata } from 'next';
import { getSiteData } from '@/lib/data';
import { SectionHeading } from '@/components/ui/section-heading';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactBento } from '@/components/contact/contact-bento';
import { DotBackground } from '@/components/ui/dot-background';
import { JsonLd } from '@/components/ui/json-ld';

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteData();
  const title = `Contact ${site.identity.name}`;
  const description = `Reach out to ${site.identity.name} for internship opportunities, software engineering collaborations, or project inquiries. Based in ${site.identity.location}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: '/contact',
      type: 'website',
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: `Contact ${site.identity.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/og-image.png'],
    },
    alternates: {
      canonical: '/contact',
    },
  };
}

export default function ContactPage() {
  const site = getSiteData();
  const baseUrl = `https://${site.identity.domain}`;

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${site.identity.name}`,
    url: `${baseUrl}/contact`,
    description: `Reach out to ${site.identity.name} for internship opportunities and software collaborations.`,
    mainEntity: {
      '@type': 'Person',
      name: site.identity.name,
      email: site.contact.email,
      url: baseUrl,
      sameAs: [site.contact.github, site.contact.linkedin].filter(Boolean),
    },
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 sm:pt-40 sm:pb-32 bg-background text-foreground overflow-hidden">
      {/* Precision Ambient Dot Grid Background (Pure dots, zero MicroSlats) */}
      <DotBackground />

      <JsonLd data={contactPageSchema} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        <SectionHeading
          number="CONTACT"
          eyebrow="Initiate Conversation"
          title="Get In Touch"
          description="Let’s discuss internship opportunities, software engineering challenges, or collaborative web projects."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Interactive Magic Bento Cards: Availability & Direct Channels */}
          <div className="lg:col-span-6 w-full">
            <ContactBento site={site} />
          </div>

          {/* Refactored Contact Form with Shadcn UI Primitives */}
          <div className="lg:col-span-6 w-full">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
