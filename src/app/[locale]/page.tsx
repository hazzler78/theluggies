"use client";
import {useTranslations, useLocale} from '@/contexts/LocaleContext';
import {LocaleSwitcher} from '../../components/LocaleSwitcher';
import {YouTubeSchedule} from '../../components/YouTubeSchedule';
import {YouTubeSection} from '../../components/YouTubeSection';
import {NewsletterForm} from '../../components/NewsletterForm';

export default function Home() {
  const t = useTranslations('site');
  const locale = useLocale();
  return (
    <div className="min-h-screen flex flex-col items-center p-6 gap-10">
      <header className="w-full max-w-5xl flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
        <LocaleSwitcher />
      </header>

      <main className="w-full flex flex-col items-center gap-10">
        <p className="text-lg opacity-80" role="doc-subtitle">{t('tagline')}</p>

        {/* YouTube Video Section */}
        <section 
          className="w-full max-w-5xl" 
          aria-label={locale === 'sv' ? 'Senaste YouTube-videor' : 'Latest YouTube videos'}
        >
          <YouTubeSection />
        </section>

        {/* Next Episode Countdown */}
        <section 
          className="w-full max-w-3xl"
          aria-label={locale === 'sv' ? 'Nästa avsnitt' : 'Next episode'}
        >
          <YouTubeSchedule />
        </section>

        {/* Newsletter & Play Button */}
        <section 
          className="w-full max-w-md flex flex-col gap-4 items-center"
          aria-label={locale === 'sv' ? 'Nyhetsbrev och interaktivt innehåll' : 'Newsletter and interactive content'}
        >
          <NewsletterForm />
          
          <a
            href={`/${locale}/play`}
            className="rounded-full bg-gradient-to-r from-yellow-300 via-blue-400 to-purple-400 text-white px-8 py-4 text-xl font-bold cursor-pointer shadow-2xl hover:scale-105 transition-transform inline-block text-center play-button-pulse"
            role="button"
            aria-label={locale === 'sv' ? 'Lek med Luggisarna - interaktivt spel' : 'Play with the Luggies - interactive game'}
          >
            🎮 {t('playButton')}
          </a>
        </section>
      </main>

      <footer className="opacity-70 text-sm py-8" role="contentinfo">
        <nav aria-label={locale === 'sv' ? 'Sociala medier' : 'Social media'}>
          <a 
            href={locale === 'sv' ? 'https://youtube.com/@Luggisarna' : 'https://youtube.com/@TheLuggies'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline"
            aria-label={locale === 'sv' ? 'Besök vår YouTube-kanal' : 'Visit our YouTube channel'}
          >
            {t('watchYouTube')}
          </a>
        </nav>
      </footer>
    </div>
  );
}
