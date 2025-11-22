"use client";
import {useTranslations} from '@/contexts/LocaleContext';
import Image from 'next/image';
import {useState, useEffect} from 'react';

interface AnimatedCharacterProps {
  color: string;
  name: string;
  description: string;
  index: number;
}

function AnimatedCharacter({color, name, description, index}: AnimatedCharacterProps) {
  const [currentImage, setCurrentImage] = useState<'idle' | 'surprised'>('idle');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const idleImage = `/luggisarna/${color}-idle.png`;
  const surprisedImage = `/luggisarna/${color}-surprised.png`;

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    // Use addEventListener if available, otherwise fallback
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  useEffect(() => {
    // Don't animate if user prefers reduced motion
    if (prefersReducedMotion) return;
    // Each character has a different initial delay and timing
    const baseDelay = index * 500; // Stagger the initial animations
    const minInterval = 3000; // Minimum time between swaps (3 seconds)
    const maxInterval = 6000; // Maximum time between swaps (6 seconds)
    
    const timeoutIds: NodeJS.Timeout[] = [];
    let isMounted = true;

    const scheduleNextSwap = () => {
      if (!isMounted) return;
      
      const nextInterval = Math.random() * (maxInterval - minInterval) + minInterval;
      const timeoutId = setTimeout(() => {
        if (!isMounted) return;
        
        setIsTransitioning(true);
        
        // Change image after fade out
        const transitionTimeout = setTimeout(() => {
          if (!isMounted) return;
          setCurrentImage(prev => prev === 'idle' ? 'surprised' : 'idle');
          setIsTransitioning(false);
          scheduleNextSwap();
        }, 150); // Half of transition duration
        
        timeoutIds.push(transitionTimeout);
      }, nextInterval);
      
      timeoutIds.push(timeoutId);
    };

    // Initial delay before first animation
    const initialTimeout = setTimeout(() => {
      if (isMounted) {
        scheduleNextSwap();
      }
    }, baseDelay);
    
    timeoutIds.push(initialTimeout);

    return () => {
      isMounted = false;
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [index, prefersReducedMotion]);

  return (
    <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-4">
        <Image
          src={currentImage === 'idle' ? idleImage : surprisedImage}
          alt={`${name} Luggie character with ${currentImage} expression`}
          fill
          className={`object-contain drop-shadow-lg transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
          sizes="(max-width: 640px) 192px, 224px"
        />
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2">
        {name}
      </h3>
      <p className="text-sm opacity-80">
        {description}
      </p>
    </div>
  );
}

export function CharacterPreview() {
  const t = useTranslations('site');
  
  const characters = [
    {
      color: 'yellow',
      name: t('characters.yellow'),
      description: t('characters.yellowDescription')
    },
    {
      color: 'blue',
      name: t('characters.blue'),
      description: t('characters.blueDescription')
    },
    {
      color: 'purple',
      name: t('characters.purple'),
      description: t('characters.purpleDescription')
    }
  ];

  return (
    <section 
      className="w-full max-w-5xl"
      aria-label={t('charactersAriaLabel')}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-center px-4">
        {t('meetCharacters')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
        {characters.map((character, index) => (
          <AnimatedCharacter
            key={character.color}
            color={character.color}
            name={character.name}
            description={character.description}
            index={index}
          />
        ))}
      </div>
      <p className="text-center mt-6 text-sm opacity-75 max-w-2xl mx-auto">
        {t('characters.uniqueMessage')}
      </p>
    </section>
  );
}

