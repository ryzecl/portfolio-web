import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { getSiteData } from '@/lib/data';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

const inter = Inter({
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
  return {
    title: `${site.identity.name} · ${site.identity.title}`,
    description: site.hero.description,
    authors: [{ name: site.identity.name }],
    openGraph: {
      title: `${site.identity.name} · ${site.identity.title}`,
      description: site.hero.description,
      type: 'website',
      locale: 'en_US',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = getSiteData();

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-background text-foreground min-h-screen flex flex-col">
        <SiteHeader site={site} />
        <main className="flex-grow">{children}</main>
        <SiteFooter site={site} />
      </body>
    </html>
  );
}
