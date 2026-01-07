"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Movie = { id: string; title: string; slug: string; thumbnail_url: string };

export default function Trend() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/trend?limit=8")
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {movies?.map((m) => (
            <Link key={m.id} href={`/movies/${m.slug}`} className="block">
              <div className="bg-white/5 w-40 h-56 rounded-lg overflow-hidden shadow hover:scale-105 transform transition">
                <img src={m.thumbnail_url} alt={m.title} className="w-full h-full object-cover" />
                <div className="p-2 text-sm font-semibold text-right">{m.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}