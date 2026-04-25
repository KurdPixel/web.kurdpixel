import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import supabaseAdmin from "@/lib/supabaseServer";
import supabase from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all series
    const { data: series, error } = await supabaseAdmin
      .from("series")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(series || []);
  } catch (err) {
    console.error("Error fetching admin series:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request
    const body = await req.json();
    const { title, description, cover_image_url, thumbnail_url, total_seasons, tmdb_rating, language, tags, is_18_plus, episodes, tmdb_series_id } = body;

    if (!title || !cover_image_url) {
      return NextResponse.json(
        { error: "Title and cover_image_url are required" },
        { status: 400 }
      );
    }

    // Create slug
    const slug = title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

    // Insert series
    const { data: series, error } = await supabaseAdmin
      .from("series")
      .insert({
        title,
        slug,
        description,
        cover_image_url,
        thumbnail_url,
        total_seasons: total_seasons || 1,
        tmdb_rating,
        language,
        tags: tags || [],
        is_18_plus: is_18_plus || false,
        tmdb_series_id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Insert episodes if provided
    if (episodes && episodes.length > 0) {
      const episodesToInsert = episodes.map((ep: any) => ({
        series_id: series.id,
        season_number: ep.season_number,
        episode_number: ep.episode_number,
        title: ep.title,
        description: ep.description || "",
        video_url: ep.video_url,
        thumbnail_url: ep.thumbnail_url,
        tmdb_rating: 0,
        is_18_plus: false,
      }));

      const { error: episodesError } = await supabaseAdmin
        .from("episodes")
        .insert(episodesToInsert);

      if (episodesError) {
        console.error("Error inserting episodes:", episodesError);
        // Don't fail if episodes fail to insert - series was already created
      }
    }

    return NextResponse.json({ ok: true, series });
  } catch (err: any) {
    console.error("Error creating series:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
