"use client";
import {useState, useEffect} from 'react';
import {useTranslations, useLocale} from '@/contexts/LocaleContext';
import {NewsletterForm} from './NewsletterForm';

export function StickyNewsletterCTA() {
  const t = useTranslations('site');
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    // Show CTA after user scrolls past 50% of viewport
    const handleScroll = () => {
      if (prefersReducedMotion) {
        setIsVisible(false);
        return;
      }
      
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsVisible(scrollPercent > 50 && scrollPercent < 95);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 transition-all duration-300 ease-out"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(calc(100% + 1rem))',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      role="complementary"
      aria-label={t('newsletterAriaLabel')}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-yellow-300 dark:border-yellow-700 p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-sm sm:text-base mb-1">
              {t('newsletter')}
            </h3>
            <p className="text-xs opacity-80">
              {t('newsletterBenefit')}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close newsletter signup"
          >
            <span className="text-lg" aria-hidden="true">×</span>
          </button>
        </div>
        <NewsletterForm />
      </div>
    </div>
  );
}

