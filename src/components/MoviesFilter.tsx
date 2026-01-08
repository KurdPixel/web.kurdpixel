"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

type Movie = {
  id: string;
  title: string;
  slug: string;
  thumbnail_url?: string;
  description?: string;
  tags?: string[];
};

export default function MoviesFilter({ movies }: { movies: Movie[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter(m => (
      (m.title || "").toLowerCase().includes(q) ||
      (m.description || "").toLowerCase().includes(q) ||
      (m.tags || []).some(t => t.toLowerCase().includes(q))
    ));
  }, [movies, query]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-6 kurdish-text p-4 bg-black/30 backdrop-blur-lg border border-white/10 text-white text-sm rounded-lg">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="گەڕان بۆ فیلم......"
          className="w-full p-4 text-lg rounded border border-gray-700 focus:outline-none focus:border-violet-500 bg-black/20 backdrop-blur-lg text-white"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 p-4 justify-items-end">
        {filtered.map(movie => (
          <Link key={movie.id} href={`/movies/${movie.slug}`} className="block group text-right w-full">
            <div className="bg-white/5 rounded-lg border-[0.5px] hover:border-[0.1px] border-gray-800 hover:border-violet-500 overflow-hidden shadow-sm hover:scale-105 transform transition duration-200">
              <div className="w-full h-56 sm:h-64 md:h-56 lg:h-64 overflow-hidden">
                <img src={movie.thumbnail_url} alt={movie.title} className="w-full h-full object-cover" draggable={false} />
              </div>
              <div className="p-2 text-sm font-semibold text-center text-white truncate">{movie.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
