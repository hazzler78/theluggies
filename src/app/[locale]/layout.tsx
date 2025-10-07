import type {Metadata} from 'next';
import {LocaleProvider} from '@/contexts/LocaleContext';
import en from '@/i18n/messages/en.json';
import sv from '@/i18n/messages/sv.json';
import {Geist, Geist_Mono} from 'next/font/google';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'The Luggies',
  description: 'Colorful fun for neurodivergent kids'
};

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

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LocaleProvider locale={locale} messages={messages}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}


