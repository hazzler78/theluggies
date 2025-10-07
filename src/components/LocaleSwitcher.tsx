"use client";
import {useLocale} from '@/contexts/LocaleContext';

export function LocaleSwitcher() {
  const locale = useLocale();

  function switchTo(next: 'en' | 'sv') {
    if (next === locale) return;
    const currentPath = window.location.pathname;
    const parts = currentPath.split('/').filter(Boolean);
    if (parts[0] === 'en' || parts[0] === 'sv') {
      parts[0] = next;
    } else {
      parts.unshift(next);
    }
    window.location.href = '/' + parts.join('/');
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


