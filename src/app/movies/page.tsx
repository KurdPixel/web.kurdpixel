import React from "react";
import supabase from "../../lib/supabaseClient";
import Link from "next/link";

export default async function MoviesPage() {
  const { data: movies, error } = await supabase
    .from("movies")
    .select("id, title, slug, thumbnail_url")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8 text-red-600">Error loading movies: {error.message}</div>;
  }

  return (
    <main className="min-h-screen pt-28" dir="rtl">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4 justify-items-end">
        {movies?.map(movie => (
          <Link key={movie.id} href={`/movies/${movie.slug}`} className="block group text-right">
            <img
              src={movie.thumbnail_url}
              alt={movie.title}
              className="w-full aspect-[9/16] object-cover rounded-lg shadow group-hover:scale-105 transition"
            />
            <div className="mt-2 font-semibold text-white truncate">{movie.title}</div>
            <div className="text-xs text-gray-400 truncate">{movie.slug}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}