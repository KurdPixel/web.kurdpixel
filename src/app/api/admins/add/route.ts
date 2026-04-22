import { auth } from "@clerk/nextjs/server";
import Clerk from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });

  // get request body
  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const newEmail: string | undefined = body?.email;
  if (!newEmail) return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });

  // fetch current user's primary email from Clerk
  let currentEmail: string | null = null;
  try {
    const user = await Clerk.users.getUser(userId as string);
    const primary = (user.emailAddresses || [])?.find((e: any) => e?.primary) || user.emailAddresses?.[0];
    currentEmail = primary?.emailAddress || null;
  } catch (err) {
    console.error("Failed to load user from Clerk:", err);
  }

  if (!currentEmail) return NextResponse.json({ ok: false, error: "Could not determine current user email" }, { status: 400 });

  // Only allow existing admins to add new admins
  try {
    const { data: existing, error: checkErr } = await supabaseAdmin
      .from("admins")
      .select("email")
      .eq("email", currentEmail)
      .maybeSingle();

    if (checkErr) {
      console.error("Error checking current admin:", checkErr);
      return NextResponse.json({ ok: false, error: "Supabase error" }, { status: 500 });
    }

    if (!existing) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    // insert new admin (id handled by DB)
    const { data, error } = await supabaseAdmin.from("admins").insert({ email: newEmail }).select().maybeSingle();
    if (error) {
      console.error("Error inserting admin:", error);
      return NextResponse.json({ ok: false, error: error.message || "Insert failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, admin: data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
