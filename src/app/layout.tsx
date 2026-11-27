import type { Metadata } from 'next';
import './globals.css';
import { getSettings } from '@/lib/data';
import { S, SITE_URL } from '@/lib/util';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Pardhan Travels — Taxi service in Ambala', template: '%s | Pardhan Travels' },
  description: 'Book taxi and cabs from Ambala: one-way, round trip, airport transfers and tours. Sedan, SUV, Innova and Tempo Traveller with verified drivers.',
  openGraph: { title: 'Pardhan Travels — Taxi service in Ambala', type: 'website', locale: 'en_IN' },
};

const themeScript = `try{var t=localStorage.getItem('theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Pardhan Travels',
    description: 'Taxi and cab service in Ambala, Haryana.',
    url: SITE_URL,
    telephone: S(s, 'phone', 'en'),
    email: S(s, 'email', 'en'),
    address: { '@type': 'PostalAddress', streetAddress: S(s, 'address', 'en'), addressLocality: 'Ambala', addressRegion: 'Haryana', addressCountry: 'IN' },
    areaServed: 'Ambala, Chandigarh, Delhi, Shimla, Haridwar, Amritsar',
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
