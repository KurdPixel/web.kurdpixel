"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";

interface Episode {
  id: string;
  season_number: number;
  episode_number: number;
  title: string;
  video_url: string;
}

interface Series {
  id: string;
  title: string;
  slug: string;
  total_seasons: number;
  tmdb_series_id?: number;
}

export default function SeriesEpisodesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [series, setSeries] = useState<Series | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/series`);
      const allSeries = await res.json();
      const currentSeries = allSeries.find((s: Series) => s.id === id);
      
      if (currentSeries) {
        setSeries(currentSeries);
        // Fetch episodes for this series
        const episodesRes = await fetch(`/api/admin/series/episodes?series_id=${id}`);
        if (episodesRes.ok) {
          const data = await episodesRes.json();
          setEpisodes(data.episodes || []);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!confirm("Are you sure you want to delete this episode?")) return;
    try {
      const res = await fetch(`/api/admin/series/episodes/${episodeId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setEpisodes(episodes.filter((e) => e.id !== episodeId));
    } catch (err) {
      alert("Error");
    }
  };

  const handleImportAllFromTMDB = async () => {
    if (!series?.tmdb_series_id) {
      alert("This series has no TMDB ID.");
      return;
    }

    if (!confirm("Import all seasons and missing episodes from TMDB?")) return;

    setImporting(true);
    try {
      const res = await fetch("/api/admin/series/episodes/import-tmdb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ series_id: id }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to import episodes");
      }

      await fetchData();
      alert(`Imported ${data.inserted ?? 0} new episodes from TMDB.`);
    } catch (err: any) {
      alert(err.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#121212] pt-32 pb-20">
        <div className="text-center text-gray-400">Loading...</div>
      </main>
    );
  }

  if (!series) {
    return (
      <main className="min-h-screen bg-[#121212] pt-32 pb-20">
        <div className="text-center text-red-400">Series not found</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{series.title}</h1>
            <p className="text-gray-400 text-sm">Episodes</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleImportAllFromTMDB}
              disabled={importing || !series.tmdb_series_id}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? "Importing..." : "Import All Seasons (TMDB)"}
            </button>
            <Link
              href={`/admin/series/${id}/episodes/new`}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
            >
              + New Episode
            </Link>
          </div>
        </div>

        {/* Episodes List */}
        {episodes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No episodes added yet
          </div>
        ) : (
          <div className="space-y-2">
            {episodes
              .sort(
                (a, b) =>
                  a.season_number - b.season_number ||
                  a.episode_number - b.episode_number
              )
              .map((ep) => (
                <div
                  key={ep.id}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/10"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      S{ep.season_number}:E{ep.episode_number} - {ep.title}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {ep.video_url}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteEpisode(ep.id)}
                      className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}
