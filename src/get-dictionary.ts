import 'server-only';
import { cache } from 'react';
import { isSupportedLocale } from './i18n-config';
import { notFound } from 'next/navigation';

const dictionaries = {
  ko: () => import('./dictionaries/ko.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = cache(async (locale: string) => {
  if (!isSupportedLocale(locale)) {
    notFound();
  }
  return dictionaries[locale]();
});
