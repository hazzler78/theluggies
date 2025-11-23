"use client";
import {useState} from 'react';
import {useTranslations, useLocale} from '@/contexts/LocaleContext';

export function NewsletterForm() {
  const t = useTranslations('site');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, locale})
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <label htmlFor="newsletter-email" className="sr-only">
          {t('emailPlaceholder')}
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          className="flex-1 rounded-xl border px-4 py-3 min-h-[44px] min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-xl bg-foreground text-background px-4 py-3 min-h-[44px] font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-opacity disabled:opacity-50 touch-manipulation"
        >
          {status === 'loading' ? '...' : t('subscribe')}
        </button>
      </form>
      {status === 'success' && (
        <div className="mt-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" role="status" aria-live="polite">
          <p className="text-green-700 dark:text-green-300 text-sm font-semibold text-center mb-1">
            ✨ {t('thanks')}
          </p>
          <p className="text-green-600 dark:text-green-400 text-xs text-center opacity-90">
            {t('newsletterSuccess')}
          </p>
        </div>
      )}
      {status === 'error' && (
        <p className="text-red-600 dark:text-red-400 mt-2 text-sm text-center" role="alert" aria-live="assertive">
          {t('tryAgain')}
        </p>
      )}
      <p className="text-xs opacity-70 mt-2 text-center">
        {t('newsletterPrivacy')}
      </p>
    </div>
  );
}


