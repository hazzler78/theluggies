"use client";
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from '@/contexts/LocaleContext';
import { YouTubeIcon } from './icons';

interface SubscriberStats {
  subscriberCount: string;
}

export function YouTubeSubscriberBadge() {
  const t = useTranslations('site');
  const locale = useLocale();
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const channelUrl = locale === 'sv' 
    ? 'https://www.youtube.com/@Luggisarna' 
    : 'https://www.youtube.com/@TheLuggies';

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        setLoading(true);
        setError(false);
        
        const response = await fetch(`/api/youtube/subscribers?locale=${locale}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch subscriber count');
        }
        
        const data = await response.json() as SubscriberStats;
        const count = parseInt(data.subscriberCount, 10);
        
        if (!isNaN(count)) {
          setSubscriberCount(count);
        } else {
          throw new Error('Invalid subscriber count');
        }
      } catch (err) {
        console.error('Error fetching subscriber count:', err);
        setError(true);
        // Don't show the badge if there's an error
      } finally {
        setLoading(false);
      }
    }

    fetchSubscribers();
  }, [locale]);

  // Don't render anything if loading or error
  if (loading || error || subscriberCount === null) {
    return null;
  }

  // Format the subscriber count with locale-specific number formatting
  const formattedCount = new Intl.NumberFormat(locale === 'sv' ? 'sv-SE' : 'en-US').format(subscriberCount);

  // Get translation strings and replace {count} placeholder
  const badgeText = t('subscriberBadgeText').replace('{count}', formattedCount);
  const badgeAriaLabel = t('subscriberBadgeAriaLabel').replace('{count}', formattedCount);

  return (
    <a
      href={channelUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-xs sm:text-sm font-medium whitespace-nowrap"
      aria-label={badgeAriaLabel}
    >
      <YouTubeIcon className="flex-shrink-0" size={16} />
      <span>{badgeText}</span>
    </a>
  );
}

