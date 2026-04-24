"use client";

import React, { useState, useEffect, useMemo } from "react";
import SeriesCard from "@/components/SeriesCard";

interface Series {
  id: string;
  title: string;
  slug: string;
  cover_image_url?: string;
  thumbnail_url?: string;
  total_seasons?: number;
  tmdb_rating?: number;
  description?: string;
  tags?: string[];
}

export default function SeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/series");
        if (!res.ok) {
          throw new Error("Failed to fetch series");
        }
        const data = await res.json();
        setSeries(data);
      } catch (err: any) {
        setError(err.message);
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return series;
    return series.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.description || "").toLowerCase().includes(q) ||
        (s.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [series, searchQuery]);

  return (
    <main className="min-h-screen bg-[#121212] pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
         <h1 className="kurdish-text text-center text-5xl font-semibold py-2 text-violet-500 relative z-10">
        زنجیرەکان
        </h1>

        {/* Search */}
        <div className="mb-8 pt-4 flex justify-center">
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
              placeholder="گەڕان بۆ زنجیرە..."
              className="w-full pl-12 pr-5 py-3 text-sm sm:text-base rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/70 transition duration-200"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="text-gray-400">بارکردن...</div>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center ">
            <p className="kurdish-text text-gray-300 text-lg">هیچ زنجیرەیەک نەدۆزرایەوە</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {filtered.map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
