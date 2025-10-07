"use client";
import {useLocale} from '@/contexts/LocaleContext';

export function YouTubeSection() {
  const locale = useLocale();
  
  // Channel URLs based on language
  const channelUrl = locale === 'sv' 
    ? 'https://www.youtube.com/@Luggisarna'
    : 'https://www.youtube.com/@TheLuggies';
  
  const channelHandle = locale === 'sv' ? '@Luggisarna' : '@TheLuggies';
  
  // Placeholder video IDs - replace with your actual video IDs
  const videos = [
    { id: 'dQw4w9WgXcQ', title: 'Latest Episode' },
    { id: 'dQw4w9WgXcQ', title: 'Episode 2' },
    { id: 'dQw4w9WgXcQ', title: 'Episode 3' },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        🎬 Latest Videos
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, idx) => (
          <div 
            key={idx}
            className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800"
          >
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
          Subscribe to {channelHandle}
        </a>
      </div>
    </div>
  );
}

