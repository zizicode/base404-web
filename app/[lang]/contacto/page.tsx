import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';
import { isValidLocale, type Locale } from '@/lib/i18n';
import ContactForm from './ContactForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : 'es';
  const dict = await getDictionary(locale);
  const contact = dict.contact as Record<string, string>;

  const title = contact.title;
  const description = contact.subtitle;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/contacto`,
    },
    openGraph: {
      type: 'website',
      url: `/${locale}/contacto`,
      siteName: 'Vimazdev',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: [locale === 'es' ? 'en_US' : 'es_ES'],
      title,
      description,
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: 'Vimazdev — Contacto',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.png'],
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const contact = dict.contact as Record<string, string>;

  return <ContactForm locale={locale} contact={contact} />;
}