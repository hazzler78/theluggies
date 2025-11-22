import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// Channel IDs - separate channels for each language
const CHANNEL_IDS = {
  en: 'UCCts1k8vzflIO1srJGIlq7g', // @TheLuggies channel ID
  sv: 'UCUcWjcZ5h-TaL2spkMPc9zg'  // @Luggisarna channel ID
};

interface YouTubeChannelStats {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
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
    
    // Fetch channel statistics
    const response = await fetch(
      `${YOUTUBE_API_URL}/channels?` +
      `part=statistics&` +
      `id=${channelId}&` +
      `key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json() as {
      items: Array<{
        statistics: {
          subscriberCount: string;
          viewCount: string;
          videoCount: string;
        };
      }>;
    };
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Channel not found');
    }

    const stats: YouTubeChannelStats = {
      subscriberCount: data.items[0].statistics.subscriberCount,
      viewCount: data.items[0].statistics.viewCount,
      videoCount: data.items[0].statistics.videoCount
    };

    // Cache for 1 hour (subscriber count doesn't change that frequently)
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });

  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch YouTube subscriber count' }, 
      { status: 500 }
    );
  }
}

