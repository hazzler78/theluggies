"use client";
import {useLocale, useTranslations} from '@/contexts/LocaleContext';
import {ParallaxCharacters} from '@/components/ParallaxCharacters';

export default function PlayPage() {
  const locale = useLocale();
  const t = useTranslations('site');
  return (
    <main 
      className="w-screen h-[100svh] overflow-hidden relative flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#f6f6ff] dark:from-[#0b0b0f] dark:to-[#111217]"
      role="application"
      aria-label={locale === 'sv' ? 'Lek med Luggisarna' : 'Play with the Luggies'}
    >
      <nav className="absolute top-4 left-4 z-20">
        <a
          href={`/${locale}`}
          className="rounded-full bg-foreground text-background px-4 py-2 text-sm font-semibold cursor-pointer inline-block"
          aria-label={locale === 'sv' ? 'Tillbaka till startsidan' : 'Back to homepage'}
        >
          ← {t('backButton')}
        </a>
      </nav>

      <p className="text-lg sm:text-xl font-medium opacity-70 mb-8 text-center px-4" role="doc-tip">
        {t('playInstructions')}
      </p>

      <div className="w-full max-w-6xl h-full flex items-center justify-center" role="group">
        <ParallaxCharacters />
      </div>
    </main>
  );
}


