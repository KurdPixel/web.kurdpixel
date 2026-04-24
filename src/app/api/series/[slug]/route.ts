import { NextResponse, NextRequest } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get series
    const { data: series, error: seriesError } = await supabase
      .from("series")
      .select("*")
      .eq("slug", slug)
      .single();

    if (seriesError || !series) {
      return NextResponse.json(
        { error: "Series not found" },
        { status: 404 }
      );
    }

    // Get episodes grouped by season
    const { data: episodes, error: episodesError } = await supabase
      .from("episodes")
      .select("*")
      .eq("series_id", series.id)
      .order("season_number", { ascending: true })
      .order("episode_number", { ascending: true });

    if (episodesError) {
      console.error("Error fetching episodes:", episodesError);
    }

    // Group episodes by season
    const episodesBySeason =
      episodes?.reduce((acc: any, ep: any) => {
        const season = ep.season_number;
        if (!acc[season]) acc[season] = [];
        acc[season].push(ep);
        return acc;
      }, {}) || {};

    return NextResponse.json({
      ...series,
      episodes: episodesBySeason,
    });
  } catch (err) {
    console.error("Error fetching series detail:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}