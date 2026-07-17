import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/global.scss";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Vimovies — Códigos de error de electrodomésticos",
    template: "%s | Vimovies",
  },
  description:
    "Encuentra soluciones paso a paso para los códigos de error de lavadoras, lavavajillas, hornos y más.",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: { lang?: string };
}) {
  const lang = params?.lang ?? 'es';
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={roboto.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}
