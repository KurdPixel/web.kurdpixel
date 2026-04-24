import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import supabaseAdmin from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: admin } = await supabaseAdmin
      .from("admins")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (!admin) {
      return NextResponse.json({ error: "Admin access denied" }, { status: 403 });
    }

    const body = await req.json();
    const { series_id, season_number, episode_number, title, description, video_url, thumbnail_url, tmdb_rating, is_18_plus } = body;

    if (!series_id || !season_number || !episode_number || !title || !video_url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: episode, error } = await supabaseAdmin
      .from("episodes")
      .insert({
        series_id,
        season_number,
        episode_number,
        title,
        description,
        video_url,
        thumbnail_url,
        tmdb_rating,
        is_18_plus: is_18_plus || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, episode });
  } catch (err: any) {
    console.error("Error creating episode:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
