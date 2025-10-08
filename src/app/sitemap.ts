import {MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theluggies.com';
  const currentDate = new Date();
  
  return [
    {
      url: `${baseUrl}/en`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          sv: `${baseUrl}/sv`,
        },
      },
    },
    {
      url: `${baseUrl}/sv`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          sv: `${baseUrl}/sv`,
        },
      },
    },
    {
      url: `${baseUrl}/en/play`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/play`,
          sv: `${baseUrl}/sv/play`,
        },
      },
    },
    {
      url: `${baseUrl}/sv/play`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/play`,
          sv: `${baseUrl}/sv/play`,
        },
      },
    },
  ];
}

