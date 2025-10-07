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

      <p className="text-lg opacity-80">{t('tagline')}</p>

      {/* YouTube Section */}
      <section className="w-full max-w-5xl">
        <YouTubeSection />
      </section>

      {/* Next Episode Countdown */}
      <section className="w-full max-w-3xl">
        <YouTubeSchedule />
      </section>

      {/* Newsletter & Play Button */}
      <section className="w-full max-w-md flex flex-col gap-4 items-center">
        <NewsletterForm />
        
        <button 
          onClick={() => window.location.href = `/${locale}/play`}
          className="rounded-full bg-gradient-to-r from-yellow-300 via-blue-400 to-purple-400 text-white px-8 py-4 text-xl font-bold cursor-pointer shadow-2xl hover:scale-105 transition-transform"
        >
          🎮 {locale === 'sv' ? 'Leka med Luggisarna!' : 'Play with the Luggies!'}
        </button>
      </section>

      <footer className="opacity-70 text-sm py-8">
        <a 
          href={locale === 'sv' ? 'https://youtube.com/@Luggisarna' : 'https://youtube.com/@TheLuggies'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:underline"
        >
          {locale === 'sv' ? 'Se oss på YouTube' : 'Watch us on YouTube'}
        </a>
      </footer>
    </div>
  );
}
