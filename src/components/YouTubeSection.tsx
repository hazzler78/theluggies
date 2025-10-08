"use client";
import {useLocale, useTranslations} from '@/contexts/LocaleContext';

export function YouTubeSection() {
  const locale = useLocale();
  const t = useTranslations('site');
  
  // Channel URLs based on language
  const channelUrl = locale === 'sv' 
    ? 'https://www.youtube.com/@Luggisarna'
    : 'https://www.youtube.com/@TheLuggies';
  
  const channelHandle = locale === 'sv' ? '@Luggisarna' : '@TheLuggies';
  
  // Video IDs - add new video IDs here as they're released
  const videos = locale === 'sv' 
    ? [
        // Swedish channel - add video IDs here when released
        { id: null, title: 'Kommer snart' },
        { id: null, title: 'Kommer snart' },
        { id: null, title: 'Kommer snart' },
      ]
    : [
        // English channel
        { id: 'rnYes3TyW20', title: 'Episode 2' },
        { id: 'pHyEtPYPw_0', title: 'Episode 1' },
        { id: null, title: 'Coming soon' },
      ];

  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        🎬 {t('latestVideos')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, idx) => (
          <div 
            key={idx}
            className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800"
          >
            {video.id ? (
              // Real video
              <>
                <div className="relative pb-[56.25%]">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-sm opacity-80">{video.title}</p>
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

      <div className="text-center mt-8">
        <a 
          href={channelUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-red-600 text-white px-6 py-3 font-semibold hover:bg-red-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          {t('subscribeYouTube')} {channelHandle}
        </a>
      </div>
    </div>
  );
}

