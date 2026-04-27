"use client";

import React, { useState, useEffect, use } from "react";
import AgeRestrictionModal from "@/components/AgeRestrictionModal";
import Player from "@/components/Player";
import { getImdbIdFromTmdb } from "@/lib/player";

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
  translators?: string[];
  is_18_plus: boolean;
  tmdb_series_id?: number;
  episodes: { [key: number]: Episode[] };
}

export default function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [series, setSeries] = useState<SeriesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [imdbId, setImdbId] = useState<string | null>(null);

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

        const firstSeason = Object.keys(data.episodes).sort((a, b) => parseInt(a) - parseInt(b))[0];
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

  useEffect(() => {
    let isMounted = true;

    async function fetchImdbId() {
      const id = await getImdbIdFromTmdb(series?.tmdb_series_id, "tv");
      if (isMounted) {
        setImdbId(id);
      }
    }

    if (series) {
      fetchImdbId();
    }

    return () => {
      isMounted = false;
    };
  }, [series?.tmdb_series_id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white bg-black">بارکردن...</main>
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

  const translatorsRaw: unknown = (series as any)?.translators;
  const translators: string[] = Array.isArray(translatorsRaw)
    ? translatorsRaw
    : typeof translatorsRaw === "string"
      ? translatorsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  return (
    <>
      <AgeRestrictionModal isOpen={showAgeModal} onConfirm={handleAgeConfirm} />

      <main className="min-h-screen relative overflow-hidden text-white">
        <div className="fixed inset-0 -z-20">
          <img src={series.cover_image_url} className="w-full h-full object-cover scale-110" draggable={false} />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="fixed inset-0 -z-10">
          <img
            src={series.cover_image_url}
            className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
            draggable={false}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-24 sm:pt-28 md:pt-32 pb-12 md:pb-20">
          <div className="flex flex-col md:flex-row-reverse gap-4 md:gap-6 mb-8 md:mb-10">
            <img
              src={series.cover_image_url}
              alt={series.title}
              loading="eager"
              className="w-full sm:w-56 md:w-64 rounded-lg shadow-lg object-cover hover:scale-105 transition mx-auto md:mx-0"
              draggable={false}
            />

            <div className="flex-1 space-y-3 md:space-y-4 text-right">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 md:justify-end flex-wrap">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{series.title}</h1>

                {series.is_18_plus && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm flex-shrink-0">+18</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 md:justify-end">
                {series.tmdb_rating && (
                  <div className="px-3 md:px-4 py-2 rounded-lg bg-[#01b4e4]/15 backdrop-blur border border-[#01b4e4]/35 text-xs md:text-sm text-[#8fe6ff]">
                    TMDB: <span className="font-bold text-white">{series.tmdb_rating}</span>
                  </div>
                )}

                <div className="px-3 md:px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-xs md:text-sm">
                  وەرزەکان: {series.total_seasons}
                </div>

                {series.language && (
                  <div className="px-3 md:px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-xs md:text-sm">
                    زمان: {series.language}
                  </div>
                )}
              </div>

              {series.description && (
                <p className="text-gray-300 text-sm md:text-base bg-white/5 backdrop-blur-md border border-white/10 p-3 md:p-4 rounded-lg">
                  {series.description}
                </p>
              )}

              {series.tags && (
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {series.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-100 text-xs md:text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {translators.length > 0 && (
                <div className="flex flex-wrap gap-2 md:justify-end mt-2">
                  {translators.map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs md:text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedEpisode && (
            <div className="mb-8 md:mb-10">
              <Player
                imdbId={imdbId}
                mediaType="tv"
                season={selectedEpisode.season_number}
                episode={selectedEpisode.episode_number}
              />
            </div>
          )}

          <div className="mb-4 md:mb-6 text-right">
            <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3">وەرزەکان</h3>

            <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-2 justify-end">
              {seasons.map((season) => (
                <button
                  key={season}
                  onClick={() => handleSeasonChange(season)}
                  className={`px-3 sm:px-4 py-1 md:py-2 rounded-lg text-sm md:text-base transition ${
                    selectedSeason === season ? "bg-violet-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2 md:gap-3">
            {episodes.map((ep) => (
              <button
                key={ep.id}
                onClick={() => handleEpisodeSelect(ep)}
                className={`p-2 md:p-3 rounded-lg text-right border text-xs md:text-sm transition ${
                  selectedEpisode?.id === ep.id ? "bg-violet-500/30 border-violet-500" : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
              >
                <div>{ep.title}</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

