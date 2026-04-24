import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import supabaseAdmin from "@/lib/supabaseServer";

export async function DELETE(
  req: Request,
  { params }: { params: { episodeId: string } }
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
      .from("episodes")
      .delete()
      .eq("id", params.episodeId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Error deleting episode:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
