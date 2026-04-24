"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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
    <main className="min-h-screen bg-[#121212] pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Series</h1>
          <Link
            href="/admin/series/new"
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
          >
            + New Series
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : series.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No series added yet
          </div>
        ) : (
          <div className="space-y-4">
            {series.map((s) => (
              <div
                key={s.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>Seasons: {s.total_seasons}</span>
                    {s.language && <span>Language: {s.language}</span>}
                    {s.tmdb_rating && <span>TMDB: {s.tmdb_rating}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/series/${s.id}/episodes`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Episodes
                  </Link>
                  <Link
                    href={`/admin/series/${s.id}/edit`}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id, s.title)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
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
