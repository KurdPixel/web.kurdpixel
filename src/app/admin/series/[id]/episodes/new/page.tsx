"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface Series {
  id: string;
  title: string;
  total_seasons: number;
  thumbnail_url?: string;
  tmdb_series_id?: number;
}

export default function NewEpisodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(false);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    season_number: 1,
    episode_number: 1,
    title: "",
    description: "",
    video_url: "",
    thumbnail_url: "",
    tmdb_rating: "",
    is_18_plus: false,
  });

  useEffect(() => {
    fetchSeries();
  }, [id]);

  const fetchSeries = async () => {
    try {
      const res = await fetch(`/api/admin/series`);
      const allSeries = await res.json();
      const current = allSeries.find((s: Series) => s.id === id);
      setSeries(current);
      // Auto-set thumbnail from series
      if (current?.thumbnail_url) {
        setFormData((prev) => ({
          ...prev,
          thumbnail_url: current.thumbnail_url,
        }));
      }
    } catch (err) {
      console.error("Error fetching series:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/series/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          series_id: id,
          season_number: parseInt(formData.season_number as any),
          episode_number: parseInt(formData.episode_number as any),
          title: formData.title,
          description: formData.description,
          video_url: "",
          thumbnail_url: formData.thumbnail_url,
          tmdb_rating: formData.tmdb_rating ? parseFloat(formData.tmdb_rating) : null,
          is_18_plus: formData.is_18_plus,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create episode");
      }

      router.push(`/admin/series/${id}/episodes`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillFromTMDB = async () => {
    if (!series?.tmdb_series_id) {
      setError("TMDB series ID is missing for this series.");
      return;
    }

    setTmdbLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/series-tmdb/episode?id=${series.tmdb_series_id}&season=${formData.season_number}&episode=${formData.episode_number}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch TMDB episode data");
      }

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        tmdb_rating:
          typeof data.tmdb_rating === "number" && !Number.isNaN(data.tmdb_rating)
            ? String(Number(data.tmdb_rating.toFixed(1)))
            : prev.tmdb_rating,
        thumbnail_url: data.thumbnail_url || prev.thumbnail_url,
      }));
    } catch (err: any) {
      setError(err.message || "Failed to fetch episode details from TMDB");
    } finally {
      setTmdbLoading(false);
    }
  };

  if (!series) {
    return (
      <main className="min-h-screen bg-[#121212] pt-32">
        <div className="text-gray-400 text-center">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">New Episode</h1>
        <p className="text-gray-400 mb-8">{series.title}</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Season and Episode Numbers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Season *
              </label>
              <select
                name="season_number"
                value={formData.season_number}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {Array.from({ length: series.total_seasons }, (_, i) => i + 1).map(
                  (season) => (
                    <option key={season} value={season}>
                      Season {season}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Episode *
              </label>
              <input
                type="number"
                name="episode_number"
                value={formData.episode_number}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleAutofillFromTMDB}
              disabled={tmdbLoading || !series.tmdb_series_id}
              className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tmdbLoading
                ? "Fetching from TMDB..."
                : "Auto-fill Episode Data from TMDB"}
            </button>
            {!series.tmdb_series_id && (
              <p className="text-xs text-yellow-300 mt-2">
                This series has no TMDB ID, so TMDB auto-fill is unavailable.
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Episode title..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="Episode description..."
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Auto-filled from TMDB or series..."
            />
          </div>

          {/* TMDB Rating */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              TMDB Rating
            </label>
            <input
              type="number"
              name="tmdb_rating"
              value={formData.tmdb_rating}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="10"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="8.5"
            />
          </div>

          {/* 18+ */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_18_plus"
                checked={formData.is_18_plus}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-white/10 border border-white/20"
              />
              <span className="text-sm font-medium text-white/70">
                18+ Content
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Episode"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
