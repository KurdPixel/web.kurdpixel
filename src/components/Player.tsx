"use client";

import React, { useEffect, useMemo, useState } from "react";
import { buildSuperEmbedUrl } from "@/lib/player";

type Props = {
  imdbId: string | null;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
};

export default function Player({ imdbId, mediaType, season, episode }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  const superEmbedUrl = useMemo(() => {
    if (mediaType === "movie") {
      return buildSuperEmbedUrl(imdbId);
    }
    return buildSuperEmbedUrl(imdbId, season, episode);
  }, [episode, imdbId, mediaType, season]);

  const currentSrc = superEmbedUrl;

  useEffect(() => {
    if (!currentSrc) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
  }, [currentSrc]);

  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-video bg-black rounded-lg md:rounded-xl overflow-hidden shadow-xl">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
            <div className="w-10 h-10 border-4 border-white/25 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {currentSrc ? (
          <iframe
            key={currentSrc}
            src={currentSrc}
            loading="lazy"
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Player"
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-white/70">
            IMDb ID unavailable for SuperEmbed.
          </div>
        )}
      </div>
    </div>
  );
}
