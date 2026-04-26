"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface SeriesPayload {
  title: string;
  description: string;
  cover_image_url: string;
  thumbnail_url: string;
  total_seasons: number;
  tmdb_rating: string;
  language: string;
  tags: string;
  is_18_plus: boolean;
}

export default function EditSeriesPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const seriesId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SeriesPayload>({
    title: "",
    description: "",
    cover_image_url: "",
    thumbnail_url: "",
    total_seasons: 1,
    tmdb_rating: "",
    language: "",
    tags: "",
    is_18_plus: false,
  });

  useEffect(() => {
    if (!seriesId) return;

    let active = true;

    const fetchSeries = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/series/${seriesId}`);
        const data = await res.json();

        if (!res.ok || !data?.series) {
          throw new Error(data?.error || "Failed to load series");
        }

        if (!active) return;
        setFormData({
          title: data.series.title || "",
          description: data.series.description || "",
          cover_image_url: data.series.cover_image_url || "",
          thumbnail_url: data.series.thumbnail_url || "",
          total_seasons: Number(data.series.total_seasons || 1),
          tmdb_rating:
            data.series.tmdb_rating !== null && data.series.tmdb_rating !== undefined
              ? String(data.series.tmdb_rating)
              : "",
          language: data.series.language || "",
          tags: Array.isArray(data.series.tags) ? data.series.tags.join(", ") : "",
          is_18_plus: Boolean(data.series.is_18_plus),
        });
      } catch (err: any) {
        if (active) setError(err.message || "Failed to load series");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSeries();

    return () => {
      active = false;
    };
  }, [seriesId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    if (!seriesId) return;

    try {
      setSaving(true);
      setError(null);

      const res = await fetch(`/api/admin/series/${seriesId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          cover_image_url: formData.cover_image_url,
          thumbnail_url: formData.thumbnail_url || formData.cover_image_url,
          total_seasons: Number(formData.total_seasons) || 1,
          tmdb_rating: formData.tmdb_rating ? Number(formData.tmdb_rating) : null,
          language: formData.language,
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          is_18_plus: formData.is_18_plus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update series");
      }

      router.push("/admin/series");
    } catch (err: any) {
      setError(err.message || "Failed to update series");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#121212] pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-gray-300">Loading series...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Edit Series</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              placeholder="Series title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
              placeholder="Series description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Cover Image URL *
            </label>
            <input
              type="url"
              name="cover_image_url"
              value={formData.cover_image_url}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Thumbnail Image URL
            </label>
            <input
              type="url"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              placeholder="https://example.com/thumb.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Total Seasons
            </label>
            <input
              type="number"
              name="total_seasons"
              value={formData.total_seasons}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>

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
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              placeholder="8.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Language
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              placeholder="English, Kurdish, ..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              placeholder="Drama, Action, Comedy, ..."
            />
          </div>

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

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/series")}
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
