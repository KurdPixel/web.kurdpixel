"use client";

import React, { useState } from "react";

interface TMDBSeries {
  id: number;
  title: string;
  release_date: string;
  rating: number;
  poster_path: string;
  overview: string;
  vote_count: number;
}

interface TMDBSeriesDetails {
  title: string;
  rating: number;
  total_seasons: number;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  genres: string[];
  vote_count: number;
  original_language: string;
  tmdb_series_id: number;
}

interface Props {
  onSeriesSelected?: (series: TMDBSeries, details: TMDBSeriesDetails) => void;
}

export default function TMDBSeriesSearch({ onSeriesSelected }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<TMDBSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<TMDBSeries | null>(null);
  const [selectedSeriesDetails, setSelectedSeriesDetails] =
    useState<TMDBSeriesDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch(
        `/api/search-tmdb-series?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }

      console.log("Searching TMDB for:", searchQuery);
      console.log("TMDB response status:", res.status);
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeriesClick = async (series: TMDBSeries) => {
    setSelectedSeries(series);
    setLoadingDetails(true);
    setError(null);

    try {
      const res = await fetch(`/api/series-tmdb?id=${series.id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load series details");
      }

      console.log("Fetching TMDB series details for ID:", series.id);
      console.log("TMDB series response status:", res.status);

      setSelectedSeriesDetails(data);
      setLoadingDetails(false);

      // Call parent callback if provided
      if (onSeriesSelected) {
        onSeriesSelected(series, data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load series details");
      console.error(err);
      setLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a TV series..."
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Search Results Grid */}
      {results.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-3">
            Found {results.length} series
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.map((series) => (
              <button
                key={series.id}
                onClick={() => handleSeriesClick(series)}
                disabled={loadingDetails}
                className="group relative rounded-lg overflow-hidden hover:scale-105 transition-transform disabled:opacity-50"
              >
                <img
                  src={
                    series.poster_path
                      ? `https://image.tmdb.org/t/p/w300${series.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={series.title}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-colors flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm mb-2">
                      {series.title}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-cyan-400">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0L5.37 17.85c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L1.373 7.39c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69L9.05 2.927z" />
                      </svg>
                      <span className="text-xs">{series.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8 text-gray-400">
          Searching series...
        </div>
      )}

      {loadingDetails && (
        <div className="text-center py-8 text-gray-400">
          Loading series details...
        </div>
      )}

      {!loading && results.length === 0 && searchQuery && (
        <div className="text-center py-8 text-gray-400">
          No series found. Try a different search.
        </div>
      )}
    </div>
  );
}
