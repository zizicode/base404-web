import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/lib/i18n';

const COOKIE_NAME = 'NEXT_LOCALE';

function getPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => { headers[key] = value; });
  const negotiator = new Negotiator({ headers });
  const languages = negotiator.languages();

  try {
    return match(languages, [...LOCALES], DEFAULT_LOCALE) as Locale;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`),
  );

  if (hasLocale) return NextResponse.next();

  const locale = getPreferredLocale(request);
  const redirectUrl = new URL(`/${locale}${pathname}`, request.url);

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(COOKIE_NAME, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
