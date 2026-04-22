import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseServer';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '8', 10);
    const { data, error } = await supabaseAdmin
      .from('movies')
      .select('id, title, slug, thumbnail_url, imdb_rating')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
