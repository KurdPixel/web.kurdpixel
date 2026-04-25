"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";

type Movie = {
  id: string;
  title: string;
  slug: string;
  thumbnail_url?: string;
  description?: string;
  tags?: string[];
  tmdb_rating?: number;
};

export default function MoviesFilter({ movies }: { movies: Movie[] }) {
  const [query, setQuery] = useState("");

  // 🔥 scroll trigger state
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // run once only
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
    <div ref={sectionRef} className="max-w-7xl mx-auto px-4">

      {/* Search */}
      <div className="mb-8 flex justify-center kurdish-text">
        <div className="relative w-full max-w-xl">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
          </svg>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="گەڕان بۆ فیلم..."
            className="w-full pl-12 pr-5 py-3 text-sm sm:text-base 
                       rounded-full 
                       bg-white/10 backdrop-blur-xl 
                       border border-white/20 
                       text-white placeholder-gray-300
                       focus:outline-none focus:ring-2 focus:ring-violet-500/70
                       transition duration-200"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-4 sm:gap-5 md:gap-6">

        {filtered.map((movie, index) => (
          <Link key={movie.id} href={`/movies/${movie.slug}`} className="block group w-full">
            <div
              className={`
                relative bg-white/5 rounded-xl border border-gray-800 
                hover:border-violet-500 overflow-hidden 
                hover:scale-105 transition duration-300

                ${inView ? "animate-card" : "opacity-0 translate-y-6"}
              `}
              style={{
                animationDelay: `${index * 60}ms`,
              }}
            >

              {/* Image */}
              <div className="relative w-full aspect-[2/3] overflow-hidden">
                <img
                  src={movie.thumbnail_url}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/50 brightness-90 opacity-0 group-hover:opacity-100 transition duration-300 px-2">

                  <p className="text-sm font-semibold text-white line-clamp-2">
                    {movie.title}
                  </p>

                  <div className="mt-1 flex items-center gap-1 bg-black/40 border border-white/10 text-white font-bold px-2 py-1 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.690h4.178c.969 0 1.371 1.240.588 1.810l-3.380 2.455a1 1 0 00-.364 1.118l1.286 3.966c.300.921-.755 1.688-1.540 1.118l-3.380-2.455a1 1 0 00-1.176 0L5.370 17.850c-.784.570-1.838-.197-1.540-1.118l1.286-3.966a1 1 0 00-.364-1.118L1.373 7.390c-.783-.570-.380-1.810.588-1.810h4.178a1 1 0 00.950-.690L9.050 2.927z" />
                    </svg>
                    <span>{movie.tmdb_rating ?? "--"}</span>
                  </div>

                </div>

              </div>
            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}