"use client";
import {useTranslations, useLocale} from '@/contexts/LocaleContext';
import {NewsletterForm} from './NewsletterForm';
import {YouTubeIcon} from './icons';

export function HeroSection() {
  const t = useTranslations('site');
  const locale = useLocale();
  const channelUrl = locale === 'sv' 
    ? 'https://www.youtube.com/@Luggisarna' 
    : 'https://www.youtube.com/@TheLuggies';

  return (
    <section 
      className="w-full max-w-6xl py-6 sm:py-8 md:py-12 px-4"
      aria-label="Hero section"
    >
      <div className="bg-gradient-to-br from-yellow-50 via-blue-50 to-purple-50 dark:from-yellow-950/20 dark:via-blue-950/20 dark:to-purple-950/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 border border-yellow-200/50 dark:border-yellow-800/30">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 lg:gap-12">
          {/* Left side - Content */}
          <div className="flex-1 text-center lg:text-left min-w-0 max-w-full">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-4 opacity-90 leading-relaxed">
              {t('heroValueProp')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-4 lg:mb-6">
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] text-sm sm:text-base font-semibold hover:bg-red-700 active:bg-red-800 transition-colors focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2 touch-manipulation whitespace-nowrap"
              >
                <YouTubeIcon className="flex-shrink-0" size={20} />
                <span className="truncate">{t('heroCTA')}</span>
              </a>
            </div>
          </div>

          {/* Right side - Newsletter */}
          <div className="flex-1 w-full lg:max-w-md min-w-0 max-w-full">
            <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-center">
                {t('newsletter')}
              </h3>
              <p className="text-xs sm:text-sm opacity-80 mb-4 text-center">
                {t('newsletterBenefit')}
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

