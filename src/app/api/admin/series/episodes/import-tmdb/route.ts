import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import supabaseAdmin from "@/lib/supabaseServer";

type TmdbEpisode = {
  episode_number: number;
  name: string;
  overview?: string;
  vote_average?: number;
  still_path?: string | null;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { series_id } = body as { series_id?: string };

    if (!series_id) {
      return NextResponse.json({ error: "series_id is required" }, { status: 400 });
    }

    const { data: series, error: seriesError } = await supabaseAdmin
      .from("series")
      .select("id, tmdb_series_id, total_seasons, thumbnail_url")
      .eq("id", series_id)
      .single();

    if (seriesError || !series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    if (!series.tmdb_series_id) {
      return NextResponse.json(
        { error: "This series does not have tmdb_series_id" },
        { status: 400 }
      );
    }

    const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "TMDB token not configured" }, { status: 500 });
    }

    const { data: existingEpisodes, error: existingError } = await supabaseAdmin
      .from("episodes")
      .select("season_number, episode_number")
      .eq("series_id", series_id);

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    const existingSet = new Set(
      (existingEpisodes || []).map(
        (ep: { season_number: number; episode_number: number }) =>
          `${ep.season_number}:${ep.episode_number}`
      )
    );

    const episodesToInsert: Array<Record<string, unknown>> = [];

    for (let season = 1; season <= (series.total_seasons || 1); season += 1) {
      const tmdbRes = await fetch(
        `https://api.themoviedb.org/3/tv/${series.tmdb_series_id}/season/${season}?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!tmdbRes.ok) {
        continue;
      }

      const seasonData = (await tmdbRes.json()) as { episodes?: TmdbEpisode[] };
      const seasonEpisodes = seasonData.episodes || [];

      for (const ep of seasonEpisodes) {
        const key = `${season}:${ep.episode_number}`;
        if (existingSet.has(key)) continue;

        episodesToInsert.push({
          series_id,
          season_number: season,
          episode_number: ep.episode_number,
          title: ep.name || `Episode ${ep.episode_number}`,
          description: ep.overview || "",
          video_url: "",
          thumbnail_url: ep.still_path
            ? `https://image.tmdb.org/t/p/w780${ep.still_path}`
            : series.thumbnail_url || "",
          tmdb_rating: ep.vote_average ?? null,
          is_18_plus: false,
        });
      }
    }

    if (episodesToInsert.length === 0) {
      return NextResponse.json({ ok: true, inserted: 0 });
    }

    const { error: insertError } = await supabaseAdmin
      .from("episodes")
      .insert(episodesToInsert);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, inserted: episodesToInsert.length });
  } catch (err: any) {
    console.error("Error importing episodes from TMDB:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
