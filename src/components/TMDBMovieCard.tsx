"use client";

import React, { useState } from "react";

interface Props {
  movie: {
    id: number;
    title: string;
    release_date: string;
    rating: number;
    poster_path: string | null;
    overview: string;
  };
  details: {
    title: string;
    rating: number;
    duration_minutes: number;
    poster_path: string;
    genres: string[];
    overview: string;
    release_date: string;
    original_language: string;
  };
  onConfirm: (movieData: any) => void;
  onBack: () => void;
}

export default function TMDBMovieCard({
  movie,
  details,
  onConfirm,
  onBack,
}: Props) {
  const [formData, setFormData] = useState({
    title: details.title || "",
    tmdb_rating: details.rating || 0,
    duration_minutes: details.duration_minutes || 0,
    thumbnail_url: details.poster_path
      ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
      : "",
    tags: (details.genres || []).join(", "),
    description: details.overview || "",
    language: details.original_language || "",
    translators: "",
    is_18_plus: false,
  });

  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopyField = (value: string, field: string) => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type } = e.target;
    const value =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
        translators: formData.translators
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
        slug,
        tmdb_movie_id: movie.id,
      };

      const res = await fetch("/api/admin/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add movie");
      }

      onConfirm(formData);
    } catch (err: any) {
      setError(err.message || "Failed to add movie");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : "";

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Search
      </button>

      {/* Modern Dark Card */}
      <div className="rounded-2xl overflow-hidden bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Poster Section with Gradient Overlay */}
        <div className="relative h-96 overflow-hidden">
          {posterUrl && (
            <>
              {/* Background Blur */}
              <div
                className="absolute inset-0 blur-xl scale-110"
                style={{
                  backgroundImage: `url('${posterUrl}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.3,
                }}
              />

              {/* Poster Image */}
              <div className="absolute left-6 top-6 bottom-6 w-32 rounded-xl overflow-hidden shadow-2xl border border-white/20">
                <img
                  src={posterUrl}
                  alt={formData.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

          {/* Movie Info */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 pl-48">
            <h1 className="text-3xl font-bold text-white mb-2">
              {formData.title}
            </h1>

            {/* Rating, Year, Runtime */}
            <div className="flex items-center gap-4 text-sm mb-4">
              {formData.tmdb_rating > 0 && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                  <span className="text-yellow-300 font-semibold">
                    ★ {formData.tmdb_rating.toFixed(1)}/10
                  </span>
                </div>
              )}
              {details.release_date && (
                <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white">
                  {new Date(details.release_date).getFullYear()}
                </div>
              )}
              {formData.duration_minutes > 0 && (
                <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white">
                  {formData.duration_minutes} min
                </div>
              )}
            </div>

            {/* Genres/Tags */}
            {formData.tags && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.split(",").map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-200 text-xs font-medium"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Auto-filled Fields (Read-only) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              ✓ Auto-filled from TMDB
            </h3>

            {/* Title */}
            <div className="relative">
              <label className="block text-xs font-medium text-white/70 mb-2">
                Title *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.title}
                  disabled
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 disabled:opacity-50 cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => handleCopyField(formData.title, "title")}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
                  title="Copy"
                >
                  {copied === "title" ? (
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* TMDB Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-2">
                  TMDB Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.tmdb_rating}
                  disabled
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration_minutes}
                  disabled
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Tags/Genres */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">
                Genres
              </label>
              <input
                type="text"
                value={formData.tags}
                disabled
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 disabled:opacity-50 cursor-not-allowed"
              />
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">
                Thumbnail URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.thumbnail_url}
                  disabled
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 disabled:opacity-50 cursor-not-allowed truncate"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleCopyField(formData.thumbnail_url, "thumbnail")
                  }
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors shrink-0"
                  title="Copy"
                >
                  {copied === "thumbnail" ? (
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Manual Fields */}
          <div className="space-y-4 border-t border-white/10 pt-6">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              Fill These Fields
            </h3>

            {/* Language */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">
                Language
              </label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                placeholder="e.g., Kurdish, English"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>

            {/* Description - Editable */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">
                Description (Edit if needed)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
              />
            </div>

            {/* v>

            {/* Translators */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">
                Translators (comma separated)
              </label>
              <input
                type="text"
                name="translators"
                value={formData.translators}
                onChange={handleChange}
                placeholder="John Doe, Jane Smith"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>

            {/* 18+ Checkbox */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <input
                type="checkbox"
                id="is_18_plus"
                name="is_18_plus"
                checked={formData.is_18_plus}
                onChange={handleChange}
                className="w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="is_18_plus"
                className="text-sm font-medium text-red-300 cursor-pointer"
              >
                Mark as +18 content (restricted to adults)
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 border-t border-white/10 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Adding..." : "✓ Add Movie"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/20"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
