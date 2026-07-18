import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const locale = searchParams.get('locale') ?? 'es';
  const limit = searchParams.get('limit') ?? '8';

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.vimazdev.com/v1').replace(/\/$/, '');
  const upstreamUrl = new URL(`${baseUrl}/search`);

  if (q.length >= 2) upstreamUrl.searchParams.set('q', q);
  upstreamUrl.searchParams.set('locale', locale);
  upstreamUrl.searchParams.set('limit', limit);

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: { Accept: 'application/json' },
    });

    const contentType = upstreamResponse.headers.get('content-type') ?? '';
    const payload = contentType.includes('application/json')
      ? await upstreamResponse.json().catch(() => null)
      : await upstreamResponse.text().catch(() => null);

    return NextResponse.json(payload ?? { success: false, data: { errors: [], brands: [], categories: [] } }, {
      status: upstreamResponse.status,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, data: { errors: [], brands: [], categories: [] } },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
