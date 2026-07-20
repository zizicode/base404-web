import { NextResponse } from 'next/server';

function getManifestContent() {
  return {
    name: 'Vimazdev — Códigos de error de impresoras',
    short_name: 'Vimazdev',
    description: 'Encuentra soluciones paso a paso para los códigos de error de impresoras y escáneres.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}

export async function GET() {
  return NextResponse.json(getManifestContent(), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
