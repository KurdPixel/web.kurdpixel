import { NextRequest, NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";
import { auth } from "@clerk/nextjs/server";
import Clerk from "@clerk/clerk-sdk-node";

// GET all slides
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("slides")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching slides:", err);
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}

// POST - add a new slide (admin only)
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user email from Clerk
    let email: string | null = null;
    try {
      const user = await Clerk.users.getUser(userId as string);
      const primary = (user.emailAddresses || [])?.find((e: any) => e?.primary) || user.emailAddresses?.[0];
      email = primary?.emailAddress || null;
    } catch (err) {
      console.error("Failed to load user from Clerk:", err);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if admin
    const { data: admin, error: adminError } = await supabaseAdmin
      .from("admins")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (adminError || !admin) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    // Get the request body
    const { image_url, title, description, watch_url } = await req.json();

    if (!image_url) {
      return NextResponse.json({ error: "image_url is required" }, { status: 400 });
    }

    // Get the highest order value
    const { data: lastSlide } = await supabaseAdmin
      .from("slides")
      .select("order")
      .order("order", { ascending: false })
      .limit(1);

    const nextOrder = (lastSlide?.[0]?.order ?? -1) + 1;

    // Insert new slide
    const { data, error } = await supabaseAdmin
      .from("slides")
      .insert({ image_url, title, description, watch_url, order: nextOrder })
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    console.error("Error creating slide:", err);
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
  }
}
