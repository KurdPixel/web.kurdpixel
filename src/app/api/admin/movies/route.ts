import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import supabaseAdmin from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const {
    title,
    video_url,
    thumbnail_url,
    backdrop_url,
    description,
    tmdb_rating,
    language,
    duration_minutes,
    tags,
    translators,
    is_18_plus,
    slug,
    tmdb_movie_id,
  } = body;

  // Validate required fields
  if (!title || !thumbnail_url || !description) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabaseAdmin.from("movies").insert([
      {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        video_url: video_url?.trim() || "",
        thumbnail_url,
        backdrop_url: backdrop_url || null,
        description,
        tmdb_rating: tmdb_rating || null,
        language: language || null,
        duration_minutes: duration_minutes || null,
        tags: tags || [],
        translators: translators || [],
        is_18_plus: is_18_plus || false,
        tmdb_movie_id: tmdb_movie_id || null,
      },
    ]).select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      movie: data?.[0],
    });
  } catch (e: any) {
    console.error("Error adding movie:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
