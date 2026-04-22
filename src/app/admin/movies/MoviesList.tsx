"use client";

import React from "react";
import Link from "next/link";

interface Movie {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string;
  video_url: string;
}

export default function MoviesList({ movies, onDelete }: { movies: Movie[] | null, onDelete: (formData: FormData) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">Current Movies ({movies?.length || 0})</h2>

      {!movies || movies.length === 0 ? (
        <div className="text-white/60">No movies yet. Add one above!</div>
      ) : (
        <div className="grid gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4 flex gap-4">
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-24 h-36 rounded overflow-hidden">
                <img
                  src={movie.thumbnail_url}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23444' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23888' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                  draggable={false}
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-medium mb-1">{movie.title}</h3>
                  <p className="text-white/60 text-sm break-all">{movie.video_url}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-2">
                <Link 
                  href={`/admin/movies/${movie.id}/edit`} 
                  className="px-4 py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 font-medium transition-colors"
                >
                  Edit
                </Link>
                <form action={onDelete}>
                  <input type="hidden" name="id" value={movie.id} />
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
