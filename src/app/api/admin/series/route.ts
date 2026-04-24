import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import supabaseAdmin from "@/lib/supabaseServer";
import supabase from "@/lib/supabaseClient";

export async function GET() {
  try {
    // Verify admin
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin in Supabase
    const { data: admin, error: adminError } = await supabaseAdmin
      .from("admins")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (adminError || !admin) {
      return NextResponse.json({ error: "Admin access denied" }, { status: 403 });
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
    // Verify admin
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: admin, error: adminError } = await supabaseAdmin
      .from("admins")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (adminError || !admin) {
      return NextResponse.json({ error: "Admin access denied" }, { status: 403 });
    }

    // Parse request
    const body = await req.json();
    const { title, description, cover_image_url, thumbnail_url, total_seasons, tmdb_rating, language, tags, is_18_plus } = body;

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
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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
