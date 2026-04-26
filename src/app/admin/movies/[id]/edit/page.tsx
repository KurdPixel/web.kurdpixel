import React from "react";
import { redirect } from "next/navigation";
import supabaseAdmin from "@/lib/supabaseServer";
import { auth } from "@clerk/nextjs/server";
import Clerk from "@clerk/clerk-sdk-node";
import EditMovieForm from "@/components/EditMovieForm";

type Props = { params: { id: string } };

export default async function EditMoviePage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // Get primary email from Clerk
  let email: string | null = null;
  try {
    const user = await Clerk.users.getUser(userId as string);
    const primary = (user.emailAddresses || [])?.find((e: any) => e?.primary) || user.emailAddresses?.[0];
    email = primary?.emailAddress || null;
  } catch (err) {
    console.error("Failed to load user from Clerk:", err);
  }

  if (!email) {
    redirect("/");
  }

  // Check Supabase `admins` table for this email
  try {
    const { data, error } = await supabaseAdmin
      .from("admins")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Supabase error checking admin:", error);
      return (
        <main className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow">
            <h1 className="text-xl font-semibold mb-2">Error</h1>
            <p className="text-gray-700">Unable to verify admin status. Try again later.</p>
          </div>
        </main>
      );
    }

    if (!data) {
      // Not an admin — redirect to home
      redirect("/");
    }
  } catch (err) {
    console.error("Admin check error:", err);
    redirect("/");
  }

  const identifier = (await params as { id: string }).id;
  if (!identifier || identifier === "undefined") {
    return (
      <main className="min-h-screen pt-36">
        <div className="max-w-xl mx-auto bg-[#0f0f0f] p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Edit Movie</h1>
          <div className="text-red-600 mb-4">Missing movie identifier in URL.</div>
          <div className="mt-4">
            <a href="/admin/movies" className="py-2 px-4 rounded border">Back to list</a>
          </div>
        </div>
      </main>
    );
  }

  // detect UUID v4-ish to decide whether to query by id or slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
  const query = isUuid ? supabaseAdmin.from("movies").select("*").eq("id", identifier).single()
                       : supabaseAdmin.from("movies").select("*").eq("slug", identifier).single();
  const { data: movie, error } = await query;
  if (error || !movie) {
    return (
      <main className="min-h-screen pt-36">
        <div className="max-w-xl mx-auto bg-[#0f0f0f] p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Edit Movie</h1>
          <div className="text-red-600 mb-4">Unable to load movie{error ? `: ${error.message}` : "."}</div>
          <div className="mt-4">
            <a href="/admin/movies" className="py-2 px-4 rounded border">Back to list</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-36">
      <EditMovieForm id={identifier} movie={movie} />
    </main>
  );
}
