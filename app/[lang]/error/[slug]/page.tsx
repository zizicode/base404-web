import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, Tag, Cpu,
  AlertTriangle, Lightbulb, ListChecks, PlayCircle,
} from 'lucide-react';
import { getErrorBySlug } from '@/lib/api/errors';
import { getPreferredVideos } from '@/lib/api/videos';
import { isValidLocale, type Locale } from '@/lib/i18n';
import { buildCanonicalUrl } from '@/lib/seo';
import { getDictionary } from '@/dictionaries/dictionaries';
import ErrorVideoSelector from '@/components/error-video-selector/ErrorVideoSelector';
import ErrorEngagement from '@/components/error-engagement/ErrorEngagement';
import ErrorFaqs from '@/components/error-faqs/ErrorFaqs';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) return {};
  const locale = lang as Locale;
  const error = await getErrorBySlug(slug, locale);
  if (!error) return {};
  const canonicalUrl = error.seo.canonicalUrl?.trim() || buildCanonicalUrl(locale, `/error/${slug}`);
  return {
    title: error.seo.title,
    description: error.seo.metaDescription,
    robots: error.seo.robots,
    alternates: {
      canonical: canonicalUrl,
      languages: (() => {
        const map = Object.fromEntries(
          error.hreflangAlternates.map(({ locale, url }) => [locale, url])
        ) as Record<string, string>;
        if (!map[locale]) {
          map[locale] = canonicalUrl;
        }
        if (!map["x-default"]) {
          map["x-default"] = map["es"] ?? canonicalUrl;
        }
        return map;
      })(),
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
  if (!isValidLocale(lang)) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.heroCard}>No se pudo cargar esta página.</div>
        </div>
      </main>
    );
  }
  const locale = lang as Locale;

  const [error, dict] = await Promise.all([
    getErrorBySlug(slug, locale).catch(() => null),
    getDictionary(locale),
  ]);

  const isEs = locale === 'es';

  if (!error) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.heroCard}>
            <h1 className={styles.title}>{isEs ? 'No pudimos cargar este contenido' : 'We could not load this content'}</h1>
            <p className={styles.summary}>
              {isEs
                ? 'El detalle de este error no está disponible en este momento. Intenta nuevamente más tarde.'
                : 'The details for this error are not available right now. Please try again later.'}
            </p>
          </div>
        </div>
      </main>
    );
  }
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

                <ErrorEngagement
                  errorId={error.id}
                  slug={error.slug}
                  locale={locale}
                  initialViews={error.engagement.views}
                  initialVotes={error.engagement.helpfulVotes}
                  viewLabel={labels.views}
                  helpfulLabel={labels.helpful}
                  voteLabel={isEs ? '¿Te fue útil?' : 'Was this helpful?'}
                  votedLabel={isEs ? 'Votado' : 'Voted'}
                />
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
                <ErrorFaqs title={labels.faqs} faqs={error.content.faqs} />
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

// ── Markdown → HTML for content IA solutions ─────────────────────────────────
function markdownToHtml(md: string): string {
  if (!md || typeof md !== 'string') return '';

  // Escape HTML special characters inside code blocks first.
  const codeBlocks: string[] = [];
  const inlineCodes: string[] = [];

  const extractBlock = (code: string): string => {
    const i = codeBlocks.length;
    codeBlocks.push(escapeHtml(code.trim()));
    return `\n<!--CODEBLOCK:${i}-->\n`;
  };

  const extractInline = (code: string): string => {
    const i = inlineCodes.length;
    inlineCodes.push(escapeHtml(code));
    return `<!--CODEINLINE:${i}-->`;
  };

  let html = md
    // Fenced code blocks
    .replace(/^```([\w]*)\n([\s\S]*?)```$/gm, (_, lang, code) => extractBlock(code))
    // Inline code
    .replace(/`([^`]+)`/g, (_, code) => extractInline(code))
    // Headings
    .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
    .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold / italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Images ![alt](url)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Horizontal rule
    .replace(/^(-{3,}|\*{3,}|_{3,})$/gim, '<hr />');

  // Lists (unordered and ordered)
  html = parseLists(html);

  // Restore code blocks
  html = html
    .replace(/<!--CODEBLOCK:(\d+)-->/g, (_, i) =>
      `<pre><code>${codeBlocks[Number(i)]}</code></pre>`
    )
    .replace(/<!--CODEINLINE:(\d+)-->/g, (_, i) =>
      `<code>${inlineCodes[Number(i)]}</code>`
    );

  // Paragraphs: split by blank lines, wrap non-block lines.
  const blocks = html.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const wrapped = blocks.map((block) => {
    if (/^<(h[1-6]|ul|ol|pre|blockquote|hr)/i.test(block)) return block;
    if (/^<\/p>/.test(block)) return block;
    return `<p>${block.replace(/\n/g, '<br />')}</p>`;
  });

  return wrapped.join('\n');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseLists(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let stack: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flush = () => {
    if (!stack) return;
    const tag = stack.type === 'ul' ? 'ul' : 'ol';
    out.push(`<${tag}>${stack.items.map((item) => `<li>${item.trim()}</li>`).join('')}</${tag}>`);
    stack = null;
  };

  for (const raw of lines) {
    const ul = raw.match(/^(?:[-*+]) (.+)$/);
    const ol = raw.match(/^\d+\. (.+)$/);

    if (ul) {
      if (!stack || stack.type !== 'ul') {
        flush();
        stack = { type: 'ul', items: [ul[1]] };
      } else {
        stack.items.push(ul[1]);
      }
      continue;
    }

    if (ol) {
      if (!stack || stack.type !== 'ol') {
        flush();
        stack = { type: 'ol', items: [ol[1]] };
      } else {
        stack.items.push(ol[1]);
      }
      continue;
    }

    if (stack && /^\s/.test(raw) && raw.trim()) {
      stack.items[stack.items.length - 1] += '<br />' + raw.trim();
      continue;
    }

    flush();
    out.push(raw);
  }

  flush();
  return out.join('\n');
}
