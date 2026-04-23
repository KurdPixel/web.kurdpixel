import { NextRequest, NextResponse } from "next/server";

const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(request: NextRequest) {
  const movieId = request.nextUrl.searchParams.get("id");

  if (!movieId) {
    return NextResponse.json(
      { error: "Movie ID is required" },
      { status: 400 }
    );
  }

  if (!TMDB_ACCESS_TOKEN) {
    console.error("TMDB token missing");
    return NextResponse.json(
      { error: "TMDB API token not configured" },
      { status: 500 }
    );
  }

  try {
    console.log(`Fetching TMDB movie details for ID: ${movieId}`);
    
    const response = await fetch(
      `${TMDB_API_BASE_URL}/movie/${movieId}`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    console.log(`TMDB movie response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMDB API error: ${response.statusText}`, errorText);
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract and format the movie data
    const movieData = {
      title: data.title,
      rating: data.vote_average,
      duration_minutes: data.runtime,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      overview: data.overview,
      release_date: data.release_date,
      genres: (data.genres || []).map((g: any) => g.name),
      vote_count: data.vote_count,
      imdb_id: data.imdb_id,
      original_language: data.original_language,
    };

    return NextResponse.json(movieData);
  } catch (error: any) {
    console.error("TMDB movie details error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch movie details" },
      { status: 500 }
    );
  }
}
