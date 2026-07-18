import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/global.scss";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });

function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "https://vimazdev.com";
  return raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
}

export const metadata: Metadata = {
  title: {
    default: "VimazDev — Códigos de error de electrodomésticos",
    template: "%s | VimazDev",
  },
  description:
    "Encuentra soluciones paso a paso para los códigos de error de lavadoras, lavavajillas, hornos y más.",
  metadataBase: new URL(getSiteUrl()),
  alternates: {
    canonical: "/",
    languages: {
      es: "/es",
      en: "/en",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={roboto.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}
