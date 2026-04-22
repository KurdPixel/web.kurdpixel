import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import supabaseAdmin from "@/lib/supabaseServer";
import { auth } from "@clerk/nextjs/server";
import Clerk from "@clerk/clerk-sdk-node";
import MoviesList from "./MoviesList";


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

  // Form submission handler (server action)
  async function handleUpload(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    const video_url = formData.get("video_url") as string;
    const thumbnail_url = formData.get("thumbnail_url") as string;
    const description = formData.get("description") as string;
    const imdb_rating = parseFloat(formData.get("imdb_rating") as string);
    const language = formData.get("language") as string;
    const duration_minutes = parseInt(formData.get("duration_minutes") as string, 10);
    const tags = (formData.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean);
    const translators = (formData.get("translators") as string).split(",").map(t => t.trim()).filter(Boolean);
    const is_18_plus = formData.get("is_18_plus") === "on";

    await supabaseAdmin.from("movies").insert({
      title, slug, video_url, thumbnail_url, description, imdb_rating, language, duration_minutes, tags, translators, is_18_plus
    });
    // Optionally, you can redirect or revalidate here if needed
  }

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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-violet-400 hover:text-violet-300 mb-4 inline-block">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Movies</h1>
          <p className="text-white/60">Add, edit, or remove movies from your collection</p>
        </div>

        {/* Add Movie Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Add New Movie</h2>
          <form action={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Title *</label>
              <input 
                name="title" 
                placeholder="Movie Title" 
                required 
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Vidmoly Embed URL *</label>
              <input 
                name="video_url" 
                placeholder="https://vidmoly.me/embed-xxxxxx.html" 
                required 
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <p className="text-white/50 text-xs mt-1">Paste the full Vidmoly embed URL</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Thumbnail URL *</label>
              <input 
                name="thumbnail_url" 
                placeholder="https://example.com/thumbnail.jpg" 
                required 
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <p className="text-white/50 text-xs mt-1">Vertical image for best results</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Description *</label>
              <textarea 
                name="description" 
                placeholder="Movie description..." 
                required 
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">IMDB Rating</label>
                <input 
                  name="imdb_rating" 
                  placeholder="7.5" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="10" 
                  required 
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Language</label>
                <input 
                  name="language" 
                  placeholder="Kurdish" 
                  required 
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Duration (minutes)</label>
              <input 
                name="duration_minutes" 
                placeholder="120" 
                type="number" 
                min="1" 
                required 
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Tags (comma separated)</label>
              <input 
                name="tags" 
                placeholder="Action, Drama, Adventure" 
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Translators (comma separated)</label>
              <input 
                name="translators" 
                placeholder="John Doe, Jane Smith" 
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <input 
                type="checkbox" 
                id="is_18_plus" 
                name="is_18_plus" 
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="is_18_plus" className="text-sm font-medium text-red-300 cursor-pointer">
                Mark as +18 content (restricted to adults)
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors"
            >
              Add Movie
            </button>
          </form>
        </div>

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
