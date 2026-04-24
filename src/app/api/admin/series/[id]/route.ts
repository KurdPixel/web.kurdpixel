import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import supabaseAdmin from "@/lib/supabaseServer";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    const { title, description, cover_image_url, thumbnail_url, total_seasons, tmdb_rating, language, tags, is_18_plus } = body;

    const { data: series, error } = await supabaseAdmin
      .from("series")
      .update({
        title,
        description,
        cover_image_url,
        thumbnail_url,
        total_seasons,
        tmdb_rating,
        language,
        tags,
        is_18_plus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, series });
  } catch (err: any) {
    console.error("Error updating series:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const { error } = await supabaseAdmin
      .from("series")
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Error deleting series:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
