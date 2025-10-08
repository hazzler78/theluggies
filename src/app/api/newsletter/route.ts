export const runtime = 'edge';

import {z} from 'zod';
import {getRequestContext} from '@cloudflare/next-on-pages';

const Body = z.object({
  email: z.string().email(),
  locale: z.enum(['en', 'sv'])
});

interface CloudflareEnv {
  DB: D1Database;
  RESEND_API_KEY: string;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {email, locale} = Body.parse(data);

    // Get D1 database from Cloudflare context
    const {env} = getRequestContext<{env: CloudflareEnv}>();
    const db = (env as CloudflareEnv).DB;

    console.log('Newsletter API called', {email, locale, hasDB: !!db, hasKey: !!(env as CloudflareEnv).RESEND_API_KEY});

    if (!db) {
      console.error('D1 database not available');
      return new Response(JSON.stringify({ok: false, error: 'Database not configured'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'}
      });
    }

    // Generate confirmation token
    const token = crypto.randomUUID();

    // Check if email already exists
    const existing = await db.prepare('SELECT id, confirmed FROM newsletter_subscribers WHERE email = ?')
      .bind(email)
      .first();

    if (existing) {
      return new Response(JSON.stringify({ok: true, message: 'Already subscribed'}), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
      });
    }

    // Insert into D1
    await db.prepare(
      `INSERT INTO newsletter_subscribers (email, locale, confirmation_token, confirmed) 
       VALUES (?, ?, ?, 0)`
    )
      .bind(email, locale, token)
      .run();

    // Send welcome email via Resend API directly
    if ((env as CloudflareEnv).RESEND_API_KEY) {
      const confirmUrl = `${new URL(request.url).origin}/${locale}/confirm?token=${token}`;
      
      const subject = locale === 'sv' 
        ? 'Välkommen till The Luggies!' 
        : 'Welcome to The Luggies!';
      
      const html = locale === 'sv'
        ? `
          <h1>Välkommen till The Luggies! 🎵</h1>
          <p>Tack för att du prenumererar på vårt nyhetsbrev!</p>
          <p>För att komplettera din prenumeration och få personliga uppdateringar, vänligen klicka på länken nedan och fyll i ditt namn:</p>
          <p><a href="${confirmUrl}" style="background: linear-gradient(to right, #fde047, #60a5fa, #c084fc); color: white; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">Komplettera ditt namn</a></p>
          <p>Vi ser fram emot att dela musikäventyr med dig varje lördag kl 09:00!</p>
          <p>Med vänliga hälsningar,<br/>The Luggies-teamet 🎨</p>
        `
        : `
          <h1>Welcome to The Luggies! 🎵</h1>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>To complete your subscription and get personalized updates, please click the link below and fill in your name:</p>
          <p><a href="${confirmUrl}" style="background: linear-gradient(to right, #fde047, #60a5fa, #c084fc); color: white; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">Complete your name</a></p>
          <p>We look forward to sharing musical adventures with you every Saturday at 15:00!</p>
          <p>Best regards,<br/>The Luggies Team 🎨</p>
        `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(env as CloudflareEnv).RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'The Luggies <onboarding@resend.dev>',
          to: email,
          subject,
          html
        })
      });
    }

    return new Response(JSON.stringify({ok: true}), {
      status: 200,
      headers: {'Content-Type': 'application/json'}
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    return new Response(JSON.stringify({ok: false, error: String(error)}), {
      status: 400,
      headers: {'Content-Type': 'application/json'}
    });
  }
}
