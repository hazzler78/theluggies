import { NextRequest, NextResponse } from 'next/server';
import { isYouTubeShort } from '@/lib/youtube-longform';

export const runtime = 'edge';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// Channel IDs - separate channels for each language
const CHANNEL_IDS = {
  en: 'UCCts1k8vzflIO1srJGIlq7g', // @TheLuggies channel ID
  sv: 'UCUcWjcZ5h-TaL2spkMPc9zg'  // @Luggisarna channel ID
};

interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string | undefined;
}

export async function GET(request: NextRequest) {
  try {
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') as 'en' | 'sv';
    
    if (!locale || !CHANNEL_IDS[locale]) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }

    const channelId = CHANNEL_IDS[locale];
    
    // Over-fetch: Shorts share the uploads feed. Site shows longform only.
    const response = await fetch(
      `${YOUTUBE_API_URL}/search?` +
      `part=snippet&` +
      `channelId=${channelId}&` +
      `order=date&` +
      `type=video&` +
      `maxResults=15&` +
      `key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json() as {
      items: Array<{
        id: { videoId: string };
        snippet: {
          title: string;
          publishedAt: string;
          thumbnails: { medium?: { url: string }; default?: { url: string } };
        };
      }>;
    };

    const ids = data.items.map((item) => item.id.videoId).filter(Boolean);
    const durationById: Record<string, string> = {};
    if (ids.length) {
      const det = await fetch(
        `${YOUTUBE_API_URL}/videos?part=contentDetails&id=${ids.join(',')}&key=${YOUTUBE_API_KEY}`
      );
      if (det.ok) {
        const detJson = (await det.json()) as {
          items?: Array<{ id: string; contentDetails?: { duration?: string } }>;
        };
        for (const it of detJson.items || []) {
          durationById[it.id] = it.contentDetails?.duration || '';
        }
      }
    }

    const videos: YouTubeVideo[] = data.items
      .filter((item) => !isYouTubeShort({
        durationIso: durationById[item.id.videoId],
        title: item.snippet.title,
      }))
      .slice(0, 6)
      .map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url
      }));

    // Cache for 1 hour
    return NextResponse.json(videos, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });

  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch YouTube videos' }, 
      { status: 500 }
    );
  }
}
