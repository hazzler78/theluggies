"use client";
import {useLocale} from '@/contexts/LocaleContext';

const DOMAIN_MAP = {
  en: 'https://theluggies.com',
  sv: 'https://luggisarna.se'
};

export function LocaleSwitcher() {
  const locale = useLocale();

  function switchTo(next: 'en' | 'sv') {
    if (next === locale) return;
    
    // Get current path without locale
    const currentPath = window.location.pathname;
    const parts = currentPath.split('/').filter(Boolean);
    
    // Remove current locale from path if it exists
    if (parts[0] === 'en' || parts[0] === 'sv') {
      parts.shift();
    }
    
    // Build the path for the new locale
    const newPath = parts.length > 0 ? '/' + parts.join('/') : '';
    
    // Redirect to the appropriate domain with the new locale
    window.location.href = `${DOMAIN_MAP[next]}/${next}${newPath}`;
  }

  return (
    <div className="inline-flex gap-2 rounded-full border px-2 py-1 text-sm">
      <button
        className={`px-2 py-1 rounded-full ${locale === 'en' ? 'bg-foreground text-background' : ''}`}
        onClick={() => switchTo('en')}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
      <button
        className={`px-2 py-1 rounded-full ${locale === 'sv' ? 'bg-foreground text-background' : ''}`}
        onClick={() => switchTo('sv')}
        aria-pressed={locale === 'sv'}
      >
        SV
      </button>
    </div>
  );
}


