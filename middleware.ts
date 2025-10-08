import {NextRequest, NextResponse} from 'next/server';

const locales = ['en', 'sv'];

// Map domains to their default locale
const DOMAIN_LOCALE_MAP = {
  'theluggies.com': 'en',
  'www.theluggies.com': 'en',
  'luggisarna.se': 'sv',
  'www.luggisarna.se': 'sv',
  'localhost': 'en' // For local development
};

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Check if user is on wrong domain for the locale
    const currentLocale = pathname.split('/')[1] as 'en' | 'sv';
    const expectedLocale = DOMAIN_LOCALE_MAP[hostname.split(':')[0] as keyof typeof DOMAIN_LOCALE_MAP] || 'en';
    
    // If locale doesn't match domain, redirect to correct domain
    if (currentLocale !== expectedLocale) {
      const targetDomain = currentLocale === 'en' 
        ? 'https://theluggies.com' 
        : 'https://luggisarna.se';
      
      // Skip redirect for localhost (development)
      if (!hostname.includes('localhost')) {
        return NextResponse.redirect(`${targetDomain}${pathname}`);
      }
    }
    
    return NextResponse.next();
  }

  // Determine default locale based on domain
  const defaultLocale = DOMAIN_LOCALE_MAP[hostname.split(':')[0] as keyof typeof DOMAIN_LOCALE_MAP] || 'en';

  // Redirect to appropriate locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/api/:path*']
};


