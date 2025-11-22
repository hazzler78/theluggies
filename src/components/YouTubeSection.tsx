"use client";
import {useLocale, useTranslations} from '@/contexts/LocaleContext';
import {useEffect, useState} from 'react';
import {VideoSkeleton} from './VideoSkeleton';
import {YouTubeIcon, MovieCameraIcon} from './icons';

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
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-center px-4 flex items-center justify-center gap-3">
        <MovieCameraIcon className="flex-shrink-0" size={32} />
        <span>{t('latestVideos')}</span>
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
            <MovieCameraIcon size={48} className="opacity-30" />
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
                <YouTubeIcon size={20} />
                {t('watchYouTube')}
              </a>
            </div>
          </div>
        </div>
      )}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                  <MovieCameraIcon size={48} className="opacity-30" />
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
            <YouTubeIcon size={24} />
            {t('subscribeYouTube')} {channelHandle}
          </a>
        </div>
      )}
    </div>
  );
}

