"use client";
import {useTranslations} from '@/contexts/LocaleContext';
import Link from 'next/link';
import {LocaleSwitcher} from '../../components/LocaleSwitcher';
import {ParallaxCharacters} from '../../components/ParallaxCharacters';
import {YouTubeSchedule} from '../../components/YouTubeSchedule';
import {NewsletterForm} from '../../components/NewsletterForm';

export default function Home() {
  const t = useTranslations('site');
  return (
    <div className="min-h-screen flex flex-col items-center p-6 gap-10">
      <header className="w-full max-w-5xl flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
        <LocaleSwitcher />
      </header>

      <p className="text-lg opacity-80">{t('tagline')}</p>

      <ParallaxCharacters />

      <section className="w-full max-w-3xl">
        <YouTubeSchedule />
      </section>

      <section className="w-full max-w-md">
        <NewsletterForm />
      </section>

      <footer className="opacity-70 text-sm py-8">
        <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</Link>
      </footer>
    </div>
  );
}


