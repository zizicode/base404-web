import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, Tag, Cpu, Eye, ThumbsUp,
  AlertTriangle, Lightbulb, ListChecks, HelpCircle, PlayCircle,
} from 'lucide-react';
import { getErrorBySlug } from '@/lib/api/errors';
import { getPreferredVideos } from '@/lib/api/videos';
import { isValidLocale, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/dictionaries/dictionaries';
import ErrorVideoSelector from '@/components/error-video-selector/ErrorVideoSelector';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) return {};
  const error = await getErrorBySlug(slug, lang);
  if (!error) return {};
  return {
    title: error.seo.title,
    description: error.seo.metaDescription,
    robots: error.seo.robots,
    alternates: {
      canonical: error.seo.canonicalUrl,
      languages: Object.fromEntries(
        error.hreflangAlternates.map(({ locale, url }) => [locale, url])
      ),
    },
    openGraph: {
      title: error.seo.og.title,
      description: error.seo.og.description,
      images: error.seo.og.image ? [error.seo.og.image] : [],
    },
  };
}

export default async function ErrorPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) notFound();
  const locale = lang as Locale;

  const [error, dict] = await Promise.all([
    getErrorBySlug(slug, locale),
    getDictionary(locale),
  ]);

  if (!error) notFound();

  const isEs = locale === 'es';
  const preferredVideos = getPreferredVideos(error.content.videos, locale);
  const labels = {
    brand:       isEs ? 'Marca'           : 'Brand',
    category:    isEs ? 'Categoría'       : 'Category',
    model:       isEs ? 'Modelo'          : 'Model',
    causes:      isEs ? 'Causas comunes'  : 'Common causes',
    solutions:   isEs ? 'Soluciones'      : 'Solutions',
    steps:       isEs ? 'Pasos a seguir'  : 'Steps to follow',
    faqs:        isEs ? 'Preguntas frecuentes' : 'Frequently asked questions',
    videos:      isEs ? 'Videos'          : 'Videos',
    related:     isEs ? 'Errores relacionados' : 'Related errors',
    views:       isEs ? 'vistas'          : 'views',
    helpful:     isEs ? 'útil'            : 'helpful',
    backBrand:   isEs ? `Errores de ${error.brand.name}` : `${error.brand.name} errors`,
    backCat:     isEs ? `Errores de ${error.category.name}` : `${error.category.name} errors`,
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(error.seo.schemaJsonLd) }}
      />

      <main className={styles.page}>
        <div className="container">

          {/* ── Breadcrumb ──────────────────────────────── */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href={`/${locale}/marcas/${error.brand.slug}`} className={styles.crumbLink}>
              {error.brand.name}
            </Link>
            <ChevronRight size={13} className={styles.crumbSep} aria-hidden="true" />
            <Link href={`/${locale}/categorias/${error.category.slug}`} className={styles.crumbLink}>
              {error.category.name}
            </Link>
            <ChevronRight size={13} className={styles.crumbSep} aria-hidden="true" />
            <span className={styles.crumbCurrent} aria-current="page">{error.errorCode}</span>
          </nav>

          <div className={styles.layout}>
            {/* ── Main column ─────────────────────────── */}
            <article className={styles.main}>

              {/* Hero card */}
              <div className={styles.heroCard}>
                <div className={styles.heroTop}>
                  <span className={styles.codeChip}>{error.errorCode}</span>
                  {error.model && (
                    <span className={styles.modelChip}>
                      <Cpu size={11} aria-hidden="true" />
                      {error.model}
                    </span>
                  )}
                  {error.hasVideo && (
                    <span className={styles.videoBadge}>
                      <PlayCircle size={12} aria-hidden="true" />
                      {isEs ? 'Con video' : 'Has video'}
                    </span>
                  )}
                </div>

                <h1 className={styles.title}>{error.seo.title}</h1>
                <p className={styles.summary}>{error.content.summary}</p>

                <div className={styles.engagement}>
                  <span className={styles.engageStat}>
                    <Eye size={14} aria-hidden="true" />
                    {error.engagement.views.toLocaleString()} {labels.views}
                  </span>
                  <span className={styles.engageStat}>
                    <ThumbsUp size={14} aria-hidden="true" />
                    {error.engagement.helpfulVotes.toLocaleString()} {labels.helpful}
                  </span>
                </div>
              </div>

              {/* Causes */}
              {error.content.causes.length > 0 && (
                <section className={styles.section} aria-labelledby="causes-heading">
                  <h2 id="causes-heading" className={styles.sectionTitle}>
                    <AlertTriangle size={18} aria-hidden="true" className={styles.iconWarm} />
                    {labels.causes}
                  </h2>
                  <ul className={styles.causesList}>
                    {error.content.causes.map((cause, i) => (
                      <li key={i} className={styles.causeItem}>
                        <span className={styles.causeNum}>{i + 1}</span>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Solutions (markdown) */}
              {error.content.markdownSolutions && (
                <section className={styles.section} aria-labelledby="solutions-heading">
                  <h2 id="solutions-heading" className={styles.sectionTitle}>
                    <Lightbulb size={18} aria-hidden="true" className={styles.iconPrimary} />
                    {labels.solutions}
                  </h2>
                  <div
                    className={styles.prose}
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(error.content.markdownSolutions) }}
                  />
                </section>
              )}

              {/* Step-by-step */}
              {error.content.stepsHowTo.length > 0 && (
                <section className={styles.section} aria-labelledby="steps-heading">
                  <h2 id="steps-heading" className={styles.sectionTitle}>
                    <ListChecks size={18} aria-hidden="true" className={styles.iconPrimary} />
                    {labels.steps}
                  </h2>
                  <ol className={styles.stepsList}>
                    {error.content.stepsHowTo.map((step) => (
                      <li key={step.step} className={styles.stepItem}>
                        <span className={styles.stepNum}>{step.step}</span>
                        <div className={styles.stepBody}>
                          <h3 className={styles.stepTitle}>{step.title}</h3>
                          <p className={styles.stepDesc}>{step.description}</p>
                          {step.imageUrl && (
                            <Image
                              src={step.imageUrl}
                              alt={step.title}
                              width={600}
                              height={340}
                              className={styles.stepImg}
                              unoptimized
                            />
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* Videos */}
              {preferredVideos.length > 0 && (
                <section className={styles.section} aria-labelledby="videos-heading">
                  <h2 id="videos-heading" className={styles.sectionTitle}>
                    <PlayCircle size={18} aria-hidden="true" className={styles.iconPrimary} />
                    {labels.videos}
                  </h2>
                  <ErrorVideoSelector videos={preferredVideos} />
                </section>
              )}

              {/* FAQs */}
              {error.content.faqs.length > 0 && (
                <section className={styles.section} aria-labelledby="faqs-heading">
                  <h2 id="faqs-heading" className={styles.sectionTitle}>
                    <HelpCircle size={18} aria-hidden="true" className={styles.iconPrimary} />
                    {labels.faqs}
                  </h2>
                  <dl className={styles.faqList}>
                    {error.content.faqs.map((faq, i) => (
                      <div key={i} className={styles.faqItem}>
                        <dt className={styles.faqQ}>{faq.question}</dt>
                        <dd className={styles.faqA}>{faq.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </article>

            {/* ── Sidebar ──────────────────────────────── */}
            <aside className={styles.sidebar}>

              {/* Meta card */}
              <div className={styles.metaCard}>
                <dl className={styles.metaList}>
                  <div className={styles.metaRow}>
                    <dt className={styles.metaLabel}>{labels.brand}</dt>
                    <dd className={styles.metaValue}>
                      <Link href={`/${locale}/marcas/${error.brand.slug}`} className={styles.metaLink}>
                        {error.brand.logoUrl && (
                          <Image src={error.brand.logoUrl} alt={error.brand.name} width={16} height={16} unoptimized />
                        )}
                        {error.brand.name}
                      </Link>
                    </dd>
                  </div>
                  <div className={styles.metaRow}>
                    <dt className={styles.metaLabel}>{labels.category}</dt>
                    <dd className={styles.metaValue}>
                      <Link href={`/${locale}/categorias/${error.category.slug}`} className={styles.metaLink}>
                        {error.category.name}
                      </Link>
                    </dd>
                  </div>
                  {error.model && (
                    <div className={styles.metaRow}>
                      <dt className={styles.metaLabel}>{labels.model}</dt>
                      <dd className={styles.metaValue}>{error.model}</dd>
                    </div>
                  )}
                  <div className={styles.metaRow}>
                    <dt className={styles.metaLabel}>
                      <Tag size={12} aria-hidden="true" />
                      {isEs ? 'Código' : 'Code'}
                    </dt>
                    <dd className={styles.metaValue}>
                      <span className={styles.codeChipSm}>{error.errorCode}</span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Related errors */}
              {error.relatedErrors.length > 0 && (
                <div className={styles.relatedCard}>
                  <h2 className={styles.relatedTitle}>{labels.related}</h2>
                  <ul className={styles.relatedList}>
                    {error.relatedErrors.map((rel) => (
                      <li key={rel.slug}>
                        <Link href={`/${locale}/error/${rel.slug}`} className={styles.relatedItem}>
                          <span className={styles.relatedCode}>{rel.errorCode}</span>
                          <span className={styles.relatedMeta}>
                            <span className={styles.relatedItemTitle}>{rel.title}</span>
                            <span className={styles.relatedSub}>{rel.brandName} · {rel.categoryName}</span>
                          </span>
                          <ChevronRight size={14} className={styles.relatedArrow} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

// ── Minimal markdown → HTML (bold, italic, headings, lists, paragraphs) ──────
function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm,   '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,    '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,     '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/^- (.+)$/gm,     '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n{2,}/g,        '</p><p>')
    .replace(/^(?!<[hul])/gm,  '')
    .trim()
    .replace(/^(.+)/, '<p>$1')
    .replace(/(.+)$/, '$1</p>');
}
