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
      'Términos y condiciones de uso de Vimazdev. Información sobre el servicio, descargo de responsabilidad, propiedad intelectual y enlaces de afiliados.',
    alternates: { canonical: '/es/terminos' },
  },
  en: {
    title: 'Terms and Conditions | Vimazdev',
    description:
      'Terms and conditions of use for Vimazdev. Information about the service, disclaimer, intellectual property, and affiliate links.',
    alternates: { canonical: '/en/terminos' },
  },
};

const TITLES: Record<Locale, string> = {
  es: 'Términos y Condiciones de Uso',
  en: 'Terms and Conditions of Use',
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
