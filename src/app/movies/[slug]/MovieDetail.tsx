"use client";

import React, { useState, useEffect } from "react";
import AgeRestrictionModal from "@/components/AgeRestrictionModal";

type Props = {
  movie: any;
};

export default function MovieDetail({ movie }: Props) {
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [viewsDisplay, setViewsDisplay] = useState("—");

  // Show age restriction modal on mount if movie is 18+
  useEffect(() => {
    if (movie.is_18_plus && !hasConfirmed) {
      setShowAgeModal(true);
    }
  }, [movie.is_18_plus, hasConfirmed]);

  // Fetch views from Vidmoly
  useEffect(() => {
    async function fetchViewsFromVidmoly(url: string) {
      try {
        const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (!res.ok) return null;
        const html = await res.text();

        const patterns = [
          /([\d.,\s]+)\s*(?:views|Views|View)/i,
          />\s*([\d.,\s]+)\s*views\s*</i,
          /<span[^>]*class=["'][^"']*views[^"']*["'][^>]*>\s*([\d.,\s]+)\s*<\//i,
          /مشاهدة(?:ات)?\s*[:\s]\s*([\d.,\s]+)/i
        ];

        for (const p of patterns) {
          const m = html.match(p);
          if (m && m[1]) return m[1].trim();
        }

        const near = html.match(/(views)[^0-9]{0,10}([\d.,\s]{1,20})/i) || html.match(/([\d.,\s]{1,20})[^0-9]{0,10}(views)/i);
        if (near && near[2]) return near[2].trim();
        if (near && near[1] && !isNaN(Number(near[1].replace(/[.,\s]/g, '')))) return near[1].trim();

        return null;
      } catch (e) {
        return null;
      }
    }

    fetchViewsFromVidmoly(movie.video_url).then((views) => {
      setViewsDisplay(views ?? (movie.views ? String(movie.views) : "—"));
    });
  }, [movie.video_url, movie.views]);

  const handleAgeConfirm = () => {
    setShowAgeModal(false);
    setHasConfirmed(true);
  };

  const vidmolyEmbed = movie.video_url;

  return (
    <>
      <AgeRestrictionModal isOpen={showAgeModal} onConfirm={handleAgeConfirm} />

      <main className="min-h-screen pt-46 relative overflow-hidden flex flex-col items-center md:items-start" dir="rtl">
        {/* Blurred thumbnail background */}
        <div
          className="absolute inset-0 -z-20 w-full h-full"
          style={{
            backgroundImage: `url(${movie.thumbnail_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(16px) scale(1.05)',
            transform: 'scale(1.05)',
          }}
          aria-hidden="true"
        ></div>
        {/* Big black gradient bloom from bottom */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 w-full h-full"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.0) 90%)"
          }}
          aria-hidden="true"
        ></div>
        {/* Black gradient bloom from top */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 w-full h-full"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.0) 70%)"
          }}
          aria-hidden="true"
        ></div>

        <div className="max-w-6xl mx-auto p-4 text-right w-full md:w-auto">
          <div className="flex flex-col pb-38 md:flex-row gap-6 mb-6">
            <img
              src={movie.thumbnail_url}
              alt={movie.title}
              className="w-60 .aspect-[9/16] object-cover rounded-lg shadow"
              draggable={false}
            />
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <h1 className="text-3xl font-bold mb-6">{movie.title}</h1>
                {movie.is_18_plus && (
                  <span className="bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-sm mt-1">+18</span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-lg bg-cyan-500 backdrop-blur-lg border border-white/10 text-white text-sm">
                  <b className="text-black">TMDB:</b> {movie.tmdb_rating}
                </div>
                <div className="px-4 py-2 rounded-lg bg-black/30 backdrop-blur-lg border border-white/10 text-white text-sm">
                  <b className="kurdish-text">بینەر:</b> {viewsDisplay}
                </div>
                <div className="px-4 py-2 rounded-lg bg-black/30 backdrop-blur-lg border border-white/10 text-white text-sm">
                  <b className="kurdish-text">زمان:</b> {movie.language}
                </div>
                <div className="px-4 py-2 rounded-lg bg-black/30 backdrop-blur-lg border border-white/10 text-white text-sm">
                  <b className="kurdish-text">ماوە:</b> {movie.duration_minutes} خولەک
                </div>
              </div>
              <div className="kurdish-text p-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white">{movie.description}</div>
              <div className="flex flex-wrap gap-2">
                {movie.tags?.map((tag: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-violet-500/20 backdrop-blur-lg border border-violet-400/30 text-violet-100 text-sm">{tag}</span>
                ))}
              </div>
              <div><b className="kurdish-text">وەرگێرانی:</b> <span className="px-3 py-1 rounded-full bg-violet-600/20 backdrop-blur-lg border border-violet-500/30 text-violet-100 text-sm">{movie.translators?.join("، ")}</span></div>
            </div>
          </div>
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={vidmolyEmbed}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full border-0"
              title="Vidmoly Player"
            />
          </div>
        </div>
      </main>
    </>
  );
}
