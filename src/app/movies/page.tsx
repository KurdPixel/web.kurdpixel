"use client";

import React, { useState, useEffect } from "react";
import MoviesFilter from "@/components/MoviesFilter";

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

  useEffect(() => {
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
  }, []);

  return (
    <main className="min-h-screen pt-28 relative overflow-hidden">
      
      {/* Fixed background (fixed + no scale = no duplication) */}
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

      {/* Title */}
      <h1 className="kurdish-text text-center text-5xl font-semibold py-6 text-violet-500 relative z-10">
        فیلمەکان
      </h1>

      {/* States */}
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
        <div className="relative z-10">
          <MoviesFilter movies={movies} />
        </div>
      )}
    </main>
  );
}