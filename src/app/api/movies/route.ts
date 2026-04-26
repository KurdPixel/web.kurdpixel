import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data: movies, error } = await supabase
      .from("movies")
      // Support both legacy `imdb_rating` and newer `tmdb_rating`
      .select("id, title, slug, thumbnail_url, description, tags, tmdb_rating, imdb_rating")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const moviesWithTMDB = (movies || []).map((movie: any) => {
      const rating = movie.tmdb_rating ?? movie.imdb_rating ?? null;
      return {
        ...movie,
        tmdb_rating: rating,
        imdb_rating: undefined,
      };
    });

    return NextResponse.json(moviesWithTMDB);
  } catch (err) {
    console.error("Error fetching movies:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
