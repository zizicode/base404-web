import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { markdownToHtml } from '@/lib/markdownToHtml';
import LegalPage from '@/components/legal/LegalPage';
import { isValidLocale, type Locale } from '@/lib/i18n';

const META: Record<Locale, Metadata> = {
  es: {
    title: 'Términos y Condiciones | Vimazdev',
    description:
      'Términos y condiciones de uso de Vimazdev. Información sobre el uso del sitio, limitación de responsabilidad y derechos de propiedad intelectual.',
    alternates: { canonical: '/es/terminos' },
    openGraph: {
      type: 'website',
      url: '/es/terminos',
      siteName: 'Vimazdev',
      locale: 'es_ES',
      alternateLocale: ['en_US'],
      title: 'Términos y Condiciones | Vimazdev',
      description:
        'Términos y condiciones de uso de Vimazdev. Información sobre el uso del sitio, limitación de responsabilidad y derechos de propiedad intelectual.',
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: 'Vimazdev — Términos y Condiciones',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Términos y Condiciones | Vimazdev',
      description: 'Términos y condiciones de uso de Vimazdev.',
      images: ['/og.png'],
    },
  },
  en: {
    title: 'Terms and Conditions | Vimazdev',
    description:
      'Terms and conditions of use for Vimazdev. Information about site usage, liability limitation, and intellectual property rights.',
    alternates: { canonical: '/en/terminos' },
    openGraph: {
      type: 'website',
      url: '/en/terminos',
      siteName: 'Vimazdev',
      locale: 'en_US',
      alternateLocale: ['es_ES'],
      title: 'Terms and Conditions | Vimazdev',
      description:
        'Terms and conditions of use for Vimazdev. Information about site usage, liability limitation, and intellectual property rights.',
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: 'Vimazdev — Terms and Conditions',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Terms and Conditions | Vimazdev',
      description: 'Terms and conditions of use for Vimazdev.',
      images: ['/og.png'],
    },
  },
};

const TITLES: Record<Locale, string> = {
  es: 'Términos y Condiciones',
  en: 'Terms and Conditions',
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

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const md = await readFile(
    join(process.cwd(), 'content/legal', `terms-${locale}.md`),
    'utf-8'
  );
  const html = markdownToHtml(md);

  return <LegalPage title={TITLES[locale]} html={html} />;
}
