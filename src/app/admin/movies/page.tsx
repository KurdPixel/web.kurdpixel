import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import supabaseAdmin from "@/lib/supabaseServer";
import { auth } from "@clerk/nextjs/server";


export default async function MoviesAdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

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

    await supabaseAdmin.from("movies").insert({
      title, slug, video_url, thumbnail_url, description, imdb_rating, language, duration_minutes, tags, translators
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
    <main className="min-h-screen pt-36">
      <div className="max-w-xl mx-auto bg-white/80 p-8 rounded shadow mb-10">
        <h1 className="text-2xl font-bold mb-6">Upload Movie</h1>
        <form action={handleUpload} className="space-y-4">
          <input name="title" placeholder="Title" required className="w-full p-2 border rounded" />
          <input name="video_url" placeholder="Vidmoly Embed URL (e.g. https://vidmoly.me/embed-xxxxxx.html)" required className="w-full p-2 border rounded" />
          <div className="text-xs text-gray-600">Paste the full Vidmoly embed URL. Example: <b>https://vidmoly.me/embed-3ml5banm6fuh.html</b></div>
          <input name="thumbnail_url" placeholder="Thumbnail Link (vertical)" required className="w-full p-2 border rounded" />
          <textarea name="description" placeholder="Description" required className="w-full p-2 border rounded" />
          <input name="imdb_rating" placeholder="IMDB Rating (e.g. 7.5)" type="number" step="0.1" min="0" max="10" required className="w-full p-2 border rounded" />
          <input name="language" placeholder="Language" required className="w-full p-2 border rounded" />
          <input name="duration_minutes" placeholder="Duration (minutes)" type="number" min="1" required className="w-full p-2 border rounded" />
          <input name="tags" placeholder="Tags (comma separated)" className="w-full p-2 border rounded" />
          <input name="translators" placeholder="Translators (comma separated)" className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700">Upload</button>
        </form>
      </div>

      <div className="max-w-3xl mx-auto bg-white/80 p-8 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Manage Movies</h2>
        {moviesError && <div className="text-red-600 mb-4">Error loading movies: {moviesError.message}</div>}
        <ul className="space-y-4">
          {movies?.map((movie) => (
            <li key={movie.id} className="flex items-center gap-4 p-2 border rounded">
              <img src={movie.thumbnail_url} alt={movie.title} className="w-12 h-20 object-cover rounded" draggable={false} />
              <div className="flex-1">
                <div className="font-semibold">{movie.title}</div>
                <div className="text-xs text-gray-500 truncate">{movie.video_url}</div>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/movies/${movie.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={movie.id} />
                  <button type="submit" className="text-red-600 hover:underline">Delete</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
