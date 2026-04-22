import { NextRequest, NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user is admin
    const { data, error } = await supabaseAdmin
      .from("admins")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Supabase error checking admin:", error);
      return NextResponse.json({ isAdmin: false });
    }

    return NextResponse.json({ isAdmin: !!data });
  } catch (err) {
    console.error("Error checking admin status:", err);
    return NextResponse.json({ isAdmin: false });
  }
}
