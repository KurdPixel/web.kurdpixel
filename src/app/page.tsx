"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Trend from "../components/Trend";

interface Slide {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
  watch_url?: string;
  order: number;
}

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch slides from database
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("/api/slides");
        if (res.ok) {
          const data: Slide[] = await res.json();
          setSlides(data);
          const urls = data.map((slide) => slide.image_url);
          setImages(urls);
        }
      } catch (err) {
        console.error("Failed to fetch slides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const total = images.length;
  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  // Auto-slide every 10 seconds
  useEffect(() => {
    if (total === 0) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 10000);

    return () => clearInterval(interval);
  }, [total]);

  return (
    <>
      <main className="w-full h-screen flex items-center justify-center bg-[#0f0f0f]">
        {loading || images.length === 0 ? (
          <div className="text-white text-center">Loading...</div>
        ) : (
          <div className="relative w-full h-full">
            <div className="relative h-full overflow-hidden">
              {images.map((src, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    current === idx ? "opacity-100 z-20" : "opacity-0 z-10"
                  }`}
                  style={{ pointerEvents: current === idx ? "auto" : "none" }}
                >
                  <img
                    src={src}
                    className="block w-full h-full object-cover"
                    alt={`Slide ${idx + 1}`}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
              ))}

              {/* ✅ Bottom Bloom (starts solid at bottom, fades up) */}
              <div className="pointer-events-none absolute bottom-0 left-0 z-30 w-full h-78">
                <div
                  className="absolute bottom-0 left-0 w-full h-full"
                  style={{
                    background:
                      "linear-gradient(to top, #121212 0%, rgba(18,18,18,0.9) 30%, rgba(18,18,18,0.6) 55%, rgba(18,18,18,0.3) 75%, transparent 100%)",
                  }}
                />
              </div>

              {/* Slide Info */}
              {slides[current] && (
                <div className="pointer-events-auto absolute bottom-38 left-0 z-30 w-full p-8" dir="rtl">
                  <div className="max-w-6xl mx-auto text-right">
                    {slides[current].title && (
                      <h2 className="text-4xl font-bold text-white mb-3">{slides[current].title}</h2>
                    )}
                    {slides[current].description && (
                      <p className="kurdish-text text-gray-100 font-semibold text-xl mb-6 max-w-2xl">{slides[current].description}</p>
                    )}
                    {slides[current].watch_url && (
                      <Link href={`/movies/${slides[current].watch_url}`} className="inline-block px-8 py-3 rounded-lg opacity-75 hover:opacity-100 bg-violet-600 hover:bg-violet-700 hover:scale-105 text-white font-semibold transition-all duration-300 ease-out">
                        Watch Now
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="absolute top-1/2 left-4 z-40 -translate-y-1/2 cursor-pointer"
              onClick={prev}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 transition-colors">
                <svg
                  className="w-5 h-5 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="m15 19-7-7 7-7"
                  />
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>

            <button
              type="button"
              className="absolute top-1/2 right-4 z-40 -translate-y-1/2 cursor-pointer"
              onClick={next}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 transition-colors">
                <svg
                  className="w-5 h-5 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="m9 5 7 7-7 7"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
        )}
      </main>

      <Trend />
    </>
  );
}
