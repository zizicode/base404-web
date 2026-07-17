import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getErrorBySlug } from "@/lib/api/errors";
import { getPreferredVideos } from "@/lib/api/videos";
import ErrorVideoSelector from "@/components/error-video-selector/ErrorVideoSelector";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getErrorBySlug(slug, "es");
  if (!data) return {};

  return {
    title: data.seo.title,
    description: data.seo.metaDescription,
    alternates: {
      canonical: data.seo.canonicalUrl,
      languages: Object.fromEntries(
        data.hreflangAlternates.map((alt) => [alt.locale, alt.url])
      ),
    },
    robots: data.isIndexable ? "index,follow" : "noindex,follow",
    openGraph: {
      title: data.seo.og.title,
      description: data.seo.og.description,
      images: [data.seo.og.image],
    },
  };
}

export default async function ErrorDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getErrorBySlug(slug, "es");

  if (!data) {
    return notFound();
  }

  const preferredVideos = getPreferredVideos(data.content.videos, "es");

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data.seo.schemaJsonLd),
        }}
      />

      <article className="mx-auto max-w-6xl px-4 py-10">
        {/* Hero */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span>{data.category.name}</span>
            <span>/</span>
            <span>{data.brand.name}</span>
          </div>

          <span className="inline-block rounded bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 mb-3">
            {data.errorCode}
          </span>
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            {data.seo.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            {data.content.summary}
          </p>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
            <span>{data.engagement.views.toLocaleString("es")} vistas</span>
            <span>·</span>
            <span>
              Actualizado:{" "}
              {new Date(data.updatedAt).toLocaleDateString("es", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          {/* Main content */}
          <div className="space-y-10">
            {/* Causes */}
            {data.content.causes.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Posibles causas</h2>
                <ul className="space-y-2">
                  {data.content.causes.map((cause, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-3 text-sm"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                        {i + 1}
                      </span>
                      {cause}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Steps */}
            {data.content.stepsHowTo.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">
                  Pasos para solucionarlo
                </h2>
                <ol className="space-y-4">
                  {data.content.stepsHowTo.map((step) => (
                    <li
                      key={step.step}
                      className="rounded-lg border border-gray-100 bg-white p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                          {step.step}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {step.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      {step.imageUrl && (
                        <img
                          src={step.imageUrl}
                          alt={step.title}
                          className="mt-3 rounded-lg w-full max-w-md"
                        />
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Video */}
            {preferredVideos.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Video explicativo</h2>
                <ErrorVideoSelector videos={preferredVideos} />
              </section>
            )}

            {/* FAQs */}
            {data.content.faqs.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">
                  Preguntas frecuentes
                </h2>
                <div className="space-y-3">
                  {data.content.faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group rounded-lg border border-gray-200 bg-white"
                    >
                      <summary className="cursor-pointer select-none px-4 py-3 font-medium text-gray-800 hover:text-blue-700 transition-colors">
                        {faq.question}
                      </summary>
                      <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Brand / Model info */}
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                Información
              </h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-400">Marca</dt>
                  <dd className="font-medium">{data.brand.name}</dd>
                </div>
                <div>
                  <dt className="text-gray-400">Categoría</dt>
                  <dd className="font-medium">{data.category.name}</dd>
                </div>
                {data.model && (
                  <div>
                    <dt className="text-gray-400">Modelo</dt>
                    <dd className="font-medium">{data.model}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-400">Código</dt>
                  <dd className="font-semibold text-blue-700">
                    {data.errorCode}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Related errors */}
            {data.relatedErrors.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Errores relacionados
                </h3>
                <ul className="space-y-2">
                  {data.relatedErrors.map((related) => (
                    <li key={related.slug}>
                      <Link
                        href={`/error/${related.slug}`}
                        className="block rounded-md p-2 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-blue-700">
                          {related.errorCode}
                        </span>
                        <span className="ml-2 text-gray-700">
                          {related.title}
                        </span>
                        <span className="block text-xs text-gray-400 mt-0.5">
                          {related.brandName} · {related.categoryName}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </article>
    </>
  );
}
