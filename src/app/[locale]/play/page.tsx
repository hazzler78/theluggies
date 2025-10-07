"use client";
import {useLocale, useTranslations} from '@/contexts/LocaleContext';
import {ParallaxCharacters} from '@/components/ParallaxCharacters';

export default function PlayPage() {
  const locale = useLocale();
  const t = useTranslations('site');
  return (
    <div className="w-screen h-[100svh] overflow-hidden relative flex items-center justify-center bg-gradient-to-b from-white to-[#f6f6ff] dark:from-[#0b0b0f] dark:to-[#111217]">
      <button
        onClick={() => window.location.href = `/${locale}`}
        className="absolute top-4 left-4 z-20 rounded-full bg-foreground text-background px-4 py-2 text-sm font-semibold cursor-pointer"
      >
        ← {t('backButton')}
      </button>

      <div className="w-full max-w-6xl h-full flex items-center justify-center">
        <ParallaxCharacters />
      </div>
    </div>
  );
}


