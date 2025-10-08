import {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theluggies.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: 'GPTBot', // OpenAI
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT browsing
        allow: '/',
      },
      {
        userAgent: 'CCBot', // Common Crawl (used by many AI trainers)
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai', // Claude
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot', // Claude bot
        allow: '/',
      },
      {
        userAgent: 'Google-Extended', // Google Bard/Gemini
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot', // Perplexity AI
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

