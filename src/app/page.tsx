import {headers} from 'next/headers';
import {redirect} from 'next/navigation';

const DOMAIN_LOCALE_MAP: Record<string, 'en' | 'sv'> = {
  'theluggies.com': 'en',
  'www.theluggies.com': 'en',
  'luggisarna.se': 'sv',
  'www.luggisarna.se': 'sv',
  'localhost': 'en'
};

export default function RootRedirect() {
  const host = headers().get('host') ?? '';
  const cleanHost = host.split(':')[0];
  const locale = DOMAIN_LOCALE_MAP[cleanHost] ?? 'en';

  redirect(`/${locale}`);
}

