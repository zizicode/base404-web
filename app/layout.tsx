import type { Metadata } from "next";
import { headers } from "next/headers";
import { Roboto } from "next/font/google";
import "@/styles/global.scss";
import { DEFAULT_LOCALE, isValidLocale } from "@/lib/i18n";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });

function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "https://vimazdev.com";
  return raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
}

const siteUrl = getSiteUrl();
const siteName = "Vimazdev";
const defaultTitle = "Vimazdev — Soluciona Códigos de Error de Impresoras";
const defaultDescription =
  "Descubrí qué significa cada código de error de tu impresora, por qué ocurre y cómo solucionarlo paso a paso: HP, Epson, Brother, Canon, Fujitsu y más.";
const ogImage = "/og.png"; // reemplazá por tu imagen real de 1200x630

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: "%s | Vimazdev",
  },
  description: defaultDescription,
  keywords: [
    // Español
    "códigos de error impresora",
    "cómo solucionar error de impresora",
    "qué significa el error de mi impresora",
    "error impresora HP",
    "error impresora Epson",
    "error impresora Brother",
    "error impresora Canon",
    "error impresora matricial",
    "atasco de papel solución",
    "impresora no imprime error",
    "diagnóstico de fallas impresora",
    "reparar impresora",
    "tóner y cartucho compatible",
    "guía de reparación paso a paso",

    // English
    "printer error codes",
    "how to fix printer error",
    "what does my printer error mean",
    "HP printer error",
    "Epson printer error",
    "Brother printer error",
    "Canon printer error",
    "dot matrix printer error",
    "paper jam fix",
    "printer not printing error",
    "printer troubleshooting",
    "how to repair printer",
    "compatible toner and cartridge",
    "step by step repair guide",
  ],
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      es: "/es",
      en: "/en",
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    locale: "es_ES",
    alternateLocale: ["en_US"],
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${siteName} — Códigos de error de impresoras`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    other: {
      "msvalidate.01": "E9614E98D4145A5C957485977131C6B4",
    },
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RFE65C9EFH" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RFE65C9EFH');
            `,
          }}
        />
      </head>
      <body className={roboto.className} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T5FPRGC5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-T5FPRGC5');`,
          }}
        />
        {children}
      </body>
    </html>
  );
}