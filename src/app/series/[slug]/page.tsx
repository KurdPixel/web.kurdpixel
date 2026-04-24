"use client";

import React, { useState, useEffect } from "react";
import AgeRestrictionModal from "@/components/AgeRestrictionModal";

interface Episode {
  id: string;
  season_number: number;
  episode_number: number;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  tmdb_rating?: number;
}

interface SeriesDetail {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
  thumbnail_url?: string;
  total_seasons: number;
  tmdb_rating?: number;
  language?: string;
  tags?: string[];
  is_18_plus: boolean;
  episodes: { [key: number]: Episode[] };
}

export default function SeriesDetailPage({ params }: { params: { slug: string } }) {
  const [series, setSeries] = useState<SeriesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/series/${params.slug}`);
        if (!res.ok) {
          throw new Error("Series not found");
        }
        const data: SeriesDetail = await res.json();
        setSeries(data);

        // Set age modal
        if (data.is_18_plus && !hasConfirmed) {
          setShowAgeModal(true);
        }

        // Select first episode
        const firstSeason = Object.keys(data.episodes).sort(
          (a, b) => parseInt(a) - parseInt(b)
        )[0];
        if (firstSeason) {
          setSelectedSeason(parseInt(firstSeason));
          setSelectedEpisode(data.episodes[parseInt(firstSeason)][0]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [params.slug, hasConfirmed]);

  const handleAgeConfirm = () => {
    setShowAgeModal(false);
    setHasConfirmed(true);
  };

  const handleSeasonChange = (season: number) => {
    setSelectedSeason(season);
    if (series?.episodes[season]?.[0]) {
      setSelectedEpisode(series.episodes[season][0]);
    }
  };

  const handleEpisodeSelect = (episode: Episode) => {
    setSelectedEpisode(episode);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#121212] pt-32 flex items-center justify-center">
        <div className="text-gray-400">بارکردن...</div>
      </main>
    );
  }

  if (error || !series) {
    return (
      <main className="min-h-screen bg-[#121212] pt-32 flex items-center justify-center">
        <div className="text-red-400">{error || "Series not found"}</div>
      </main>
    );
  }

  const episodes = series.episodes[selectedSeason] || [];
  const seasons = Object.keys(series.episodes)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <>
      <AgeRestrictionModal
        isOpen={showAgeModal}
        onConfirm={handleAgeConfirm}
      />

      <main className="min-h-screen bg-[#121212] pt-32 pb-20" dir="rtl">
        {/* Background */}
        <div
          className="absolute inset-0 -z-20 w-full h-full"
          style={{
            backgroundImage: `url(${series.cover_image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(16px) scale(1.05)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10 w-full h-full"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.0) 90%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <img
              src={series.cover_image_url}
              alt={series.title}
              className="w-48 rounded-lg shadow-lg"
              draggable={false}
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold">{series.title}</h1>
                {series.is_18_plus && (
                  <span className="bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-sm">
                    +18
                  </span>
                )}
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap gap-3 mb-4">
                {series.tmdb_rating && (
                  <div className="px-4 py-2 rounded-lg bg-cyan-500 backdrop-blur-lg border border-white/10 text-white text-sm">
                    <b className="text-black">TMDB:</b> {series.tmdb_rating}
                  </div>
                )}
                <div className="px-4 py-2 rounded-lg bg-black/30 backdrop-blur-lg border border-white/10 text-white text-sm">
                  <b>فصلەکان:</b> {series.total_seasons}
                </div>
                {series.language && (
                  <div className="px-4 py-2 rounded-lg bg-black/30 backdrop-blur-lg border border-white/10 text-white text-sm">
                    <b>زمان:</b> {series.language}
                  </div>
                )}
              </div>

              {/* Description */}
              {series.description && (
                <p className="text-gray-300 mb-4">{series.description}</p>
              )}

              {/* Tags */}
              {series.tags && series.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {series.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-100 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Video Player */}
          {selectedEpisode && (
            <div className="mb-12">
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <iframe
                  src={selectedEpisode.video_url}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="w-full h-full border-0"
                  title="Vidmoly Player"
                />
              </div>

              {/* Episode Info */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-bold mb-2">
                  S{selectedEpisode.season_number}:E{selectedEpisode.episode_number} -{" "}
                  {selectedEpisode.title}
                </h2>
                {selectedEpisode.description && (
                  <p className="text-gray-300">{selectedEpisode.description}</p>
                )}
                {selectedEpisode.tmdb_rating && (
                  <div className="mt-2 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-cyan-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0L5.37 17.85c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L1.373 7.39c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69L9.05 2.927z" />
                    </svg>
                    <span>{selectedEpisode.tmdb_rating}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seasons and Episodes */}
          <div>
            {/* Season Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">فصلەکان</h3>
              <div className="flex flex-wrap gap-2">
                {seasons.map((season) => (
                  <button
                    key={season}
                    onClick={() => handleSeasonChange(season)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedSeason === season
                        ? "bg-violet-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    فصل {season}
                  </button>
                ))}
              </div>
            </div>

            {/* Episodes Grid */}
            <div>
              <h3 className="text-lg font-bold mb-3">
                بەشەکان (فصل {selectedSeason})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {episodes.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => handleEpisodeSelect(ep)}
                    className={`p-3 rounded-lg transition-all border ${
                      selectedEpisode?.id === ep.id
                        ? "bg-violet-500/30 border-violet-500"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">
                      بەشی {ep.episode_number}
                    </div>
                    <div className="text-xs text-gray-400">{ep.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
