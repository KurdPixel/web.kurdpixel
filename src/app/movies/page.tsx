"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Movie {
  id: string;
  title: string;
  slug: string;
  thumbnail_url?: string;
  description?: string;
  tags?: string[];
  tmdb_rating?: number;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/movies");
        if (!res.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await res.json();
        setMovies(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError(err instanceof Error ? err.message : "Error loading movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [inView]);

  const filtered = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.description || "").toLowerCase().includes(q) ||
        (m.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [movies, searchQuery]);

  return (
    <main className="min-h-screen pt-20 relative overflow-hidden">
      <style>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            scale: 0.8;
          }
          100% {
            opacity: 1;
            scale: 1;
          }
        }
        .animate-pop-in {
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }
      `}</style>

      {/* Fixed background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://wallpapers.com/images/featured/movie-9pvmdtvz4cb0xl37.jpg)",
          }}
        />
        <div className="absolute inset-0 backdrop-blur-md bg-black/70" />
      </div>

      <div className="max-w-10/12 mx-auto px-4 relative z-10">

        {/* Title */}
        <h1 className="kurdish-text text-center text-2xl sm:text-3xl md:text-4xl font-semibold py-4 text-violet-500">
          فیلمەکان
        </h1>

        {/* Search */}
        <div className="mb-6 sm:mb-8 md:mb-10 flex justify-center px-2 sm:px-4">
          <div className="relative w-full max-w-xl">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="گەڕان بۆ فیلم..."
              className="w-full pl-12 pr-5 py-2.5 text-sm rounded-full bg-white/10 backdrop-blur-xl border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/70 transition duration-200"
            />
          </div>
        </div>

        {/* Content */}
        <div ref={sectionRef}>
          {error && (
            <div className="kurdish-text p-8 text-center text-red-600 relative z-10">
              هەڵە لە بارکردنی فیلمەکان: {error}
            </div>
          )}

          {loading && (
            <div className="kurdish-text p-8 text-center text-white relative z-10">
              چاوەڕوانبە...
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {filtered.map((m, index) => (
                <Link key={m.id} href={`/movies/${m.slug}`}>
                  <div 
                    className="group relative bg-white/5 rounded-lg overflow-hidden hover:scale-105 transition duration-300 cursor-pointer animate-pop-in"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
                      <img
                        src={m.thumbnail_url}
                        alt={m.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 brightness-90 opacity-0 group-hover:opacity-100 transition duration-300 px-2">
                        <p className="text-sm font-semibold text-white line-clamp-2">
                          {m.title}
                        </p>
                        {m.tmdb_rating && (
                          <div className="mt-1 flex items-center gap-1 bg-black/50 border border-white/10 text-white font-bold px-2 py-1 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0L5.37 17.85c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L1.373 7.39c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69L9.05 2.927z" />
                            </svg>
                            <span>{m.tmdb_rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}