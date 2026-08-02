import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { markdownToHtml } from '@/lib/markdownToHtml';
import LegalPage from '@/components/legal/LegalPage';
import { isValidLocale, type Locale } from '@/lib/i18n';
import { getAlternates } from '@/lib/seo';

const META: Record<Locale, Metadata> = {
  es: {
    title: 'Política de Privacidad | Vimazdev',
    description:
      'Conocé cómo Vimazdev recopila, usa y protege tu información. Información sobre cookies, Google Analytics, Google AdSense y el Programa de Afiliados de Amazon.',
    alternates: getAlternates('/es/privacidad', 'es'),
    openGraph: {
      type: 'website',
      url: '/es/privacidad',
      siteName: 'Vimazdev',
      locale: 'es_ES',
      alternateLocale: ['en_US'],
      title: 'Política de Privacidad | Vimazdev',
      description:
        'Conocé cómo Vimazdev recopila, usa y protege tu información. Información sobre cookies, Google Analytics, Google AdSense y el Programa de Afiliados de Amazon.',
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: 'Vimazdev — Política de Privacidad',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Política de Privacidad | Vimazdev',
      description:
        'Conocé cómo Vimazdev recopila, usa y protege tu información.',
      images: ['/og.png'],
    },
  },
  en: {
    title: 'Privacy Policy | Vimazdev',
    description:
      'Learn how Vimazdev collects, uses, and protects your information. Details about cookies, Google Analytics, Google AdSense, and the Amazon Associates Program.',
    alternates: getAlternates('/en/privacidad', 'en'),
    openGraph: {
      type: 'website',
      url: '/en/privacidad',
      siteName: 'Vimazdev',
      locale: 'en_US',
      alternateLocale: ['es_ES'],
      title: 'Privacy Policy | Vimazdev',
      description:
        'Learn how Vimazdev collects, uses, and protects your information. Details about cookies, Google Analytics, Google AdSense, and the Amazon Associates Program.',
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: 'Vimazdev — Privacy Policy',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Privacy Policy | Vimazdev',
      description:
        'Learn how Vimazdev collects, uses, and protects your information.',
      images: ['/og.png'],
    },
  },
};

const TITLES: Record<Locale, string> = {
  es: 'Política de Privacidad',
  en: 'Privacy Policy',
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : 'es';
  return META[locale];
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const md = await readFile(
    join(process.cwd(), 'content/legal', `privacy-${locale}.md`),
    'utf-8'
  );
  const html = markdownToHtml(md);

  return <LegalPage title={TITLES[locale]} html={html} />;
}
