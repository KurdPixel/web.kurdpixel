import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data: movies, error } = await supabase
      .from("movies")
      .select("id, title, slug, thumbnail_url, description, tags, imdb_rating")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Rename imdb_rating to tmdb_rating for consistency
    const moviesWithTMDB = (movies || []).map((movie: any) => ({
      ...movie,
      tmdb_rating: movie.imdb_rating,
      imdb_rating: undefined,
    }));

    return NextResponse.json(moviesWithTMDB);
  } catch (err) {
    console.error("Error fetching movies:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
