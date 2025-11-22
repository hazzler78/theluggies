"use client";
import {useTranslations, useLocale} from '@/contexts/LocaleContext';
import {NewsletterForm} from './NewsletterForm';

export function HeroSection() {
  const t = useTranslations('site');
  const locale = useLocale();
  const channelUrl = locale === 'sv' 
    ? 'https://www.youtube.com/@Luggisarna' 
    : 'https://www.youtube.com/@TheLuggies';

  return (
    <section 
      className="w-full max-w-6xl py-8 sm:py-12 px-4"
      aria-label="Hero section"
    >
      <div className="bg-gradient-to-br from-yellow-50 via-blue-50 to-purple-50 dark:from-yellow-950/20 dark:via-blue-950/20 dark:to-purple-950/20 rounded-3xl p-6 sm:p-8 md:p-12 border border-yellow-200/50 dark:border-yellow-800/30">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left side - Content */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 opacity-90">
              {t('heroValueProp')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 text-white px-6 py-3 min-h-[44px] font-semibold hover:bg-red-700 active:bg-red-800 transition-colors focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2 touch-manipulation"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                {t('heroCTA')}
              </a>
            </div>
          </div>

          {/* Right side - Newsletter */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-2 text-center">
                {t('newsletter')}
              </h3>
              <p className="text-sm opacity-80 mb-4 text-center">
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

