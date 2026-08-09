export const i18n = {
  defaultLocale: 'ko',
  locales: ['ko', 'en'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const isSupportedLocale = (value: unknown): value is Locale =>
  typeof value === 'string' &&
  (i18n.locales as readonly string[]).includes(value);
