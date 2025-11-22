"use client";
import {useTranslations} from '@/contexts/LocaleContext';
import Image from 'next/image';

export function CharacterPreview() {
  const t = useTranslations('site');
  
  const characters = [
    {
      color: 'yellow',
      name: t('characters.yellow'),
      image: '/luggisarna/yellow-idle.png',
      description: t('characters.yellowDescription')
    },
    {
      color: 'blue',
      name: t('characters.blue'),
      image: '/luggisarna/blue-idle.png',
      description: t('characters.blueDescription')
    },
    {
      color: 'purple',
      name: t('characters.purple'),
      image: '/luggisarna/purple-idle.png',
      description: t('characters.purpleDescription')
    }
  ];

  return (
    <section 
      className="w-full max-w-5xl"
      aria-label={t('charactersAriaLabel')}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        {t('meetCharacters')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
        {characters.map((character) => (
          <div
            key={character.color}
            className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
          >
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4">
              <Image
                src={character.image}
                alt={`${character.name} Luggie character`}
                fill
                className="object-contain drop-shadow-lg"
                sizes="(max-width: 640px) 128px, 160px"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              {character.name}
            </h3>
            <p className="text-sm opacity-80">
              {character.description}
            </p>
          </div>
        ))}
      </div>
      <p className="text-center mt-6 text-sm opacity-75 max-w-2xl mx-auto">
        {t('characters.uniqueMessage')}
      </p>
    </section>
  );
}

