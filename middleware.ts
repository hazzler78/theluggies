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

  // Skip middleware for API routes, static files, and Next.js internals
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Clean hostname (remove port)
  const cleanHostname = hostname.split(':')[0];

  // Handle www redirects first - always redirect www to non-www
  if (cleanHostname.startsWith('www.')) {
    const nonWwwHost = cleanHostname.replace('www.', '');
    const redirectUrl = new URL(request.url);
    redirectUrl.hostname = nonWwwHost;
    return NextResponse.redirect(redirectUrl, 301); // Permanent redirect
  }

  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Check if user is on wrong domain for the locale
    const currentLocale = pathname.split('/')[1] as 'en' | 'sv';
    const expectedLocale = DOMAIN_LOCALE_MAP[cleanHostname as keyof typeof DOMAIN_LOCALE_MAP] || 'en';
    
    // If locale doesn't match domain, redirect to correct domain
    if (currentLocale !== expectedLocale && !cleanHostname.includes('localhost')) {
      const targetDomain = currentLocale === 'en' 
        ? 'https://theluggies.com' 
        : 'https://luggisarna.se';
      
      return NextResponse.redirect(`${targetDomain}${pathname}`, 301);
    }
    
    return NextResponse.next();
  }

  // Determine default locale based on domain
  const defaultLocale = DOMAIN_LOCALE_MAP[cleanHostname as keyof typeof DOMAIN_LOCALE_MAP] || 'en';

  // Redirect to appropriate locale with clean URL
  const redirectUrl = new URL(request.url);
  redirectUrl.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(redirectUrl, 301); // Permanent redirect
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/api/:path*']
};


