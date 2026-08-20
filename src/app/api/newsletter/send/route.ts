export const runtime = 'edge';

import {z} from 'zod';
import {getRequestContext} from '@cloudflare/next-on-pages';
import {
  buildVideoEmail,
  fromAddress,
  type NewsletterLocale,
} from '@/lib/newsletter-email';

const Body = z.object({
  youtubeId: z.string().min(6),
  locale: z.enum(['sv', 'en']),
  title: z.string().min(1),
  description: z.string().optional(),
  apiKey: z.string(),
});

interface CloudflareEnv {
  DB: D1Database;
  RESEND_API_KEY?: string;
  NEWSLETTER_API_KEY?: string;
}

interface Subscriber {
  email: string;
  name: string | null;
  locale: string;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {youtubeId, locale, title, description, apiKey} = Body.parse(data);
    const lang: NewsletterLocale = locale;

    const {env} = getRequestContext<{env: CloudflareEnv}>();
    const cfEnv = env as CloudflareEnv;
    const db = cfEnv.DB;

    if (!cfEnv.NEWSLETTER_API_KEY || apiKey !== cfEnv.NEWSLETTER_API_KEY) {
      return new Response(JSON.stringify({ok: false, error: 'Unauthorized'}), {
        status: 401,
        headers: {'Content-Type': 'application/json'},
      });
    }

    if (!db) {
      return new Response(JSON.stringify({ok: false, error: 'Database not configured'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      });
    }

    if (!cfEnv.RESEND_API_KEY) {
      return new Response(JSON.stringify({ok: false, error: 'Email service not configured'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      });
    }

    const subscribers = await db
      .prepare(
        `SELECT email, name, locale FROM newsletter_subscribers
         WHERE lower(locale) = ?`
      )
      .bind(lang)
      .all();

    const list = (subscribers.results || []) as unknown as Subscriber[];
    if (list.length === 0) {
      return new Response(
        JSON.stringify({ok: true, sent: 0, failed: 0, total: 0, locale: lang, message: 'No subscribers for locale'}),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    }

    const baseUrl = new URL(request.url).origin;
    let successCount = 0;
    let errorCount = 0;

    for (const subscriber of list) {
      const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
      const {subject, html} = buildVideoEmail({
        locale: lang,
        name: subscriber.name,
        title,
        description,
        youtubeId,
        unsubscribeUrl,
      });

      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cfEnv.RESEND_API_KEY}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({
            from: fromAddress(lang),
            to: subscriber.email,
            subject,
            html,
          }),
        });

        if (emailResponse.ok) {
          successCount++;
          await emailResponse.json();
        } else {
          errorCount++;
          console.error(`Failed to send to ${subscriber.email}:`, emailResponse.status, await emailResponse.text());
        }
      } catch (error) {
        errorCount++;
        console.error(`Error sending to ${subscriber.email}:`, error);
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    try {
      await db
        .prepare(
          'INSERT INTO newsletter_sent (youtube_id, title_sv, title_en, recipients_count, failed_count) VALUES (?, ?, ?, ?, ?)'
        )
        .bind(
          youtubeId,
          lang === 'sv' ? title : '',
          lang === 'en' ? title : '',
          successCount,
          errorCount
        )
        .run();
    } catch (dbError) {
      console.error('Failed to record in database:', dbError);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        sent: successCount,
        failed: errorCount,
        total: list.length,
        locale: lang,
      }),
      {status: 200, headers: {'Content-Type': 'application/json'}}
    );
  } catch (error) {
    console.error('Newsletter send error:', error);
    return new Response(JSON.stringify({ok: false, error: String(error)}), {
      status: 400,
      headers: {'Content-Type': 'application/json'},
    });
  }
}
