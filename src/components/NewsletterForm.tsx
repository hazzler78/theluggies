"use client";
import {useState} from 'react';
import {useTranslations} from '@/contexts/LocaleContext';

export function NewsletterForm() {
  const t = useTranslations('site');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email})
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2 items-center">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('emailPlaceholder')}
        className="flex-1 rounded-xl border px-4 py-3 min-w-0"
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-xl bg-foreground text-background px-4 py-3 font-semibold"
      >
        {status === 'loading' ? '...' : t('subscribe')}
      </button>
      {status === 'success' && <span className="text-green-600 ml-2">{t('thanks')}</span>}
      {status === 'error' && <span className="text-red-600 ml-2">{t('tryAgain')}</span>}
    </form>
  );
}


