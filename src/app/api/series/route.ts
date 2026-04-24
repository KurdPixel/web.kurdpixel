import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data: series, error } = await supabase
      .from("series")
      .select("id, title, slug, cover_image_url, thumbnail_url, total_seasons, tmdb_rating, language, tags, is_18_plus")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Map imdb_rating equivalent to tmdb_rating for consistency
    const seriesWithTMDB = (series || []).map((s: any) => ({
      ...s,
      tmdb_rating: s.tmdb_rating,
    }));

    return NextResponse.json(seriesWithTMDB || []);
  } catch (err) {
    console.error("Error fetching series:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
