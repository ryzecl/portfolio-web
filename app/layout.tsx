// app/layout.tsx (Metadata & Schema 100% Terjaga)
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { getSiteData } from '@/lib/data';
import { JsonLd } from '@/components/ui/json-ld';
import { Analytics } from '@vercel/analytics/next';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
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
    creator: site.identity.name,
    publisher: site.identity.name,
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
          url: `${baseUrl}/images/og-image.png`,
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
      images: [`${baseUrl}/images/og-image.png`],
      creator: '@ryzecl',
      site: '@ryzecl',
    },
    alternates: {
      canonical: baseUrl,
    },
    other: {
      'theme-color': '#2563eb',
      'msapplication-TileColor': '#2563eb',
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
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans bg-background text-foreground min-h-screen selection:bg-accent selection:text-white antialiased">
        {/* Schema JSON-LD tetap aktif untuk seluruh website */}
        {structuredSchemas.map((schema, i) => (
          <JsonLd key={i} data={schema} />
        ))}
        {/* Konten halaman dirender di sini tanpa navbar/footer publik menimpa dashboard */}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
