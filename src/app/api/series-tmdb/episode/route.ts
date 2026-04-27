import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const seriesId = request.nextUrl.searchParams.get("id");
    const season = request.nextUrl.searchParams.get("season");
    const episode = request.nextUrl.searchParams.get("episode");

    if (!seriesId || !season || !episode) {
      return NextResponse.json(
        { error: "Series ID, season and episode are required" },
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

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesId}/season/${season}/episode/${episode}?language=en-US`,
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

    const data = await response.json();

    return NextResponse.json({
      title: data.name || "",
      description: data.overview || "",
      tmdb_rating: data.vote_average ?? null,
      thumbnail_url: data.still_path
        ? `https://image.tmdb.org/t/p/w780${data.still_path}`
        : "",
      season_number: data.season_number,
      episode_number: data.episode_number,
    });
  } catch (err: any) {
    if (err.name === "AbortError") {
      return NextResponse.json({ error: "Request timeout" }, { status: 408 });
    }
    console.error("Error fetching TMDB episode details:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
