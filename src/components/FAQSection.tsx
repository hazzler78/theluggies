"use client";
import {useTranslations, useLocale} from '@/contexts/LocaleContext';
import {useState} from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const t = useTranslations('site');
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: t('faq1Question'),
      answer: t('faq1Answer')
    },
    {
      question: t('faq2Question'),
      answer: t('faq2Answer')
    },
    {
      question: t('faq3Question'),
      answer: t('faq3Answer')
    },
    {
      question: t('faq4Question'),
      answer: t('faq4Answer')
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQPage schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <section 
      className="w-full max-w-4xl"
      aria-label={t('faqAriaLabel')}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-center px-4">
        {t('faqTitle')}
      </h2>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}}
      />

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/60 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-start sm:items-center justify-between gap-3 sm:gap-4 hover:bg-white/40 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-semibold text-sm sm:text-base md:text-lg pr-2 sm:pr-4 flex-1 text-left">
                {faq.question}
              </span>
              <span 
                className="flex-shrink-0 text-2xl transition-transform"
                aria-hidden="true"
                style={{transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'}}
              >
                ▼
              </span>
            </button>
            <div
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-sm sm:text-base opacity-90">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

