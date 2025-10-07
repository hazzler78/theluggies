import {defineRouting} from 'next-intl/routing';

export const locales = ['en', 'sv'] as const;
export type AppLocale = typeof locales[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en'
});

export const {Link, getPathname, redirect, usePathname, useRouter} = routing;


