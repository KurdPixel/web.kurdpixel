import { NextRequest, NextResponse } from "next/server";

const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Search query is required" },
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
    console.log(`Searching TMDB for: ${query}`);
    
    const response = await fetch(
      `${TMDB_API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=1`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    console.log(`TMDB response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMDB API error: ${response.statusText}`, errorText);
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the results to include poster URLs
    const results = (data.results || []).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      rating: movie.vote_average,
      poster_path: movie.poster_path,
      overview: movie.overview,
      vote_count: movie.vote_count,
    }));

    return NextResponse.json({
      results,
      total_results: data.total_results,
      total_pages: data.total_pages,
    });
  } catch (error: any) {
    console.error("TMDB search error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search movies" },
      { status: 500 }
    );
  }
}
