import type { Metadata } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { getSiteData } from '@/lib/data';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { JsonLd } from '@/components/ui/json-ld';
import { PagePreloader } from '@/components/ui/page-preloader';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteData();
  const baseUrl = `https://${site.identity.domain}`;
  const title = `${site.identity.name} — Software Developer & Information Systems Student`;
  const description = site.hero.description;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s · ${site.identity.name}`,
    },
    description,
    authors: [{ name: site.identity.name, url: baseUrl }],
    keywords: [
      site.identity.name,
      'Ferry Noer Hendriawan',
      'Ferry Hendriawan',
      'Ferry N. Hendriawan',
      'ferryhendriawan',
      'ferryhendriawan.my.id',
      'software developer',
      'web developer',
      'full-stack developer',
      'information systems',
      'Next.js',
      'Laravel',
      'Indonesia',
      'portfolio',
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: site.identity.name,
      type: 'website',
      locale: 'en_US',
      alternateLocale: ['id_ID'],
      images: [
        {
          url: '/images/og-image.png',
          secureUrl: `${baseUrl}/images/og-image.png`,
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: `${site.identity.name} — Software Developer & Information Systems`,
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
      canonical: baseUrl,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = getSiteData();
  const baseUrl = `https://${site.identity.domain}`;

  const structuredSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: site.identity.name,
      alternateName: [
        'Ferry Hendriawan',
        'Ferry N. Hendriawan',
      ],
      url: baseUrl,
      image: `${baseUrl}/images/ferry.png`,
      jobTitle: site.identity.title,
      description: site.hero.description,
      knowsAbout: [
        'Full-Stack Web Development',
        'Next.js',
        'TypeScript',
        'React',
        'Laravel',
        'REST API',
        'Database Design',
        'Information Systems',
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'ID',
        addressRegion: site.identity.location,
      },
      sameAs: [
        site.contact.github,
        site.contact.linkedin,
      ].filter(Boolean),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.identity.name,
      url: baseUrl,
      description: site.hero.description,
      inLanguage: 'en-US',
      author: {
        '@type': 'Person',
        name: site.identity.name,
      },
    },
  ];

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-background text-foreground min-h-screen flex flex-col">
        <PagePreloader brandName="FNH ." />
        {structuredSchemas.map((schema, i) => (
          <JsonLd key={i} data={schema} />
        ))}
        <SiteHeader site={site} />
        <main className="flex-grow">{children}</main>
        <SiteFooter site={site} />
      </body>
    </html>
  );
}
