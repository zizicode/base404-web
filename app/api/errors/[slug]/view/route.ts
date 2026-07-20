import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') ?? 'es';

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.vimazdev.com/v1').replace(/\/$/, '');
  const upstreamUrl = new URL(`${baseUrl}/errors/${encodeURIComponent(slug)}/view`);
  upstreamUrl.searchParams.set('locale', locale);

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const contentType = upstreamResponse.headers.get('content-type') ?? '';
    const payload = contentType.includes('application/json')
      ? await upstreamResponse.json().catch(() => null)
      : null;

    const views = extractNumber(payload, 'views');
    const normalized = { success: upstreamResponse.ok, views };

    return NextResponse.json(normalized, {
      status: upstreamResponse.status,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json(
      { success: false, views: null },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

function extractNumber(payload: unknown, key: string): number | null {
  if (!payload || typeof payload !== 'object') return null;
  if (key in payload && typeof (payload as Record<string, unknown>)[key] === 'number') {
    return (payload as Record<string, unknown>)[key] as number;
  }
  if ('data' in payload && typeof (payload as Record<string, unknown>).data === 'object') {
    const data = (payload as Record<string, unknown>).data as Record<string, unknown>;
    if (typeof data[key] === 'number') return data[key] as number;
  }
  return null;
}
