export const runtime = 'edge';

import {z} from 'zod';
import {getRequestContext} from '@cloudflare/next-on-pages';

const Body = z.object({
  youtubeId: z.string(),
  titleSv: z.string(),
  titleEn: z.string(),
  descriptionSv: z.string().optional(),
  descriptionEn: z.string().optional(),
  apiKey: z.string()
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
    const {youtubeId, titleSv, titleEn, descriptionSv, descriptionEn, apiKey} = Body.parse(data);

    const {env} = getRequestContext<{env: CloudflareEnv}>();
    const cfEnv = env as CloudflareEnv;
    const db = cfEnv.DB;

    console.log('Newsletter send API called', {youtubeId, hasDB: !!db, hasKey: !!cfEnv.RESEND_API_KEY});

    // Verify API key
    if (!cfEnv.NEWSLETTER_API_KEY || apiKey !== cfEnv.NEWSLETTER_API_KEY) {
      return new Response(JSON.stringify({ok: false, error: 'Unauthorized'}), {
        status: 401,
        headers: {'Content-Type': 'application/json'}
      });
    }

    if (!db) {
      console.error('D1 database not available');
      return new Response(JSON.stringify({ok: false, error: 'Database not configured'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'}
      });
    }

    if (!cfEnv.RESEND_API_KEY) {
      return new Response(JSON.stringify({ok: false, error: 'Email service not configured'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'}
      });
    }

    // Fetch all confirmed subscribers
    const subscribers = await db.prepare(
      'SELECT email, name, locale FROM newsletter_subscribers WHERE confirmed = 1'
    ).all();

    if (!subscribers.results || subscribers.results.length === 0) {
      return new Response(JSON.stringify({ok: true, sent: 0, message: 'No confirmed subscribers'}), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
      });
    }

    const baseUrl = new URL(request.url).origin;
    let successCount = 0;
    let errorCount = 0;

    // Send emails to all subscribers
    for (const sub of subscribers.results) {
      const subscriber = sub as unknown as Subscriber;
      const isSv = subscriber.locale === 'sv';
      const title = isSv ? titleSv : titleEn;
      const description = isSv ? descriptionSv : descriptionEn;
      const greeting = subscriber.name 
        ? (isSv ? `Hej ${subscriber.name}!` : `Hi ${subscriber.name}!`)
        : (isSv ? 'Hej!' : 'Hi!');
      
      const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
      const videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
      const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

      const subject = isSv 
        ? `🎵 Nytt avsnitt: ${title}`
        : `🎵 New Episode: ${title}`;

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px 40px; text-align: center;">
                        <h1 style="margin: 0; color: #333; font-size: 28px; font-weight: bold;">
                          The Luggies 🎵
                        </h1>
                      </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                      <td style="padding: 0 40px 20px 40px;">
                        <p style="margin: 0; color: #666; font-size: 18px; line-height: 1.6;">
                          ${greeting}
                        </p>
                      </td>
                    </tr>

                    <!-- Announcement -->
                    <tr>
                      <td style="padding: 0 40px 20px 40px;">
                        <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">
                          ${isSv 
                            ? 'Ett nytt musikäventyr med The Luggies finns nu ute! 🎉' 
                            : 'A new musical adventure with The Luggies is out now! 🎉'}
                        </p>
                      </td>
                    </tr>

                    <!-- Video Title -->
                    <tr>
                      <td style="padding: 0 40px 20px 40px;">
                        <h2 style="margin: 0; color: #333; font-size: 24px; font-weight: bold; line-height: 1.3;">
                          ${title}
                        </h2>
                      </td>
                    </tr>

                    ${description ? `
                    <!-- Description -->
                    <tr>
                      <td style="padding: 0 40px 20px 40px;">
                        <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">
                          ${description}
                        </p>
                      </td>
                    </tr>
                    ` : ''}

                    <!-- Video Thumbnail -->
                    <tr>
                      <td style="padding: 0 40px 20px 40px;">
                        <a href="${videoUrl}" style="display: block; text-decoration: none;">
                          <img src="${thumbnailUrl}" alt="${title}" style="width: 100%; height: auto; border-radius: 8px; display: block;" />
                        </a>
                      </td>
                    </tr>

                    <!-- Watch Button -->
                    <tr>
                      <td style="padding: 0 40px 30px 40px; text-align: center;">
                        <a href="${videoUrl}" style="display: inline-block; background: linear-gradient(to right, #fde047, #60a5fa, #c084fc); color: white; padding: 16px 32px; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 18px;">
                          ${isSv ? '▶️ Titta nu' : '▶️ Watch Now'}
                        </a>
                      </td>
                    </tr>

                    <!-- Closing -->
                    <tr>
                      <td style="padding: 0 40px 30px 40px;">
                        <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">
                          ${isSv 
                            ? 'Vi hoppas du gillar det nya avsnittet! Kom ihåg att prenumerera på vår YouTube-kanal för att inte missa framtida äventyr.' 
                            : 'We hope you enjoy the new episode! Remember to subscribe to our YouTube channel to not miss future adventures.'}
                        </p>
                        <p style="margin: 20px 0 0 0; color: #666; font-size: 16px; line-height: 1.6;">
                          ${isSv ? 'Med vänliga hälsningar,' : 'Best regards,'}<br/>
                          <strong>The Luggies Team 🎨</strong>
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background: #f9fafb; border-top: 1px solid #eee;">
                        <p style="margin: 0; color: #999; font-size: 12px; text-align: center; line-height: 1.6;">
                          ${isSv 
                            ? 'Du får detta mejl för att du prenumererar på The Luggies nyhetsbrev.' 
                            : 'You are receiving this email because you subscribed to The Luggies newsletter.'}
                          <br/>
                          <a href="${unsubscribeUrl}" style="color: #999; text-decoration: underline;">
                            ${isSv ? 'Avsluta prenumeration' : 'Unsubscribe'}
                          </a>
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;

      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cfEnv.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'The Luggies <hello@theluggies.com>',
            to: subscriber.email,
            subject,
            html
          })
        });

        if (emailResponse.ok) {
          successCount++;
          const emailData = await emailResponse.json() as { id: string };
          console.log(`Email sent to ${subscriber.email}:`, emailData.id);
        } else {
          errorCount++;
          const errorText = await emailResponse.text();
          console.error(`Failed to send to ${subscriber.email}:`, emailResponse.status, errorText);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error sending to ${subscriber.email}:`, error);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return new Response(JSON.stringify({
      ok: true,
      sent: successCount,
      failed: errorCount,
      total: subscribers.results.length
    }), {
      status: 200,
      headers: {'Content-Type': 'application/json'}
    });

  } catch (error) {
    console.error('Newsletter send error:', error);
    return new Response(JSON.stringify({ok: false, error: String(error)}), {
      status: 400,
      headers: {'Content-Type': 'application/json'}
    });
  }
}

