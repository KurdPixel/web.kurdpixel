import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import supabaseAdmin from "@/lib/supabaseServer";
import { auth } from "@clerk/nextjs/server";
import Clerk from "@clerk/clerk-sdk-node";
import MoviesList from "./MoviesList";
import AddMovieModal from "@/components/AddMovieModal";


export default async function MoviesAdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

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

  // Fetch all movies for management
  const { data: movies, error: moviesError } = await supabaseAdmin
    .from("movies")
    .select("id, title, slug, thumbnail_url, video_url")
    .order("created_at", { ascending: false });

  // Delete movie server action
  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await supabaseAdmin.from("movies").delete().eq("id", id);
    // Optionally, you can redirect or revalidate here if needed
  }

  return (
    <main className="min-h-screen pt-28 pb-8 px-4 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-2">
          <h1 className="text-3xl font-bold text-white mb-2">Manage Movies</h1>
          <p className="text-white/60">Add, edit, or remove movies from your collection</p>
        </div>

        {/* Add Movie Button */}
        <AddMovieModal />

        {/* Movies List */}
        <div>
          {moviesError && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm mb-4">
              Error loading movies: {moviesError.message}
            </div>
          )}

          <MoviesList movies={movies} onDelete={handleDelete} />
        </div>
      </div>
    </main>
  );
}