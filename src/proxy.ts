import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from 'next/server';
import { i18n, type Locale } from './i18n-config';

const getLocale = (request: NextRequest): string => {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const negotiatorHeaders: Record<string, string> = {
    "accept-language": acceptLanguage,
  };

  const locales = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  return matchLocale(languages, locales, i18n.defaultLocale);
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/_vercel")) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const hasLocalePrefix = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  const pathnameIsMissingLocale = !hasLocalePrefix;

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const startedAt = Date.now();
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const isValidCookie =
      cookieLocale && (i18n.locales as readonly string[]).includes(cookieLocale);
    const locale = isValidCookie ? (cookieLocale as Locale) : getLocale(request);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname =
      pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    const duration = Date.now() - startedAt;
    response.headers.set("x-locale-redirect", "1");
    response.headers.append(
      "Server-Timing",
      `locale_redirect;desc="locale redirect";dur=${duration}`
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, and `/favicon.ico`
  // Exclude: api routes, next internals, favicon, and files with extensions (static assets)
  matcher: ["/((?!api|_next|_vercel|favicon.ico|.*\\..*).*)"],
};
