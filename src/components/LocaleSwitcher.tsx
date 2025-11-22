"use client";
import {useState} from 'react';
import {useLocale} from '@/contexts/LocaleContext';

const DOMAIN_MAP = {
  en: 'https://theluggies.com',
  sv: 'https://luggisarna.se'
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const [isSwitching, setIsSwitching] = useState(false);

  function switchTo(next: 'en' | 'sv') {
    if (next === locale || isSwitching) return;
    
    setIsSwitching(true);
    
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
    <div className="inline-flex gap-2 rounded-full border px-2 py-1 text-sm" role="group" aria-label={locale === 'sv' ? 'Välj språk' : 'Choose language'}>
      <button
        className={`px-3 py-2 min-h-[36px] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation ${locale === 'en' ? 'bg-foreground text-background' : 'hover:bg-foreground/10'}`}
        onClick={() => switchTo('en')}
        aria-pressed={locale === 'en'}
        disabled={isSwitching}
      >
        {isSwitching && locale === 'en' ? '...' : 'EN'}
      </button>
      <button
        className={`px-3 py-2 min-h-[36px] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation ${locale === 'sv' ? 'bg-foreground text-background' : 'hover:bg-foreground/10'}`}
        onClick={() => switchTo('sv')}
        aria-pressed={locale === 'sv'}
        disabled={isSwitching}
      >
        {isSwitching && locale === 'sv' ? '...' : 'SV'}
      </button>
    </div>
  );
}


