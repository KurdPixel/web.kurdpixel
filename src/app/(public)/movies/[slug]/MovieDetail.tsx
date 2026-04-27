"use client";

import React, { useState, useEffect } from "react";
import AgeRestrictionModal from "@/components/AgeRestrictionModal";
import Player from "@/components/Player";
import { getImdbIdFromTmdb } from "@/lib/player";

type Props = {
  movie: any;
};

export default function MovieDetail({ movie }: Props) {
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [viewsDisplay, setViewsDisplay] = useState("—");
  const [imdbId, setImdbId] = useState<string | null>(null);

  const translators: string[] = Array.isArray(movie?.translators)
    ? movie.translators
    : typeof movie?.translators === "string"
      ? movie.translators
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

  useEffect(() => {
    if (movie.is_18_plus && !hasConfirmed) {
      setShowAgeModal(true);
    }
  }, [movie.is_18_plus, hasConfirmed]);

  useEffect(() => {
    setViewsDisplay(movie.views ?? "—");
  }, [movie.views]);

  useEffect(() => {
    let isMounted = true;

    async function fetchImdbId() {
      const id = await getImdbIdFromTmdb(movie.tmdb_movie_id, "movie");
      if (isMounted) {
        setImdbId(id);
      }
    }

    fetchImdbId();

    return () => {
      isMounted = false;
    };
  }, [movie.tmdb_movie_id]);

  const handleAgeConfirm = () => {
    setShowAgeModal(false);
    setHasConfirmed(true);
  };

  return (
    <>
      <AgeRestrictionModal isOpen={showAgeModal} onConfirm={handleAgeConfirm} />

      <main className="min-h-screen relative overflow-hidden text-white">
        <div className="fixed inset-0 -z-10">
          <img src={movie.thumbnail_url} className="w-full h-full object-cover scale-110" draggable={false} />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="fixed inset-0 -z-10">
          <img
            src={movie.thumbnail_url}
            className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
            draggable={false}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-24 sm:pt-28 md:pt-32 pb-12 md:pb-20">
          <div className="flex flex-col md:flex-row-reverse gap-4 md:gap-6 mb-6 md:mb-8">
            <img
              src={movie.thumbnail_url}
              alt={movie.title}
              loading="eager"
              className="w-full sm:w-56 md:w-64 rounded-lg shadow-lg object-cover hover:scale-105 transition mx-auto md:mx-0"
              draggable={false}
            />

            <div className="flex-1 space-y-3 md:space-y-4 text-right">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 md:justify-end flex-wrap">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{movie.title}</h1>

                {movie.is_18_plus && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm flex-shrink-0">+18</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 md:justify-end">
                <div className="px-3 md:px-4 py-2 rounded-lg bg-[#01b4e4]/15 backdrop-blur border border-[#01b4e4]/35 text-xs md:text-sm text-[#8fe6ff]">
                  TMDB: <span className="font-bold text-white">{movie.tmdb_rating}</span>
                </div>

                <div className="px-3 md:px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-xs md:text-sm">
                  بینەر: {viewsDisplay}
                </div>

                <div className="px-3 md:px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-xs md:text-sm">
                  زمان: {movie.language}
                </div>

                <div className="px-3 md:px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-xs md:text-sm">
                  ماوە: {movie.duration_minutes} خولەک
                </div>
              </div>

              <p className="kurdish-text text-gray-200 text-sm md:text-base bg-white/5 backdrop-blur-md border border-white/10 p-3 md:p-4 rounded-lg">
                {movie.description}
              </p>

              <div className="flex flex-wrap gap-2 md:justify-end">
                {movie.tags?.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-100 text-xs md:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

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

          <Player imdbId={imdbId} mediaType="movie" />
        </div>
      </main>
    </>
  );
}

