"use client";
import {useLocale, useTranslations} from '@/contexts/LocaleContext';
import {useEffect, useState} from 'react';
import {VideoSkeleton} from './VideoSkeleton';

interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string | undefined;
}

export function YouTubeSection() {
  const locale = useLocale();
  const t = useTranslations('site');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Channel URLs based on language
  const channelUrl = locale === 'sv' 
    ? 'https://www.youtube.com/@Luggisarna'
    : 'https://www.youtube.com/@TheLuggies';
  
  const channelHandle = locale === 'sv' ? '@Luggisarna' : '@TheLuggies';
  
  // Fetch videos from YouTube API
  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const response = await fetch(`/api/youtube/videos?locale=${locale}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const data = await response.json() as YouTubeVideo[];
        setVideos(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching YouTube videos:', err);
        setError('Failed to load videos');
        // Fallback to static videos if API fails
        setVideos(locale === 'sv' 
          ? [
              { id: '', title: 'Kommer snart', publishedAt: '', thumbnail: '' },
              { id: '', title: 'Kommer snart', publishedAt: '', thumbnail: '' },
              { id: '', title: 'Kommer snart', publishedAt: '', thumbnail: '' },
            ]
          : [
              { id: 'rnYes3TyW20', title: 'Episode 2', publishedAt: '', thumbnail: '' },
              { id: 'pHyEtPYPw_0', title: 'Episode 1', publishedAt: '', thumbnail: '' },
              { id: '', title: 'Coming soon', publishedAt: '', thumbnail: '' },
            ]
        );
      } finally {
        setLoading(false);
      }
    }
    
    fetchVideos();
  }, [locale]);

  return (
    <div className="w-full">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center">
        🎬 {t('latestVideos')}
      </h2>
      
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      )}
      
      {error && !loading && videos.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex flex-col items-center gap-4 px-6 py-6 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 max-w-md">
            <span className="text-4xl" aria-hidden="true">🎬</span>
            <div>
              <p className="font-semibold text-lg mb-2">Videos coming soon!</p>
              <p className="text-sm opacity-70 mb-4">
                {t('videoErrorFallback')}
              </p>
              <a 
                href={channelUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 text-white px-6 py-3 min-h-[44px] font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2 touch-manipulation"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                {t('watchYouTube')}
              </a>
            </div>
          </div>
        </div>
      )}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, idx) => (
          <div 
            key={video.id || idx}
            className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800"
          >
            {video.id ? (
              // Real video
              <>
                <div className="relative pb-[56.25%]">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&playsinline=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    frameBorder="0"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-sm opacity-80 line-clamp-2">{video.title}</p>
                  {video.publishedAt && (
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(video.publishedAt).toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-US')}
                    </p>
                  )}
                </div>
              </>
            ) : (
              // Coming soon placeholder
              <div className="relative pb-[56.25%] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                  <div className="text-4xl opacity-30">🎬</div>
                  <p className="font-semibold text-sm opacity-60">{video.title}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      )}

      {!loading && (
        <div className="text-center mt-8">
          <a 
            href={channelUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 text-white px-6 py-3 min-h-[44px] font-semibold hover:bg-red-700 active:bg-red-800 transition-colors focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2 touch-manipulation"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            {t('subscribeYouTube')} {channelHandle}
          </a>
        </div>
      )}
    </div>
  );
}

