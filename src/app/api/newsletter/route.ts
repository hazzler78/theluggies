export const runtime = 'edge';

import {z} from 'zod';
import {getRequestContext} from '@cloudflare/next-on-pages';
import {buildWelcomeEmail} from '@/lib/newsletter-email';

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
      const unsubscribeUrl = `${new URL(request.url).origin}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
      
      const welcome = buildWelcomeEmail({
        locale,
        confirmUrl,
        unsubscribeUrl,
      });

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(env as CloudflareEnv).RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: welcome.from,
          to: email,
          subject: welcome.subject,
          html: welcome.html
        })
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('Resend API error:', emailResponse.status, errorText);
      } else {
        const emailData = await emailResponse.json() as { id: string };
        console.log('Email sent successfully:', emailData.id);
      }
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
