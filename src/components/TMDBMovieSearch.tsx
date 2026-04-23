"use client";

import React, { useState, useCallback } from "react";
import TMDBMovieCard from "./TMDBMovieCard";

interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  rating: number;
  poster_path: string | null;
  overview: string;
  vote_count: number;
}

interface Props {
  onMovieSelected: (movieData: any) => void;
  onCancel: () => void;
}

export default function TMDBMovieSearch({ onMovieSelected, onCancel }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) {
        setError("Please enter a movie name");
        return;
      }

      setLoading(true);
      setError(null);
      setResults([]);

      try {
        const res = await fetch(
          `/api/search-tmdb?query=${encodeURIComponent(searchQuery)}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Search failed");
        }

        setResults(data.results || []);
        if (!data.results || data.results.length === 0) {
          setError("No movies found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to search movies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery]
  );

  const handleMovieClick = async (movie: TMDBMovie) => {
    setSelectedMovie(movie);
    setLoadingDetails(true);
    setError(null);

    try {
      const res = await fetch(`/api/movies-tmdb?id=${movie.id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load movie details");
      }

      setSelectedMovieDetails(data);
      setLoadingDetails(false);
    } catch (err: any) {
      setError(err.message || "Failed to load movie details");
      console.error(err);
      setLoadingDetails(false);
    }
  };

  // Show movie card if selected and details loaded
  if (selectedMovie && selectedMovieDetails && !loadingDetails) {
    return (
      <TMDBMovieCard
        movie={selectedMovie}
        details={selectedMovieDetails}
        onConfirm={onMovieSelected}
        onBack={() => {
          setSelectedMovie(null);
          setSelectedMovieDetails(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a movie..."
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
          <svg className="absolute right-3 top-3.5 w-5 h-5 text-white/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Searching...
            </>
          ) : (
            "Search"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/20"
        >
          Cancel
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="w-8 h-8 animate-spin text-violet-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-white/60">Searching TMDB...</p>
          </div>
        </div>
      )}

      {/* Loading Details State */}
      {selectedMovie && loadingDetails && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="w-8 h-8 animate-spin text-violet-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-white/60">Loading movie details...</p>
          </div>
        </div>
      )}

      {/* Search Results */}
      {!loading && results.length > 0 && !selectedMovie && (
        <div>
          <p className="text-white/60 text-sm mb-4">
            Found {results.length} results. Click on a movie to continue.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                className="group relative rounded-lg overflow-hidden hover:ring-2 hover:ring-violet-500 transition-all"
              >
                {/* Poster */}
                <div className="aspect-2/3 rounded-lg overflow-hidden bg-white/10">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-linear-to-br from-white/10 to-white/5 flex items-center justify-center ${movie.poster_path ? "hidden" : ""}`}>
                    <span className="text-white/40 text-center px-2">
                      No Image
                    </span>
                  </div>
                </div>

                {/* Info Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-end p-3">
                  <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-yellow-400 font-medium">
                      ★ {movie.rating.toFixed(1)}
                    </span>
                    {movie.release_date && (
                      <span className="text-white/60">
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && !error && searchQuery && (
        <div className="text-center py-12">
          <p className="text-white/60">
            Press search to find movies, or try a different query
          </p>
        </div>
      )}

      {!loading && results.length === 0 && !error && !searchQuery && (
        <div className="text-center py-12 text-white/40">
          <p>Enter a movie name and search to begin</p>
        </div>
      )}
    </div>
  );
}
