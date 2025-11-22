"use client";
import {useTranslations} from '@/contexts/LocaleContext';

export function AboutSection() {
  const t = useTranslations('site');

  return (
    <section 
      className="w-full max-w-4xl"
      aria-label={t('aboutAriaLabel')}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-center px-4">
        {t('aboutTitle')}
      </h2>
      <div className="bg-white/60 dark:bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-800">
        <p className="text-base sm:text-lg mb-6 opacity-90 text-center">
          {t('aboutParagraph1')}
        </p>
        
        {/* Bullet points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0" aria-hidden="true">🎵</span>
            <p className="text-sm sm:text-base opacity-90">{t('aboutBullet1')}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0" aria-hidden="true">✨</span>
            <p className="text-sm sm:text-base opacity-90">{t('aboutBullet2')}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0" aria-hidden="true">📅</span>
            <p className="text-sm sm:text-base opacity-90">{t('aboutBullet3')}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0" aria-hidden="true">❤️</span>
            <p className="text-sm sm:text-base opacity-90">{t('aboutBullet4')}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-center">
            {t('ourMission')}
          </h3>
          <p className="text-sm sm:text-base opacity-80 text-center">
            {t('missionText')}
          </p>
        </div>
      </div>
    </section>
  );
}

