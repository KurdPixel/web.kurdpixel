"use client";

import React from "react";
import Link from "next/link";

interface Series {
  id: string;
  title: string;
  slug: string;
  cover_image_url?: string;
  thumbnail_url?: string;
  total_seasons?: number;
  tmdb_rating?: number;
}

export default function SeriesCard({ series }: { series: Series }) {
  return (
    <Link href={`/series/${series.slug}`} className="block group w-full">
      <div className="relative bg-white/5 rounded-xl border border-gray-800 hover:border-violet-500 overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300">
        
        {/* Image */}
        <div className="relative w-full aspect-2/3 overflow-hidden">
          <img
            src={series.cover_image_url || series.thumbnail_url}
            alt={series.title}
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/50 brightness-90 opacity-0 group-hover:opacity-100 transition duration-300 px-2">
            
            <p className="text-sm font-semibold text-white line-clamp-2">
              {series.title}
            </p>

            {series.total_seasons && (
              <p className="text-xs text-gray-300 mt-1">
                {series.total_seasons} Season{series.total_seasons !== 1 ? 's' : ''}
              </p>
            )}

            {series.tmdb_rating && (
              <div className="mt-2 flex items-center gap-1 bg-black/40 border border-white/10 text-white font-bold px-2 py-1 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.690h4.178c.969 0 1.371 1.240.588 1.810l-3.380 2.455a1 1 0 00-.364 1.118l1.286 3.966c.300.921-.755 1.688-1.540 1.118l-3.380-2.455a1 1 0 00-1.176 0L5.370 17.850c-.784.570-1.838-.197-1.540-1.118l1.286-3.966a1 1 0 00-.364-1.118L1.373 7.390c-.783-.570-.380-1.810.588-1.810h4.178a1 1 0 00.950-.690L9.050 2.927z" />
                </svg>
                <span>{series.tmdb_rating.toFixed(1)}</span>
              </div>
            )}
            
          </div>

        </div>
      </div>
    </Link>
  );
}
