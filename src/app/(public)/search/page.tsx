"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import CardGridSkeleton from "@/components/CardGridSkeleton";

type SearchType = "all" | "movies" | "series";

interface MovieItem {
  id: string;
  title: string;
  slug: string;
  thumbnail_url?: string;
  description?: string;
  tags?: string[];
  tmdb_rating?: number;
}

interface SeriesItem {
  id: string;
  title: string;
  slug: string;
  thumbnail_url?: string;
  description?: string;
  tags?: string[];
  tmdb_rating?: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>("all");
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesRes, seriesRes] = await Promise.all([fetch("/api/movies"), fetch("/api/series")]);

        if (!moviesRes.ok || !seriesRes.ok) {
          throw new Error("Failed to load search data");
        }

        const [moviesData, seriesData] = await Promise.all([moviesRes.json(), seriesRes.json()]);

        if (!active) return;
        setMovies(Array.isArray(moviesData) ? moviesData : []);
        setSeries(Array.isArray(seriesData) ? seriesData : []);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Error loading search");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredMovies = useMemo(() => {
    if (!normalizedQuery) return movies;
    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(normalizedQuery) ||
        (m.description || "").toLowerCase().includes(normalizedQuery) ||
        (m.tags || []).some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  }, [movies, normalizedQuery]);

  const filteredSeries = useMemo(() => {
    if (!normalizedQuery) return series;
    return series.filter(
      (s) =>
        s.title.toLowerCase().includes(normalizedQuery) ||
        (s.description || "").toLowerCase().includes(normalizedQuery) ||
        (s.tags || []).some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  }, [series, normalizedQuery]);

  const limitedMovies = useMemo(() => filteredMovies.slice(0, 12), [filteredMovies]);
  const limitedSeries = useMemo(() => filteredSeries.slice(0, 12), [filteredSeries]);

  const showMovies = type === "all" || type === "movies";
  const showSeries = type === "all" || type === "series";
  const hasResults = (showMovies && limitedMovies.length > 0) || (showSeries && limitedSeries.length > 0);

  return (
    <main className="min-h-screen pt-24 pb-10 relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://wallpapers.com/images/featured/movie-9pvmdtvz4cb0xl37.jpg)",
          }}
        />
        <div className="absolute inset-0 backdrop-blur-md bg-black/70" />
      </div>

      <div className="max-w-10/12 mx-auto px-4 relative z-10 space-y-6">
        <h1 className="kurdish-text text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-violet-500">
          گەڕان
        </h1>

        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl p-4 sm:p-5">
          <div className="relative">
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="گەڕان بۆ فیلم یان زنجیرە..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/70 transition"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { id: "all", label: "هەموو" },
              { id: "movies", label: "فیلمەکان" },
              { id: "series", label: "زنجیرەکان" },
            ].map((filterItem) => (
              <button
                key={filterItem.id}
                onClick={() => setType(filterItem.id as SearchType)}
                className={`kurdish-text rounded-full px-4 py-2 text-sm transition ${
                  type === filterItem.id ? "bg-violet-600 text-white" : "bg-white/10 text-gray-200 hover:bg-white/20"
                }`}
              >
                {filterItem.label}
              </button>
            ))}
          </div>
        </div>

        {loading && <CardGridSkeleton count={12} />}

        {!loading && error && (
          <div className="kurdish-text rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-red-200">
            هەڵە لە بارکردنی زانیارییەکانی گەڕان: {error}
          </div>
        )}

        {!loading && !error && !hasResults && (
          <div className="kurdish-text rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-6 text-center text-gray-200">
            هیچ ئەنجامێک نەدۆزرایەوە
          </div>
        )}

        {!loading && !error && hasResults && (
          <div className="space-y-8">
            {showMovies && limitedMovies.length > 0 && (
              <section>
                <h2 className="kurdish-text text-lg sm:text-xl font-semibold text-white mb-3">فیلمەکان</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                  {limitedMovies.map((m) => (
                    <Link key={`m-${m.id}`} href={`/movies/${m.slug}`}>
                      <div className="group relative bg-white/5 rounded-lg overflow-hidden hover:scale-105 transition duration-300 cursor-pointer">
                        <div className="relative w-full aspect-[2/3] bg-gray-700 overflow-hidden">
                          <img
                            src={m.thumbnail_url}
                            alt={m.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 brightness-90 opacity-0 group-hover:opacity-100 transition duration-300 px-2">
                            <p className="text-sm font-semibold text-white line-clamp-2">{m.title}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {showSeries && limitedSeries.length > 0 && (
              <section>
                <h2 className="kurdish-text text-lg sm:text-xl font-semibold text-white mb-3">زنجیرەکان</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                  {limitedSeries.map((s) => (
                    <Link key={`s-${s.id}`} href={`/series/${s.slug}`}>
                      <div className="group relative bg-white/5 rounded-lg overflow-hidden hover:scale-105 transition duration-300 cursor-pointer">
                        <div className="relative w-full aspect-[2/3] bg-gray-700 overflow-hidden">
                          <img
                            src={s.thumbnail_url}
                            alt={s.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 brightness-90 opacity-0 group-hover:opacity-100 transition duration-300 px-2">
                            <p className="text-sm font-semibold text-white line-clamp-2">{s.title}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

