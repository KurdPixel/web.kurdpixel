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
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 p-4 justify-items-end">
        {movies?.map(movie => (
          <Link key={movie.id} href={`/movies/${movie.slug}`} className="block group text-right w-full">
            <div className="bg-white/5 rounded-lg border-[0.5px] hover:border-[0.1px] border-gray-800 hover:border-violet-500 overflow-hidden shadow-sm hover:scale-105 transform transition duration-200">
              <div className="w-full h-56 sm:h-64 md:h-56 lg:h-64 overflow-hidden">
                <img
                  src={movie.thumbnail_url}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              <div className="p-2 text-sm font-semibold text-center text-white truncate">{movie.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}