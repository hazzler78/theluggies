import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import '@/app/globals.css';

// Root layout metadata - this handles the redirect pages
export const metadata: Metadata = {
  title: 'The Luggies',
  description: 'Musical adventures where everyone\'s different - and that\'s okay!',
  openGraph: {
    type: 'website',
    title: 'The Luggies - Musical Adventures for Neurodivergent Kids',
    description: 'Musical adventures where everyone\'s different - and that\'s okay! Join The Luggies - colorful characters bringing joy, music, and inclusivity to neurodivergent children.',
    siteName: 'The Luggies',
    images: [
      {
        url: 'https://theluggies.com/og-image.jpg',
        secureUrl: 'https://theluggies.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'The Luggies - Colorful musical characters',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Luggies - Musical Adventures for Neurodivergent Kids',
    description: 'Musical adventures where everyone\'s different - and that\'s okay! Join The Luggies - colorful characters bringing joy, music, and inclusivity to neurodivergent children.',
    images: ['https://theluggies.com/og-image.jpg'],
  },
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
