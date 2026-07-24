import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { markdownToHtml } from '@/lib/markdownToHtml';
import LegalPage from '@/components/legal/LegalPage';
import { isValidLocale, type Locale } from '@/lib/i18n';

const META: Record<Locale, Metadata> = {
  es: {
    title: 'Política de Privacidad | Vimazdev',
    description:
      'Conocé cómo Vimazdev recopila, usa y protege tu información. Información sobre cookies, Google Analytics, Google AdSense y el Programa de Afiliados de Amazon.',
    alternates: { canonical: '/es/privacidad' },
  },
  en: {
    title: 'Privacy Policy | Vimazdev',
    description:
      'Learn how Vimazdev collects, uses, and protects your information. Details about cookies, Google Analytics, Google AdSense, and the Amazon Associates Program.',
    alternates: { canonical: '/en/privacidad' },
  },
};

const TITLES: Record<Locale, string> = {
  es: 'Política de Privacidad',
  en: 'Privacy Policy',
};

export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }];
}

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
