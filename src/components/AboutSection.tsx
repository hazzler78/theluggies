"use client";
import {useTranslations} from '@/contexts/LocaleContext';

export function AboutSection() {
  const t = useTranslations('site');

  return (
    <section 
      className="w-full max-w-4xl"
      aria-label={t('aboutAriaLabel')}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        {t('aboutTitle')}
      </h2>
      <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-base sm:text-lg mb-4 opacity-90">
            {t('aboutParagraph1')}
          </p>
          <p className="text-base sm:text-lg mb-4 opacity-90">
            {t('aboutParagraph2')}
          </p>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3">
              {t('ourMission')}
            </h3>
            <p className="text-sm opacity-80">
              {t('missionText')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

