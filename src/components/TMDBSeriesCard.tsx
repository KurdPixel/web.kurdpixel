"use client";

import React, { useState, useCallback } from "react";

interface TMDBSeries {
  id: number;
  title: string;
  release_date: string;
  rating: number;
  poster_path: string;
  overview: string;
}

interface TMDBSeriesDetails {
  title: string;
  rating: number;
  total_seasons: number;
  poster_path: string;
  overview: string;
  genres: string[];
  tmdb_series_id: number;
}

interface Episode {
  season_number: number;
  episode_number: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
}

interface Props {
  series: TMDBSeries;
  details: TMDBSeriesDetails;
  onConfirm?: (data: any) => void;
}

export default function TMDBSeriesCard({
  series,
  details,
  onConfirm,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: details.title || "",
    description: details.overview || "",
    thumbnail_url: details.poster_path
      ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
      : "",
    cover_image_url: details.poster_path
      ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
      : "",
    language: "english",
    tags: details.genres || [],
    is_18_plus: false,
    tmdb_rating: details.rating || 0,
    total_seasons: details.total_seasons || 1,
    tmdb_series_id: details.tmdb_series_id,
  });

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [newEpisode, setNewEpisode] = useState({
    season_number: 1,
    episode_number: 1,
    title: "",
    description: "",
    video_url: "",
    thumbnail_url: "",
  });

  const [tagInput, setTagInput] = useState("");

  const handleFormChange = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleAddEpisode = () => {
    if (
      !newEpisode.title ||
      !newEpisode.video_url ||
      !newEpisode.thumbnail_url
    ) {
      alert("Please fill in all episode fields");
      return;
    }

    setEpisodes([...episodes, { ...newEpisode }]);
    setNewEpisode({
      season_number: 1,
      episode_number: episodes.filter((e) => e.season_number === 1).length + 2,
      title: "",
      description: "",
      video_url: "",
      thumbnail_url: "",
    });
  };

  const handleRemoveEpisode = (index: number) => {
    setEpisodes(episodes.filter((_, i) => i !== index));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      const seriesData = {
        ...formData,
        slug,
        episodes: episodes.length > 0 ? episodes : [],
      };

      const res = await fetch("/api/admin/series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seriesData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add series");
      }

      const result = await res.json();
      if (onConfirm) {
        onConfirm(result);
      }
    } catch (err: any) {
      console.error("Error adding series:", err);
      alert(err.message || "Failed to add series");
    } finally {
      setLoading(false);
    }
  };

  const availableSeasons = Array.from(
    { length: details.total_seasons },
    (_, i) => i + 1
  );

  const getEpisodesForSeason = (seasonNumber: number) =>
    episodes.filter((e) => e.season_number === seasonNumber);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Auto-filled Series Info */}
      <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Series Information
        </h3>

        {/* Title - Read Only */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-gray-300">
            Title (Auto-filled)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.title}
              disabled
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm"
            />
            <button
              type="button"
              onClick={() => handleCopy(formData.title)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Rating and Seasons */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              TMDB Rating
            </label>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <svg
                className="w-4 h-4 text-cyan-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0L5.37 17.85c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L1.373 7.39c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69L9.05 2.927z" />
              </svg>
              <span className="text-white font-semibold">
                {formData.tmdb_rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Total Seasons
            </label>
            <input
              type="number"
              value={formData.total_seasons}
              onChange={(e) =>
                handleFormChange("total_seasons", parseInt(e.target.value))
              }
              min={1}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>

        {/* Description - Editable */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              handleFormChange("description", e.target.value)
            }
            rows={4}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
          />
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Thumbnail URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.thumbnail_url}
                onChange={(e) =>
                  handleFormChange("thumbnail_url", e.target.value)
                }
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
              <button
                type="button"
                onClick={() => handleCopy(formData.thumbnail_url)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Cover Image URL
            </label>
            <input
              type="text"
              value={formData.cover_image_url}
              onChange={(e) =>
                handleFormChange("cover_image_url", e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Manual Fields */}
      <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Additional Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) =>
                handleFormChange("language", e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            >
              <option value="english">English</option>
              <option value="kurdish">Kurdish</option>
              <option value="arabic">Arabic</option>
              <option value="turkish">Turkish</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Age Restriction
            </label>
            <div className="flex items-center gap-3 h-10">
              <input
                type="checkbox"
                checked={formData.is_18_plus}
                onChange={(e) =>
                  handleFormChange("is_18_plus", e.target.checked)
                }
                className="w-4 h-4 rounded"
              />
              <span className="text-white text-sm">18+ Only</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onBlur={(e) => {
              if (e.target.value) {
                const newTags = e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter((t) => t);
                handleFormChange(
                  "tags",
                  Array.from(new Set([...formData.tags, ...newTags]))
                );
                setTagInput("");
              }
            }}
            placeholder="Add tags..."
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, i) => (
              <div
                key={i}
                className="px-3 py-1 rounded-full bg-violet-600/30 border border-violet-500/50 text-violet-200 text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    handleFormChange(
                      "tags",
                      formData.tags.filter((_, idx) => idx !== i)
                    )
                  }
                  className="hover:text-violet-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Episodes Management */}
      <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Episodes Management
        </h3>

        {/* Add Episode Form */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Season
              </label>
              <select
                value={newEpisode.season_number}
                onChange={(e) =>
                  setNewEpisode({
                    ...newEpisode,
                    season_number: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              >
                {availableSeasons.map((s) => (
                  <option key={s} value={s}>
                    Season {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Episode Number
              </label>
              <input
                type="number"
                value={newEpisode.episode_number}
                onChange={(e) =>
                  setNewEpisode({
                    ...newEpisode,
                    episode_number: parseInt(e.target.value),
                  })
                }
                min={1}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Episode Title
            </label>
            <input
              type="text"
              value={newEpisode.title}
              onChange={(e) =>
                setNewEpisode({ ...newEpisode, title: e.target.value })
              }
              placeholder="Enter episode title"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Description (Optional)
            </label>
            <textarea
              value={newEpisode.description}
              onChange={(e) =>
                setNewEpisode({ ...newEpisode, description: e.target.value })
              }
              placeholder="Enter episode description"
              rows={2}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Video URL (Required)
              </label>
              <input
                type="text"
                value={newEpisode.video_url}
                onChange={(e) =>
                  setNewEpisode({ ...newEpisode, video_url: e.target.value })
                }
                placeholder="e.g., https://vidmoly.me/..."
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Thumbnail URL (Required)
              </label>
              <input
                type="text"
                value={newEpisode.thumbnail_url}
                onChange={(e) =>
                  setNewEpisode({
                    ...newEpisode,
                    thumbnail_url: e.target.value,
                  })
                }
                placeholder="Enter thumbnail URL"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddEpisode}
            className="w-full px-4 py-2 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg transition-all font-semibold"
          >
            Add Episode
          </button>
        </div>

        {/* Episodes List by Season */}
        {episodes.length > 0 && (
          <div className="space-y-4">
            {availableSeasons.map((season) => {
              const seasonEpisodes = getEpisodesForSeason(season);
              if (seasonEpisodes.length === 0) return null;

              return (
                <div key={season} className="space-y-2">
                  <h4 className="font-semibold text-white text-sm">
                    Season {season}
                  </h4>
                  <div className="space-y-2">
                    {seasonEpisodes.map((ep, idx) => {
                      const episodeIndex = episodes.indexOf(ep);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">
                              Episode {ep.episode_number}: {ep.title}
                            </p>
                            {ep.description && (
                              <p className="text-gray-400 text-xs mt-1">
                                {ep.description}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveEpisode(episodeIndex)
                            }
                            className="ml-4 p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-200 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {episodes.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-4">
            No episodes added yet
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Adding Series..." : "Add Series"}
      </button>
    </form>
  );
}
