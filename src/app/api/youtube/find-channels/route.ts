import { NextRequest, NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export async function GET(request: NextRequest) {
  try {
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const handle = searchParams.get('handle');
    const searchTerm = searchParams.get('search');
    
    if (!handle && !searchTerm) {
      return NextResponse.json({ error: 'Handle or search parameter required' }, { status: 400 });
    }

    let response;
    
    if (handle) {
      // Try to find by handle first
      response = await fetch(
        `${YOUTUBE_API_URL}/channels?` +
        `part=id,snippet&` +
        `forHandle=${handle}&` +
        `key=${YOUTUBE_API_KEY}`
      );
    } else {
      // Search by channel name
      response = await fetch(
        `${YOUTUBE_API_URL}/search?` +
        `part=snippet&` +
        `type=channel&` +
        `q=${encodeURIComponent(searchTerm!)}&` +
        `maxResults=5&` +
        `key=${YOUTUBE_API_KEY}`
      );
    }

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json() as {
      items: Array<{
        id: string;
        snippet: {
          title: string;
          customUrl?: string;
          thumbnails: { default?: { url: string } };
          description: string;
        };
      }>;
    };
    
    if (data.items && data.items.length > 0) {
      const channel = data.items[0];
      return NextResponse.json({
        channelId: channel.id,
        title: channel.snippet.title,
        handle: channel.snippet.customUrl || handle,
        thumbnail: channel.snippet.thumbnails.default?.url,
        description: channel.snippet.description,
        allResults: data.items.map((item) => ({
          channelId: item.id,
          title: item.snippet.title,
          handle: item.snippet.customUrl
        }))
      });
    } else {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json(
      { error: 'Failed to find channel' }, 
      { status: 500 }
    );
  }
}
