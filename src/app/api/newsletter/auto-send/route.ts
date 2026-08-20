export const runtime = 'edge';

import {getRequestContext} from '@cloudflare/next-on-pages';
import type {NewsletterLocale} from '@/lib/newsletter-email';

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

interface YouTubeSearchResponse {
  items?: Array<{
    id: {videoId: string};
    snippet: {title: string; description: string; publishedAt: string};
  }>;
}

async function getLatestVideo(channelId: string, apiKey: string): Promise<YouTubeVideo | null> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=1&type=video`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error('YouTube API error:', response.status, await response.text());
      return null;
    }
    const data = (await response.json()) as YouTubeSearchResponse;
    const item = data.items?.[0];
    if (!item) return null;
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
    };
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
    return null;
  }
}

type LocaleResult = {
  locale: NewsletterLocale;
  video: YouTubeVideo | null;
  sent: boolean;
  error?: string;
  stats?: unknown;
};

async function sendIfNew(
  db: D1Database,
  origin: string,
  apiKey: string,
  locale: NewsletterLocale,
  video: YouTubeVideo | null
): Promise<LocaleResult> {
  if (!video) {
    return {locale, video: null, sent: false, error: 'No video found'};
  }

  const existing = await db
    .prepare('SELECT id FROM newsletter_sent WHERE youtube_id = ?')
    .bind(video.id)
    .first();

  if (existing) {
    return {locale, video, sent: false, error: 'Already sent'};
  }

  const sendResponse = await fetch(`${origin}/api/newsletter/send`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      youtubeId: video.id,
      locale,
      title: video.title,
      description: video.description,
      apiKey,
    }),
  });

  if (!sendResponse.ok) {
    const error = await sendResponse.text();
    return {locale, video, sent: false, error};
  }

  const stats = await sendResponse.json();
  return {locale, video, sent: true, stats};
}

export async function GET(request: Request) {
  try {
    const {env} = getRequestContext<{env: CloudflareEnv}>();
    const cfEnv = env as CloudflareEnv;
    const db = cfEnv.DB;
    const url = new URL(request.url);
    const cronSecret = url.searchParams.get('secret');
    const isCronTrigger = request.headers.get('CF-Cron') !== null;

    if (!isCronTrigger && cfEnv.CRON_SECRET && cronSecret !== cfEnv.CRON_SECRET) {
      return new Response(
        JSON.stringify({ok: false, error: 'Unauthorized'}),
        {status: 401, headers: {'Content-Type': 'application/json'}}
      );
    }

    if (!db) {
      return new Response(JSON.stringify({ok: false, error: 'Database not configured'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      });
    }
    if (!cfEnv.YOUTUBE_API_KEY) {
      return new Response(JSON.stringify({ok: false, error: 'YouTube API key not configured'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      });
    }
    if (!cfEnv.NEWSLETTER_API_KEY) {
      return new Response(JSON.stringify({ok: false, error: 'Newsletter API key not configured'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      });
    }

    const results: LocaleResult[] = [];

    if (cfEnv.YOUTUBE_CHANNEL_ID_SV) {
      const videoSv = await getLatestVideo(cfEnv.YOUTUBE_CHANNEL_ID_SV, cfEnv.YOUTUBE_API_KEY);
      results.push(
        await sendIfNew(db, url.origin, cfEnv.NEWSLETTER_API_KEY, 'sv', videoSv)
      );
    }

    if (cfEnv.YOUTUBE_CHANNEL_ID_EN) {
      const videoEn = await getLatestVideo(cfEnv.YOUTUBE_CHANNEL_ID_EN, cfEnv.YOUTUBE_API_KEY);
      results.push(
        await sendIfNew(db, url.origin, cfEnv.NEWSLETTER_API_KEY, 'en', videoEn)
      );
    }

    return new Response(
      JSON.stringify({ok: true, results, timestamp: new Date().toISOString()}),
      {status: 200, headers: {'Content-Type': 'application/json'}}
    );
  } catch (error) {
    console.error('Auto-send error:', error);
    return new Response(JSON.stringify({ok: false, error: String(error)}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }
}
