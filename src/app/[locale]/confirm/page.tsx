"use client";
import {useTranslations, useLocale} from '@/contexts/LocaleContext';
import {useState, useEffect} from 'react';

export default function ConfirmPage() {
  const t = useTranslations('site');
  const locale = useLocale();
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'invalid'>('idle');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) {
      setStatus('invalid');
    } else {
      setToken(t);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/confirm', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({token, name})
      });
      
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">
          {locale === 'sv' ? 'Ogiltig länk' : 'Invalid link'}
        </h1>
        <p className="opacity-70">
          {locale === 'sv' 
            ? 'Denna bekräftelselänk är inte giltig.' 
            : 'This confirmation link is not valid.'}
        </p>
        <button
          onClick={() => window.location.href = `/${locale}`}
          className="mt-6 rounded-full bg-foreground text-background px-6 py-3 font-semibold"
        >
          {t('backButton')}
        </button>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-4">
          {locale === 'sv' ? 'Tack, ' + name + '!' : 'Thanks, ' + name + '!'}
        </h1>
        <p className="opacity-70 mb-6">
          {locale === 'sv' 
            ? 'Du är nu fullständigt registrerad för vårt nyhetsbrev!' 
            : 'You are now fully registered for our newsletter!'}
        </p>
        <button
          onClick={() => window.location.href = `/${locale}`}
          className="rounded-full bg-gradient-to-r from-yellow-300 via-blue-400 to-purple-400 text-white px-6 py-3 font-semibold"
        >
          {locale === 'sv' ? 'Tillbaka till startsidan' : 'Back to homepage'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        {locale === 'sv' ? 'Välkommen! 🎵' : 'Welcome! 🎵'}
      </h1>
      <p className="opacity-70 mb-6 text-center max-w-md">
        {locale === 'sv' 
          ? 'Fyll i ditt namn så vi kan hälsa dig personligt i våra nyhetsbrev!' 
          : 'Fill in your name so we can greet you personally in our newsletters!'}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={locale === 'sv' ? 'Ditt namn' : 'Your name'}
          className="rounded-xl border px-4 py-3"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-full bg-gradient-to-r from-yellow-300 via-blue-400 to-purple-400 text-white px-6 py-3 font-semibold"
        >
          {status === 'loading' ? '...' : (locale === 'sv' ? 'Bekräfta' : 'Confirm')}
        </button>
        {status === 'error' && (
          <p className="text-red-600 text-center text-sm">
            {locale === 'sv' ? 'Något gick fel. Försök igen.' : 'Something went wrong. Try again.'}
          </p>
        )}
      </form>
    </div>
  );
}

