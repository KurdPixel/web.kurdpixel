"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Slide {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
  watch_url?: string;
  order: number;
  created_at: string;
}

export default function SlidesAdminPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [watchUrl, setWatchUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch slides on component mount
  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/slides");
      if (!res.ok) throw new Error("Failed to fetch slides");
      const data = await res.json();
      setSlides(data);
    } catch (err) {
      setError("Failed to load slides");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!imageUrl.trim()) {
      setError("Please enter an image URL");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image_url: imageUrl,
          title: title.trim() || null,
          description: description.trim() || null,
          watch_url: watchUrl.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add slide");
      }

      setSuccess("Slide added successfully!");
      setImageUrl("");
      setTitle("");
      setDescription("");
      setWatchUrl("");
      await fetchSlides();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add slide");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    try {
      const res = await fetch(`/api/slides/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete slide");
      setSuccess("Slide deleted successfully!");
      await fetchSlides();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete slide");
    }
  };

  return (
    <main className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-8 px-4 sm:px-6 bg-[#0f0f0f]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link href="/admin" className="text-violet-400 hover:text-violet-300 mb-3 inline-block text-sm md:text-base">
            ← Back to Admin
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Manage Carousel Slides</h1>
          <p className="text-white/60 text-sm md:text-base">Add or remove slides for the main page carousel</p>
        </div>

        {/* Add Slide Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Add New Slide</h2>
          <form onSubmit={handleAddSlide} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1 md:mb-2">Image URL *</label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 md:px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1 md:mb-2">Title</label>
              <input
                type="text"
                placeholder="e.g., Amazing Movie"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 md:px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1 md:mb-2">Description</label>
              <textarea
                placeholder="e.g., A thrilling story about..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 md:px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1 md:mb-2">Movie Slug (Watch Button)</label>
              <input
                type="text"
                placeholder="e.g., flow-(2024)"
                value={watchUrl}
                onChange={(e) => setWatchUrl(e.target.value)}
                className="w-full px-3 md:px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              />
              <p className="text-white/50 text-xs mt-1">Enter just the movie slug. It will link to /movies/slug</p>
            </div>

            {error && (
              <div className="p-2 md:p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-xs md:text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-2 md:p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-xs md:text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 text-white font-medium transition-colors text-sm md:text-base"
            >
              {submitting ? "Adding..." : "Add Slide"}
            </button>
          </form>
        </div>

        {/* Slides List */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Current Slides ({slides.length})</h2>

          {loading ? (
            <div className="text-white/60 text-sm">Loading slides...</div>
          ) : slides.length === 0 ? (
            <div className="text-white/60 text-sm">No slides yet. Add one above!</div>
          ) : (
            <div className="space-y-2 md:space-y-4">
              {slides.map((slide, idx) => (
                <div key={slide.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-3 md:p-4 flex flex-col sm:flex-row gap-3 md:gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-full sm:w-24 md:w-32 h-20 sm:h-24 rounded overflow-hidden bg-gray-700">
                    <img
                      src={slide.image_url}
                      alt={`Slide ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23444' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23888' font-size='12'%3EInvalid URL%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="text-white font-medium mb-1 text-sm">Slide #{idx + 1}</h3>
                      {slide.title && <p className="text-violet-300 text-xs md:text-sm font-semibold mb-1">{slide.title}</p>}
                      {slide.description && <p className="text-white/70 text-xs md:text-sm mb-2 line-clamp-2">{slide.description}</p>}
                      <p className="text-white/60 text-xs break-all">{slide.image_url}</p>
                      {slide.watch_url && <p className="text-blue-400 text-xs mt-1">Movie: /movies/{slide.watch_url}</p>}
                    </div>
                    <p className="text-white/40 text-xs">
                      Added: {new Date(slide.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="w-full sm:w-auto px-3 md:px-4 py-2 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 font-medium transition-colors text-xs md:text-sm whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
