"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Trend from "../components/Trend";
import Footer from "@/components/Footer";
import { IconPlay } from "@/components/Icons";

export interface Slide {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
  watch_url?: string;
  order: number;
}

export default function HomeClient({ slides }: { slides: Slide[] }) {
  const images = useMemo(() => slides.map((s) => s.image_url), [slides]);
  const [current, setCurrent] = useState(0);

  const total = images.length;

  useEffect(() => {
    if (!total) return;
    const interval = window.setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 10000);
    return () => window.clearInterval(interval);
  }, [total]);

  const currentImage = images[current];

  if (!currentImage) {
    return (
      <main className="w-full h-screen bg-[#0f0f0f] overflow-hidden relative">
        <div className="h-full flex items-center justify-center text-white">
          چاوەڕوانبە...
        </div>
      </main>
    );
  }

  return (
    <>
      {/* ================= HERO ================= */}
      <main className="w-full h-screen bg-[#0f0f0f] overflow-hidden relative">
        <div className="relative w-full h-full">
          {/* BACKGROUND LAYER (decorative) */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src={currentImage}
              alt=""
              fill
              sizes="100vw"
              priority={false}
              className="object-cover scale-110 blur-xl opacity-50 transition-all duration-700"
              draggable={false}
              quality={45}
            />
          </div>

          {/* MAIN SLIDE (LCP) */}
          {images.map((src, idx) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out z-10 ${
                current === idx ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt="Slide"
                fill
                sizes="100vw"
                priority={idx === 0}
                fetchPriority={idx === 0 ? "high" : "auto"}
                className="object-cover"
                draggable={false}
                quality={60}
              />
            </div>
          ))}

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/60 z-20 pointer-events-none" />

          {/* SOFT BLOOM (CSS-only) */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-72 sm:h-80 md:h-96 z-30">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-[#0f0f0f]" />
              <div className="absolute inset-0 opacity-35 blur-2xl bg-[radial-gradient(90%_120%_at_60%_100%,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.06)_28%,rgba(0,0,0,0)_60%)]" />
            </div>
          </div>

          {/* HERO CONTENT */}
          {slides[current] && (
            <div className="absolute inset-0 z-40 flex items-center">
              <div className="w-full flex justify-end px-4 sm:px-6 md:px-10 lg:px-20">
                <div className="w-full flex flex-col items-end text-right">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white w-full">
                    {slides[current].title}
                  </h2>
                  <p className="kurdish-text text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl mt-3 sm:mt-4 md:mt-6 mb-4 sm:mb-5 md:mb-7 max-w-xl w-full">
                    {slides[current].description}
                  </p>
                  <Link
                    href={`/movies/${slides[current].watch_url}`}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition w-fit text-sm sm:text-base"
                  >
                    <IconPlay className="h-5 w-5" />
                    Play
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================= TREND + FOOTER ================= */}
      <div className="relative bg-[#0f0f0f] overflow-hidden">
        {/* CONTINUATION BLOOM — CSS-only */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-full z-10" aria-hidden="true">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-linear-to-b from-[#0f0f0f] via-black/40 to-black/70" />
            <div className="absolute inset-0 opacity-25 blur-3xl bg-[radial-gradient(80%_120%_at_50%_0%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.05)_22%,rgba(0,0,0,0)_55%)]" />
          </div>
        </div>

        <div className="relative z-20">
          <Trend />
        </div>

        <div className="relative z-20">
          <Footer />
        </div>
      </div>
    </>
  );
}

