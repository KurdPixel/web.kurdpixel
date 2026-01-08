import React from "react";
import supabase from "../../../lib/supabaseClient";
import { notFound } from "next/navigation";

// This page expects a dynamic slug param
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Fetch movie data from Supabase
  const { slug } = await params;
  const { data: movie, error } = await supabase
    .from("movies")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!movie || error) {
    notFound();
  }

  // Only use Vidmoly player, movie.video_url is the full embed URL
  const vidmolyEmbed = movie.video_url;

  // Try to fetch view count from Vidmoly (server-side). Fallback to movie.views if available.
  async function fetchViewsFromVidmoly(url: string) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 60 } });
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

  const rawViews = await fetchViewsFromVidmoly(vidmolyEmbed);
  const viewsDisplay = rawViews ?? (movie.views ? String(movie.views) : "—");

  return (

    <main className="min-h-screen pt-46 relative overflow-hidden" dir="rtl">
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

      <div className="max-w-6xl mx-auto p-4 text-right">
        <div className="flex flex-col pb-38 md:flex-row gap-6 mb-6">
          <img
            src={movie.thumbnail_url}
            alt={movie.title}
            className="w-60 .aspect-[9/16] object-cover rounded-lg shadow"
            draggable={false}
          />
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-6">{movie.title}</h1>
            <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 rounded-lg bg-yellow-500 backdrop-blur-lg border border-white/10 text-white text-sm">
              <b className="text-black">IMDb:</b> {movie.imdb_rating}
            </div>
            <div className="px-4 py-2 rounded-lg bg-black/30 backdrop-blur-lg border border-white/10 text-white text-sm">
              <b>Views:</b> {viewsDisplay}
            </div>
            <div className="px-4 py-2 rounded-lg bg-black/30 backdrop-blur-lg border border-white/10 text-white text-sm">
              <b>زمان:</b> {movie.language}
            </div>
            <div className="px-4 py-2 rounded-lg bg-black/30 backdrop-blur-lg border border-white/10 text-white text-sm">
              <b>ماوە:</b> {movie.duration_minutes} خولەک
            </div>
            </div>
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white">{movie.description}</div>
            <div className="flex flex-wrap gap-2">
            {movie.tags?.map((tag: string, idx: number) => (
            <span key={idx} className="px-3 py-1 rounded-full bg-violet-500/20 backdrop-blur-lg border border-violet-400/30 text-violet-100 text-sm">{tag}</span>))}
            </div>
            <div><b className="text-white/100">وەرگێرانی:</b> <span className="px-3 py-1 rounded-full bg-violet-600/20 backdrop-blur-lg border border-violet-500/30 text-violet-100 text-sm">{movie.translators?.join("، ")}</span></div>
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
  );
}
