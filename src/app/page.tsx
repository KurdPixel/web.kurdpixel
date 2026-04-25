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

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("/api/slides");
        const data: Slide[] = await res.json();
        setSlides(data);
        setImages(data.map((s) => s.image_url));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const total = images.length;

  useEffect(() => {
    if (!total) return;

    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 10000);

    return () => clearInterval(interval);
  }, [total]);

  const currentImage = images[current];

  return (
    <>
      {/* ================= HERO ================= */}
      <main className="w-full h-screen bg-[#0f0f0f] overflow-hidden relative">

        {loading || !currentImage ? (
          <div className="h-full flex items-center justify-center text-white">
            چاوەڕوانبە...
          </div>
        ) : (
          <div className="relative w-full h-full">

            {/* 🌫️ GLOBAL SOFT ATMOSPHERE */}
            <div className="absolute inset-0 z-0">
              <img
                src={currentImage}
                className="w-full h-full object-cover scale-110 blur-3xl opacity-50"
                draggable={false}
              />
            </div>

            {/* MAIN SLIDES */}
            {images.map((src, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out z-10 ${
                  current === idx ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={src}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            ))}

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/60 z-20" />

            {/* ⭐ NEW: SOFT MIXING BLOOM (THE FIX) */}
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-96 z-30">
              <div className="relative w-full h-full">

                {/* blurred continuation of image */}
                <img
                  src={currentImage}
                  className="absolute bottom-0 w-full h-full object-cover blur-2xl opacity-25 scale-110"
                  draggable={false}
                />

                {/* extra soft fade into black */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-[#0f0f0f]" />
              </div>
            </div>

            {/* HERO CONTENT */}
            {slides[current] && (
              <div className="absolute inset-0 z-40 flex items-center">
                <div className="w-full flex justify-end px-10 md:px-20">

                  <div className="w-full flex flex-col items-end text-right">

                    <h2 className="text-5xl md:text-6xl font-bold text-white w-full">
                      {slides[current].title}
                    </h2>

                    <p className="kurdish-text text-gray-200 text-lg md:text-xl mt-4 mb-7 max-w-xl w-full">
                      {slides[current].description}
                    </p>

                    <Link
                      href={`/movies/${slides[current].watch_url}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition w-fit"
                    >
                      <span className="material-symbols-rounded text-[20px]">
                        play_arrow
                      </span>
                      Play
                    </Link>

                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= TREND ================= */}
      <div className="relative bg-[#0f0f0f] overflow-hidden">

        {/* ⭐ SAME CONTINUATION BLOOM (INVERTED FLOW) */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-96 z-10">
          <div className="relative w-full h-full">

            <img
              src={currentImage}
              className="absolute top-0 w-full h-full object-cover blur-2xl opacity-20 scale-110"
              draggable={false}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-black/40 to-transparent" />
          </div>
        </div>

        {/* TREND CONTENT */}
        <div className="relative z-20">
          <Trend />
        </div>

      </div>
    </>
  );
}