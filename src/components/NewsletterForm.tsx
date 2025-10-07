"use client";
import {useState} from 'react';

export function NewsletterForm() {
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
        placeholder="Your email"
        className="flex-1 rounded-xl border px-4 py-3 min-w-0"
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-xl bg-foreground text-background px-4 py-3 font-semibold"
      >
        {status === 'loading' ? '...' : 'Subscribe'}
      </button>
      {status === 'success' && <span className="text-green-600 ml-2">Thanks!</span>}
      {status === 'error' && <span className="text-red-600 ml-2">Try again</span>}
    </form>
  );
}


