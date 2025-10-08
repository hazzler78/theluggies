import {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Luggies - Musical Adventures',
    short_name: 'The Luggies',
    description: 'Musical adventures where everyone\'s different - and that\'s okay!',
    start_url: '/en',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#8B5CF6',
    orientation: 'portrait',
    categories: ['education', 'entertainment', 'kids'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/luggisarna/blue-happy.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/luggisarna/purple-happy.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/luggisarna/yellow-happy.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/luggisarna/blue-happy.png',
        sizes: '540x720',
        type: 'image/png',
      },
    ],
  };
}

