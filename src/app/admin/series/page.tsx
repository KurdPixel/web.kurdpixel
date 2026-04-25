"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AddSeriesModal from "@/components/AddSeriesModal";

interface Series {
  id: string;
  title: string;
  slug: string;
  total_seasons: number;
  tmdb_rating?: number;
  language?: string;
  created_at: string;
}

export default function AdminSeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/series");
      if (!res.ok) {
        throw new Error("Failed to fetch series");
      }
      const data = await res.json();
      setSeries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/series/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSeries(series.filter((s) => s.id !== id));
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#121212] pt-24 sm:pt-28 md:pt-32 pb-12 md:pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Series</h1>
          <AddSeriesModal onSeriesAdded={fetchSeries} />
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 sm:py-20 text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 sm:py-20 text-red-400">{error}</div>
        ) : series.length === 0 ? (
          <div className="text-center py-12 sm:py-20 text-gray-400">
            No series added yet
          </div>
        ) : (
          <div className="space-y-2 md:space-y-4">
            {series.map((s) => (
              <div
                key={s.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-3 md:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold mb-1 truncate">{s.title}</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                    <span>Seasons: {s.total_seasons}</span>
                    {s.language && <span>Language: {s.language}</span>}
                    {s.tmdb_rating && <span>TMDB: {s.tmdb_rating}</span>}
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-wrap">
                  <Link
                    href={`/admin/series/${s.id}/episodes`}
                    className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap"
                  >
                    Episodes
                  </Link>
                  <Link
                    href={`/admin/series/${s.id}/edit`}
                    className="px-2 sm:px-4 py-1 sm:py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id, s.title)}
                    className="px-2 sm:px-4 py-1 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
