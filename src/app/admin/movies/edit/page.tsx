"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Movie = {
  id: string;
  title?: string;
  video_url?: string;
  thumbnail_url?: string;
  description?: string;
  imdb_rating?: number;
  language?: string;
  duration_minutes?: number;
  tags?: string[];
  translators?: string[];
};

export default function EditMovieQueryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams?.get("id") ?? undefined;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing movie id");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/admin/movies/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (!j.ok) throw new Error(j.error || "Failed to load");
        setMovie(j.movie ?? null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return setError("Missing movie id");
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const body = {
      title: String(fd.get("title") || ""),
      video_url: String(fd.get("video_url") || ""),
      thumbnail_url: String(fd.get("thumbnail_url") || ""),
      description: String(fd.get("description") || ""),
      imdb_rating: fd.get("imdb_rating") ? Number(fd.get("imdb_rating")) : null,
      language: String(fd.get("language") || ""),
      duration_minutes: fd.get("duration_minutes") ? Number(fd.get("duration_minutes")) : null,
      tags: (String(fd.get("tags") || "")).split(",").map((t) => t.trim()).filter(Boolean),
      translators: (String(fd.get("translators") || "")).split(",").map((t) => t.trim()).filter(Boolean),
    };

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/movies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Save failed");
      router.push("/admin/movies");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="pt-36 max-w-xl mx-auto p-8">Loading...</div>;
  if (error) return (
    <main className="min-h-screen pt-36">
      <div className="max-w-xl mx-auto bg-white/80 p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Edit Movie</h1>
        <div className="text-red-600 mb-4">{error}</div>
        <div className="mt-4">
          <a href="/admin/movies" className="py-2 px-4 rounded border">Back to list</a>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen pt-36">
      <div className="max-w-xl mx-auto bg-white/80 p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Movie</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" placeholder="Title" defaultValue={movie?.title ?? ""} required className="w-full p-2 border rounded" />
          <input name="video_url" placeholder="Vidmoly Embed URL" defaultValue={movie?.video_url ?? ""} required className="w-full p-2 border rounded" />
          <input name="thumbnail_url" placeholder="Thumbnail Link" defaultValue={movie?.thumbnail_url ?? ""} required className="w-full p-2 border rounded" />
          <textarea name="description" placeholder="Description" defaultValue={movie?.description ?? ""} required className="w-full p-2 border rounded" />
          <input name="imdb_rating" placeholder="IMDB Rating" type="number" step="0.1" min="0" max="10" defaultValue={movie?.imdb_rating ?? ""} className="w-full p-2 border rounded" />
          <input name="language" placeholder="Language" defaultValue={movie?.language ?? ""} className="w-full p-2 border rounded" />
          <input name="duration_minutes" placeholder="Duration (minutes)" type="number" min="1" defaultValue={movie?.duration_minutes ?? ""} className="w-full p-2 border rounded" />
          <input name="tags" placeholder="Tags (comma separated)" defaultValue={(movie?.tags || []).join(", ")} className="w-full p-2 border rounded" />
          <input name="translators" placeholder="Translators (comma separated)" defaultValue={(movie?.translators || []).join(", ")} className="w-full p-2 border rounded" />
          <div className="flex gap-4">
            <button type="submit" className="bg-violet-600 text-white py-2 px-4 rounded hover:bg-violet-700">Save</button>
            <a href="/admin/movies" className="py-2 px-4 rounded border">Cancel</a>
          </div>
        </form>
      </div>
    </main>
  );
}
