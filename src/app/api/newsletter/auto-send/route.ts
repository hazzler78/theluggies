export const runtime = 'edge';

import {getRequestContext} from '@cloudflare/next-on-pages';

interface CloudflareEnv {
  DB: D1Database;
  RESEND_API_KEY?: string;
  NEWSLETTER_API_KEY?: string;
  YOUTUBE_API_KEY?: string;
  YOUTUBE_CHANNEL_ID_SV?: string;
  YOUTUBE_CHANNEL_ID_EN?: string;
  CRON_SECRET?: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
}

async function getLatestVideo(channelId: string, apiKey: string): Promise<YouTubeVideo | null> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=1&type=video`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error('YouTube API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json() as any;
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const item = data.items[0];
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt
    };
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
    return null;
  }
}

function isRecentlyPublished(publishedAt: string, minutesAgo: number = 30): boolean {
  const publishedTime = new Date(publishedAt);
  const now = new Date();
  const diffMinutes = (now.getTime() - publishedTime.getTime()) / 1000 / 60;
  return diffMinutes >= 0 && diffMinutes <= minutesAgo;
}

export async function GET(request: Request) {
  try {
    const {env} = getRequestContext<{env: CloudflareEnv}>();
    const cfEnv = env as CloudflareEnv;
    const db = cfEnv.DB;

    console.log('Auto-send cron triggered');

    // Verify cron secret (optional but recommended)
    const url = new URL(request.url);
    const cronSecret = url.searchParams.get('secret');
    
    if (cfEnv.CRON_SECRET && cronSecret !== cfEnv.CRON_SECRET) {
      return new Response(JSON.stringify({ok: false, error: 'Unauthorized'}), {
        status: 401,
        headers: {'Content-Type': 'application/json'}
      });
    }

    if (!db) {
      return new Response(JSON.stringify({ok: false, error: 'Database not configured'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'}
      });
    }

    if (!cfEnv.YOUTUBE_API_KEY) {
      return new Response(JSON.stringify({ok: false, error: 'YouTube API key not configured'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'}
      });
    }

    if (!cfEnv.NEWSLETTER_API_KEY) {
      return new Response(JSON.stringify({ok: false, error: 'Newsletter API key not configured'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'}
      });
    }

    const results: Array<{locale: string; video: YouTubeVideo | null; sent: boolean; error?: string}> = [];

    // Check Swedish channel (09:00 release)
    if (cfEnv.YOUTUBE_CHANNEL_ID_SV) {
      console.log('Checking Swedish channel...');
      const videoSv = await getLatestVideo(cfEnv.YOUTUBE_CHANNEL_ID_SV, cfEnv.YOUTUBE_API_KEY);
      
      if (videoSv && isRecentlyPublished(videoSv.publishedAt)) {
        console.log('Found recent Swedish video:', videoSv.id, videoSv.title);
        
        // Check if already sent
        const existing = await db.prepare('SELECT id FROM newsletter_sent WHERE youtube_id = ?')
          .bind(videoSv.id)
          .first();

        if (!existing) {
          // Send newsletter
          try {
            const sendResponse = await fetch(`${url.origin}/api/newsletter/send`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                youtubeId: videoSv.id,
                titleSv: videoSv.title,
                titleEn: videoSv.title, // Use same title if no English version
                descriptionSv: videoSv.description,
                descriptionEn: videoSv.description,
                apiKey: cfEnv.NEWSLETTER_API_KEY
              })
            });

            if (sendResponse.ok) {
              const sendResult = await sendResponse.json() as {sent: number; failed: number};
              
              // Record in database
              await db.prepare(
                'INSERT INTO newsletter_sent (youtube_id, title_sv, title_en, recipients_count, failed_count) VALUES (?, ?, ?, ?, ?)'
              ).bind(videoSv.id, videoSv.title, videoSv.title, sendResult.sent, sendResult.failed).run();

              results.push({locale: 'sv', video: videoSv, sent: true});
              console.log('Swedish newsletter sent successfully');
            } else {
              const error = await sendResponse.text();
              results.push({locale: 'sv', video: videoSv, sent: false, error});
              console.error('Failed to send Swedish newsletter:', error);
            }
          } catch (error) {
            results.push({locale: 'sv', video: videoSv, sent: false, error: String(error)});
            console.error('Error sending Swedish newsletter:', error);
          }
        } else {
          results.push({locale: 'sv', video: videoSv, sent: false, error: 'Already sent'});
          console.log('Swedish newsletter already sent for this video');
        }
      } else {
        results.push({locale: 'sv', video: videoSv, sent: false, error: 'No recent video'});
        console.log('No recent Swedish video found');
      }
    }

    // Check English channel (15:00 release)
    if (cfEnv.YOUTUBE_CHANNEL_ID_EN) {
      console.log('Checking English channel...');
      const videoEn = await getLatestVideo(cfEnv.YOUTUBE_CHANNEL_ID_EN, cfEnv.YOUTUBE_API_KEY);
      
      if (videoEn && isRecentlyPublished(videoEn.publishedAt)) {
        console.log('Found recent English video:', videoEn.id, videoEn.title);
        
        // Check if already sent
        const existing = await db.prepare('SELECT id FROM newsletter_sent WHERE youtube_id = ?')
          .bind(videoEn.id)
          .first();

        if (!existing) {
          // Send newsletter
          try {
            const sendResponse = await fetch(`${url.origin}/api/newsletter/send`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                youtubeId: videoEn.id,
                titleSv: videoEn.title, // Use same title if no Swedish version
                titleEn: videoEn.title,
                descriptionSv: videoEn.description,
                descriptionEn: videoEn.description,
                apiKey: cfEnv.NEWSLETTER_API_KEY
              })
            });

            if (sendResponse.ok) {
              const sendResult = await sendResponse.json() as {sent: number; failed: number};
              
              // Record in database
              await db.prepare(
                'INSERT INTO newsletter_sent (youtube_id, title_sv, title_en, recipients_count, failed_count) VALUES (?, ?, ?, ?, ?)'
              ).bind(videoEn.id, videoEn.title, videoEn.title, sendResult.sent, sendResult.failed).run();

              results.push({locale: 'en', video: videoEn, sent: true});
              console.log('English newsletter sent successfully');
            } else {
              const error = await sendResponse.text();
              results.push({locale: 'en', video: videoEn, sent: false, error});
              console.error('Failed to send English newsletter:', error);
            }
          } catch (error) {
            results.push({locale: 'en', video: videoEn, sent: false, error: String(error)});
            console.error('Error sending English newsletter:', error);
          }
        } else {
          results.push({locale: 'en', video: videoEn, sent: false, error: 'Already sent'});
          console.log('English newsletter already sent for this video');
        }
      } else {
        results.push({locale: 'en', video: videoEn, sent: false, error: 'No recent video'});
        console.log('No recent English video found');
      }
    }

    return new Response(JSON.stringify({
      ok: true,
      results,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {'Content-Type': 'application/json'}
    });

  } catch (error) {
    console.error('Auto-send error:', error);
    return new Response(JSON.stringify({ok: false, error: String(error)}), {
      status: 500,
      headers: {'Content-Type': 'application/json'}
    });
  }
}

