"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Movie = { id: string; title: string; slug: string; thumbnail_url: string; tmdb_rating?: number };

export default function Trend() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/trend?limit=10")
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return;
        setMovies(j.data ?? []);
      })
      .catch(() => mounted && setMovies([]))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <section dir="rtl" className="bg-[#121212] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="kurdish-text text-xl font-bold mb-4">نوێترین فیلمەکان</h3>

        {loading && (
          <div className="kurdish-text text-sm text-gray-400">هەڵگرتن...</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {movies?.slice(0, 10).map((m) => (
            <Link key={m.id} href={`/movies/${m.slug}`} className="block">
              <div className="group relative bg-white/5 rounded-lg border-[0.5px] border-gray-800 hover:border-violet-500 overflow-hidden shadow-sm hover:scale-105 transform transition duration-200">
                
                <div className="relative w-full h-56 sm:h-64 md:h-56 lg:h-64 overflow-hidden">
                  
                  <img
                    src={m.thumbnail_url}
                    alt={m.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 brightness-90 opacity-0 group-hover:opacity-100 transition duration-300">
                    
                    {/* Title */}
                    <p className="text-sm font-semibold text-white max-w-3xl px-2">
                      {m.title}
                    </p>

                    {/* Rating */}
                    <div className="mt-1 flex items-center gap-1 bg-black/50 border border-white/10 text-white font-bold px-2 py-1 rounded-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0L5.37 17.85c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L1.373 7.39c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69L9.05 2.927z" />
                      </svg>
                      <span>{m.tmdb_rating ?? "--"}</span>
                    </div>

                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}