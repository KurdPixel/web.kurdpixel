import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const seriesId = request.nextUrl.searchParams.get("id");
    if (!seriesId) {
      return NextResponse.json(
        { error: "Series ID required" },
        { status: 400 }
      );
    }

    const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
    if (!TMDB_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "TMDB token not configured" },
        { status: 500 }
      );
    }

    console.log("Fetching TMDB series details for ID:", seriesId);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesId}?language=en-US`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.status_message || "TMDB API error" },
        { status: response.status }
      );
    }

    const series = await response.json();

    console.log("TMDB series response status:", response.status);

    return NextResponse.json({
      title: series.name || series.original_name,
      rating: series.vote_average,
      total_seasons: series.number_of_seasons || 1,
      poster_path: series.poster_path,
      backdrop_path: series.backdrop_path,
      overview: series.overview,
      first_air_date: series.first_air_date,
      genres: series.genres ? series.genres.map((g: any) => g.name) : [],
      vote_count: series.vote_count,
      original_language: series.original_language,
      tmdb_series_id: series.id,
    });
  } catch (err: any) {
    if (err.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timeout" },
        { status: 408 }
      );
    }
    console.error("Error fetching TMDB series details:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
