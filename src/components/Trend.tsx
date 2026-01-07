"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Movie = { id: string; title: string; slug: string; thumbnail_url: string };

export default function Trend() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/trend?limit=12")
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return;
        setMovies(j.data ?? []);
      })
      .catch(() => mounted && setMovies([]))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <section dir="rtl" className="bg-[#121212] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-xl font-bold mb-4">نوێترین فیلمەکان</h3>
        {loading && <div className="text-sm text-gray-400">هەڵگرتن...</div>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {movies?.slice(0, 12).map((m) => (
            <Link key={m.id} href={`/movies/${m.slug}`} className="block">
              <div className="bg-white/5 rounded-lg border-[0.5px] hover:border-[0.1px] border-gray-800 hover:border-violet-500 overflow-hidden shadow-sm hover:scale-105 transform transition duration-200">
                <img src={m.thumbnail_url} alt={m.title} className="w-full h-40 sm:h-48 md:h-56 object-cover" draggable={false} onDragStart={(e) => e.preventDefault()} />
                <div className="p-2 text-sm font-semibold text-center truncate">{m.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}