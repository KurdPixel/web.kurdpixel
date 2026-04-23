"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Movie {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string;
  video_url: string;
}

export default function MoviesList({
  movies,
  onDelete,
}: {
  movies: Movie[] | null;
  onDelete: (formData: FormData) => void;
}) {
  const moviesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  if (!movies || movies.length === 0) {
    return <div className="text-white/60">No movies yet. Add one above!</div>;
  }

  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const currentMovies = movies.slice(startIndex, startIndex + moviesPerPage);

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">
        Current Movies ({movies.length})
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {currentMovies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg overflow-hidden flex flex-col"
          >
            {/* Thumbnail */}
            <div className="w-full h-56">
              <img
                src={movie.thumbnail_url}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23444' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23888' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E";
                }}
                draggable={false}
              />
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col flex-1 justify-between">
              <h3 className="text-white text-sm font-medium line-clamp-2">
                {movie.title}
              </h3>

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/admin/movies/${movie.id}/edit`}
                  className="flex-1 text-center px-2 py-1 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-sm"
                >
                  Edit
                </Link>

                <form action={onDelete} className="flex-1">
                  <input type="hidden" name="id" value={movie.id} />
                  <button
                    type="submit"
                    className="w-full px-2 py-1 rounded bg-red-600/30 hover:bg-red-600/50 text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}