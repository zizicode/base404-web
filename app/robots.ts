import { NextResponse } from "next/server";

function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "https://vimazdev.com";
  return raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
}

const baseUrl = getSiteUrl();

export async function GET() {
  const body = `# =====================================================================
# ROBOTS.TXT - Platform Knowledge Base (Vimaz/Zolurix)
# =====================================================================

# (a)  If a Content-Signal = yes, you may collect content for the corresponding
#      use.
# (b)  If a Content-Signal = no, you may not collect content for the
#      corresponding use.
# (c)  If the website operator does not include a Content-Signal for a
#      corresponding use, the website operator neither grants nor restricts
#      permission via Content-Signal with respect to the corresponding use.

# The content signals and their meanings are:

# search:   building a search index and providing search results (e.g., returning
#           hyperlinks and short excerpts from your website's contents). Search does not
#           include providing AI-generated search summaries.
# ai-input: inputting content into one or more AI models (e.g., retrieval
#           augmented generation, grounding, or other real-time taking of content for
#           generative AI search answers).
# ai-train: training or fine-tuning AI models.
# use:      how AI systems may consume the content (immediate, reference, or full).

# ANY RESTRICTIONS EXPRESSED VIA CONTENT SIGNALS ARE EXPRESS RESERVATIONS OF
# RIGHTS UNDER ARTICLE 4 OF THE EUROPEAN UNION DIRECTIVE 2019/790 ON COPYRIGHT
# AND RELATED RIGHTS IN THE DIGITAL SINGLE MARKET.

# BEGIN Cloudflare Managed content

User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CloudflareBrowserRenderingCrawler
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: meta-externalagent
Disallow: /

# END Cloudflare Managed Content

User-Agent: *
Allow: /
Allow: /es/
Allow: /en/
Allow: /_next/static/
Allow: /images/
Allow: /og.png

# ---------------------------------------------------------------------
# Deshabilitar zonas administrativas, API endpoints e ingesta
# ---------------------------------------------------------------------
Disallow: /v1/admin/
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /private/
Disallow: /*?*search=*
Disallow: /*?*preview=*

# ---------------------------------------------------------------------
# Reglas para rastreadores de IA (Opcional)
# Descomenta las siguientes líneas si prefieres evitar que recopilen 
# tu contenido para entrenar sus modelos.
# ---------------------------------------------------------------------
# User-agent: GPTBot
# Disallow: /
# User-agent: CCBot
# Disallow: /

# ---------------------------------------------------------------------
# Indexación de Mapas del Sitio (Sitemaps)
# ---------------------------------------------------------------------
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-es.xml
Sitemap: ${baseUrl}/sitemap-en.xml
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
    },
  });
}