import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import supabaseAdmin from "@/lib/supabaseServer";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });

  const { id: identifier } = (await context.params) as { id?: string };
  if (!identifier || identifier === "undefined") return NextResponse.json({ ok: false, error: "Missing identifier" }, { status: 400 });

  // detect UUID v4-ish (simple) to decide whether to query by id or slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
  try {
    const query = isUuid ? supabaseAdmin.from("movies").select("*").eq("id", identifier).single()
                         : supabaseAdmin.from("movies").select("*").eq("slug", identifier).single();
    const { data: movie, error } = await query;
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, movie });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });

  const { id: identifier } = (await context.params) as { id?: string };
  if (!identifier || identifier === "undefined") return NextResponse.json({ ok: false, error: "Missing identifier" }, { status: 400 });
  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const {
    title,
    video_url,
    thumbnail_url,
    description,
    imdb_rating,
    language,
    duration_minutes,
    tags,
    translators,
  } = body;

  try {
    // update by id when identifier is UUID, otherwise update by slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier as string);
    const updater = supabaseAdmin.from("movies").update({ title, video_url, thumbnail_url, description, imdb_rating, language, duration_minutes, tags, translators });
    const { error } = isUuid ? await updater.eq("id", identifier) : await updater.eq("slug", identifier);

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
