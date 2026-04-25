"use client";

import React, { useState } from "react";
import TMDBSeriesSearch from "./TMDBSeriesSearch";
import TMDBSeriesCard from "./TMDBSeriesCard";

interface Props {
  onSeriesAdded?: () => void;
}

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
  backdrop_path: string;
  overview: string;
  genres: string[];
  tmdb_series_id: number;
}

export default function AddSeriesModal({ onSeriesAdded }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<TMDBSeries | null>(null);
  const [selectedDetails, setSelectedDetails] =
    useState<TMDBSeriesDetails | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSeriesSelected = (series: TMDBSeries, details: TMDBSeriesDetails) => {
    setSelectedSeries(series);
    setSelectedDetails(details);
  };

  const handleConfirm = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setIsOpen(false);
      setSelectedSeries(null);
      setSelectedDetails(null);
      setShowSuccess(false);
      if (onSeriesAdded) {
        onSeriesAdded();
      }
      window.location.reload();
    }, 2000);
  };

  return (
    <>
      {/* Add Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add New Series
      </button>

      {/* Search Modal */}
      {isOpen && !selectedSeries && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-40 flex items-center justify-center p-4">
          <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Search TMDB Series
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <TMDBSeriesSearch onSeriesSelected={handleSeriesSelected} />
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isOpen && selectedSeries && selectedDetails && !showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-60 flex items-center justify-center p-4">
          <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Add Series Details
              </h2>
              <button
                onClick={() => {
                  setSelectedSeries(null);
                  setSelectedDetails(null);
                }}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <TMDBSeriesCard
              series={selectedSeries}
              details={selectedDetails}
              onConfirm={handleConfirm}
            />
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-100 flex items-center justify-center p-4">
          <div className="bg-linear-to-br from-green-900/30 to-emerald-900/30 border border-green-500/50 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-200 mb-2">
              Series Added Successfully!
            </h3>
            <p className="text-green-100/70">
              Your new series has been added and will appear shortly.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
