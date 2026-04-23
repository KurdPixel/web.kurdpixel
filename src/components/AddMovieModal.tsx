"use client";

import React, { useState } from "react";
import TMDBMovieSearch from "./TMDBMovieSearch";

export default function AddMovieModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [movieAdded, setMovieAdded] = useState(false);

  const handleMovieSelected = (movieData: any) => {
    setMovieAdded(true);
    // Show success message for 3 seconds then close and refresh
    setTimeout(() => {
      setIsOpen(false);
      setMovieAdded(false);
      // Refresh the page to show the new movie
      window.location.reload();
    }, 2000);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Add Movie Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="mb-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add New Movie
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={handleCancel}
        />
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-4 md:inset-8 lg:inset-12 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-linear-to-br from-black/95 via-black/90 to-black/95 border border-white/10 shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                {movieAdded ? "✓ Movie Added!" : "Search Movie on TMDB"}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {movieAdded ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-white text-lg font-semibold mb-2">
                      Movie added successfully!
                    </p>
                    <p className="text-white/60">
                      Refreshing to show your new movie...
                    </p>
                  </div>
                </div>
              ) : (
                <TMDBMovieSearch
                  onMovieSelected={handleMovieSelected}
                  onCancel={handleCancel}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
