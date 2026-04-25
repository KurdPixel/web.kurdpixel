"use client";

import React, { useState, useEffect, use } from "react";
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

export default function SeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

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
        const res = await fetch(`/api/series/${slug}`);
        if (!res.ok) throw new Error("Series not found");

        const data: SeriesDetail = await res.json();
        setSeries(data);

        if (data.is_18_plus && !hasConfirmed) {
          setShowAgeModal(true);
        }

        const firstSeason = Object.keys(data.episodes)
          .sort((a, b) => parseInt(a) - parseInt(b))[0];

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
  }, [slug, hasConfirmed]);

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
      <main className="min-h-screen flex items-center justify-center text-white bg-black">
        بارکردن...
      </main>
    );
  }

  if (error || !series) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-400 bg-black">
        {error || "Series not found"}
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

      {/* ================= PAGE ================= */}
      <main className="min-h-screen relative overflow-hidden text-white">

        {/* 🌑 CINEMATIC BACKGROUND */}
        <div className="fixed inset-0 -z-20">
          <img
            src={series.cover_image_url}
            className="w-full h-full object-cover scale-110"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* 🌫️ SOFT BLOOM LAYER */}
        <div className="fixed inset-0 -z-10">
          <img
            src={series.cover_image_url}
            className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
            draggable={false}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">

          {/* ================= HEADER (MATCH MOVIE STYLE) ================= */}
          <div className="flex flex-col md:flex-row-reverse gap-6 mb-10">

            {/* POSTER RIGHT SIDE */}
            <img
              src={series.cover_image_url}
              className="w-64 rounded-lg shadow-lg object-cover hover:scale-105 transition"
              draggable={false}
            />

            {/* INFO */}
            <div className="flex-1 space-y-4 text-right">

              <div className="flex items-center gap-3 justify-end">
                <h1 className="text-4xl font-bold">{series.title}</h1>

                {series.is_18_plus && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
                    +18
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 justify-end">

                {series.tmdb_rating && (
                  <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-sm">
                    TMDB: {series.tmdb_rating}
                  </div>
                )}

                <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-sm">
                  وەرزەکان: {series.total_seasons}
                </div>

                {series.language && (
                  <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-sm">
                    زمان: {series.language}
                  </div>
                )}
              </div>

              {series.description && (
                <p className="text-gray-300 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-lg">
                  {series.description}
                </p>
              )}

              {series.tags && (
                <div className="flex flex-wrap gap-2 justify-end">
                  {series.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-100 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* ================= PLAYER ================= */}
          {selectedEpisode && (
            <div className="mb-10">
              <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
                <iframe
                  src={selectedEpisode.video_url}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* ================= SEASONS ================= */}
          <div className="mb-6 text-right">
            <h3 className="text-lg font-bold mb-3">وەرزەکان</h3>

            <div className="flex flex-wrap gap-2 justify-end">
              {seasons.map((season) => (
                <button
                  key={season}
                  onClick={() => handleSeasonChange(season)}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedSeason === season
                      ? "bg-violet-500 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>

          {/* ================= EPISODES ================= */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {episodes.map((ep) => (
              <button
                key={ep.id}
                onClick={() => handleEpisodeSelect(ep)}
                className={`p-3 rounded-lg text-right border transition ${
                  selectedEpisode?.id === ep.id
                    ? "bg-violet-500/30 border-violet-500"
                    : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
              >
                <div className="text-sm">{ep.title}</div>
              </button>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}