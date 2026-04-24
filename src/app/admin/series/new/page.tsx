"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSeriesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
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
      const res = await fetch("/api/admin/series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          cover_image_url: formData.cover_image_url,
          thumbnail_url: formData.thumbnail_url || formData.cover_image_url,
          total_seasons: parseInt(formData.total_seasons as any),
          tmdb_rating: formData.tmdb_rating ? parseFloat(formData.tmdb_rating) : null,
          language: formData.language,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
          is_18_plus: formData.is_18_plus,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create series");
      }

      router.push("/admin/series");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#121212] pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Create New Series</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              placeholder="Series title..."
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
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
              placeholder="Series description..."
            />
          </div>

          {/* Cover Image */}
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

          {/* Thumbnail Image */}
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

          {/* Total Seasons */}
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
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              placeholder="8.5"
            />
          </div>

          {/* Language */}
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

          {/* Tags */}
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
              {loading ? "Creating..." : "Create Series"}
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
