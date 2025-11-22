"use client";
import {useTranslations, useLocale} from '@/contexts/LocaleContext';
import {LocaleSwitcher} from '../../components/LocaleSwitcher';
import {YouTubeSchedule} from '../../components/YouTubeSchedule';
import {YouTubeSection} from '../../components/YouTubeSection';
import {NewsletterForm} from '../../components/NewsletterForm';
import {CharacterPreview} from '../../components/CharacterPreview';
import {AboutSection} from '../../components/AboutSection';
import {HeroSection} from '../../components/HeroSection';
import {FAQSection} from '../../components/FAQSection';
import {StickyNewsletterCTA} from '../../components/StickyNewsletterCTA';

export default function Home() {
  const t = useTranslations('site');
  const locale = useLocale();
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 gap-8 sm:gap-10 overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-lg focus:font-semibold focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {t('skipToContent')}
      </a>
      <header className="w-full max-w-5xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{t('titleFull')}</h1>
        <LocaleSwitcher />
      </header>

      <main id="main-content" className="w-full flex flex-col items-center gap-8 sm:gap-10">
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl opacity-95 font-semibold text-center px-4 max-w-4xl leading-snug" role="doc-subtitle">{t('tagline')}</p>

        {/* Hero Section with CTA */}
        <HeroSection />

        {/* YouTube Video Section - Moved up for social proof */}
        <section 
          className="w-full max-w-5xl" 
          aria-label={t('latestVideosAriaLabel')}
        >
          <YouTubeSection />
        </section>

        {/* Character Preview Section */}
        <CharacterPreview />

        {/* About Section */}
        <AboutSection />

        {/* Next Episode Countdown */}
        <section 
          className="w-full max-w-3xl"
          aria-label={t('nextEpisodeAriaLabel')}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sr-only">
            {t('nextEpisode')}
          </h2>
          <YouTubeSchedule />
        </section>

        {/* FAQ Section */}
        <FAQSection />

        {/* Newsletter & Play Button */}
        <section 
          className="w-full max-w-md flex flex-col gap-4 items-center"
          aria-label={t('newsletterAriaLabel')}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center px-4">
            {t('newsletter')}
          </h2>
          <NewsletterForm />
          
          <div className="flex flex-col items-center gap-3 mt-4">
            <p className="text-sm opacity-80 text-center max-w-md">
              {t('playDescription')}
            </p>
            <a
              href={`/${locale}/play`}
              className="rounded-full bg-gradient-to-r from-yellow-300 via-blue-400 to-purple-400 text-white px-8 py-4 min-h-[56px] text-lg sm:text-xl font-bold cursor-pointer shadow-2xl hover:scale-105 active:scale-95 transition-transform inline-flex items-center justify-center play-button-pulse focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation"
              role="button"
              aria-label={t('playAriaLabel')}
            >
              <span aria-hidden="true">🎮</span> {t('playButton')}
            </a>
          </div>
        </section>
      </main>

      <StickyNewsletterCTA />

      <footer className="opacity-70 text-sm py-8" role="contentinfo">
        <nav aria-label={t('socialMediaAriaLabel')}>
          <a 
            href={locale === 'sv' ? 'https://youtube.com/@Luggisarna' : 'https://youtube.com/@TheLuggies'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-label={t('youtubeAriaLabel')}
          >
            {t('watchYouTube')}
          </a>
        </nav>
      </footer>
    </div>
  );
}
