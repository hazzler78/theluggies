"use client";
import {createContext, useContext} from 'react';

type Messages = Record<string, any>;

interface LocaleContextType {
  locale: string;
  messages: Messages;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({
  children,
  locale,
  messages
}: {
  children: React.ReactNode;
  locale: string;
  messages: Messages;
}) {
  return (
    <LocaleContext.Provider value={{locale, messages}}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context.locale;
}

export function useTranslations(namespace: string) {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useTranslations must be used within LocaleProvider');
  
  return (key: string) => {
    const keys = `${namespace}.${key}`.split('.');
    let value: any = context.messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
}

