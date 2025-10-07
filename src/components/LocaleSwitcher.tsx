"use client";
import {useLocale} from '@/contexts/LocaleContext';
import {useRouter, usePathname} from 'next/navigation';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: 'en' | 'sv') {
    if (next === locale) return;
    const newPath = pathname.replace(`/${locale}`, `/${next}`);
    router.push(newPath);
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


