import type {Metadata} from 'next';
import {LocaleProvider} from '@/contexts/LocaleContext';
import en from '@/i18n/messages/en.json';
import sv from '@/i18n/messages/sv.json';
import {Geist, Geist_Mono} from 'next/font/google';
import '@/app/globals.css';

// Metadata per locale
const localeMetadata = {
  en: {
    title: 'The Luggies - Musical Adventures for Neurodivergent Kids | YouTube Channel',
    description: 'Musical adventures where everyone\'s different - and that\'s okay! Join The Luggies - colorful characters bringing joy, music, and inclusivity to neurodivergent children. New episodes every Saturday!',
    keywords: 'The Luggies, neurodivergent kids, inclusive children content, music for kids, autism friendly, ADHD kids, childrens YouTube, Swedish kids show, educational entertainment',
  },
  sv: {
    title: 'The Luggies - Musikäventyr för neurodivergerande barn | YouTube-kanal',
    description: 'Musikäventyr där alla är olika - och det är okej! Följ Luggisarna - färgglada karaktärer som sprider glädje, musik och inkludering till neurodivergerande barn. Nya avsnitt varje lördag!',
    keywords: 'Luggisarna, neurodivergerande barn, inkluderande barninnehåll, musik för barn, autism, ADHD barn, barn YouTube, svensk barnshow, pedagogisk underhållning',
  }
};

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const meta = localeMetadata[locale as 'en' | 'sv'] || localeMetadata.en;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theluggies.com';
  const otherLocale = locale === 'en' ? 'sv' : 'en';
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{name: 'The Luggies Team'}],
    creator: 'The Luggies',
    publisher: 'The Luggies',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'sv': '/sv',
        'x-default': '/en'
      }
    },
    openGraph: {
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      alternateLocale: otherLocale === 'sv' ? 'sv_SE' : 'en_US',
      url: `${baseUrl}/${locale}`,
      title: meta.title,
      description: meta.description,
      siteName: 'The Luggies',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          secureUrl: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'The Luggies - Colorful musical characters',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add your verification codes here when you have them
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
    },
  };
}

// Cloudflare Pages (next-on-pages) requires Edge runtime for dynamic routes
export const runtime = 'edge';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;
  const messages = locale === 'sv' ? sv : en;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theluggies.com';
  
  // Structured data for Organization and WebSite
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'The Luggies',
        alternateName: locale === 'sv' ? 'Luggisarna' : 'The Luggies',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/icon.png`,
          width: 512,
          height: 512,
        },
        sameAs: [
          'https://youtube.com/@TheLuggies',
          'https://youtube.com/@Luggisarna',
        ],
        description: locale === 'sv' 
          ? 'Musikäventyr där alla är olika - och det är okej! Färgglada karaktärer som sprider glädje och inkludering till neurodivergerande barn.'
          : 'Musical adventures where everyone\'s different - and that\'s okay! Colorful characters bringing joy and inclusivity to neurodivergent children.',
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'The Luggies',
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
        inLanguage: locale === 'sv' ? 'sv-SE' : 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/${locale}?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/${locale}/#webpage`,
        url: `${baseUrl}/${locale}`,
        name: locale === 'sv' 
          ? 'The Luggies - Musikäventyr för neurodivergerande barn'
          : 'The Luggies - Musical Adventures for Neurodivergent Kids',
        isPartOf: {
          '@id': `${baseUrl}/#website`,
        },
        about: {
          '@id': `${baseUrl}/#organization`,
        },
        inLanguage: locale === 'sv' ? 'sv-SE' : 'en-US',
      },
      {
        '@type': 'VideoObject',
        name: locale === 'sv' ? 'Luggisarna YouTube-kanal' : 'The Luggies YouTube Channel',
        description: locale === 'sv'
          ? 'Nya musikavsnitt varje lördag kl 09:00 svensk tid'
          : 'New musical episodes every Saturday at 15:00 Stockholm time',
        thumbnailUrl: `${baseUrl}/og-image.jpg`,
        uploadDate: new Date().toISOString(),
        contentUrl: locale === 'sv' 
          ? 'https://youtube.com/@Luggisarna'
          : 'https://youtube.com/@TheLuggies',
      }
    ],
  };

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LocaleProvider locale={locale} messages={messages}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}


