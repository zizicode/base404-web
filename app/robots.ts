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

User-agent: *
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