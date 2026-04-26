"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Trend from "../components/Trend";
import Footer from "@/components/Footer";

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
            {/* BLURRED BACKGROUND LAYER (optimized) */}
            <div className="absolute inset-0 z-0">
              <Image
                src={currentImage}
                alt="Background"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1350px"
                priority
                className="object-cover scale-110 blur-xl opacity-50 transition-all duration-700"
                draggable={false}
                quality={60}
              />
            </div>

            {/* MAIN SLIDE (LCP) */}
            {images.map((src, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out z-10 ${current === idx ? "opacity-100" : "opacity-0"}`}
              >
                <Image
                  src={src}
                  alt="Slide"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1350px"
                  priority={idx === 0}
                  className="object-cover"
                  draggable={false}
                  quality={60}
                />
              </div>
            ))}

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/60 z-20 pointer-events-none" />

            {/* SOFT BLOOM (single layer, optimized) */}
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-72 sm:h-80 md:h-96 z-30">
              <div className="relative w-full h-full">
                <Image
                  src={currentImage}
                  alt="Bloom"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1350px"
                  className="object-cover blur-lg opacity-25 scale-110 transition-all duration-700"
                  draggable={false}
                  quality={60}
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-[#0f0f0f]" />
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
                      <span className="material-symbols-rounded text-[18px] sm:text-[20px]">
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

      {/* ================= TREND + FOOTER ================= */}
      <div className="relative bg-[#0f0f0f] overflow-hidden">
        {/* CONTINUATION BLOOM — covers trend AND footer, single layer */}
        {currentImage && (
          <div className="pointer-events-none absolute top-0 left-0 w-full h-full z-10">
            <div className="relative w-full h-full">
              <Image
                src={currentImage}
                alt="Trend Bloom"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1350px"
                className="object-cover blur-lg opacity-20 scale-110 transition-all duration-700"
                draggable={false}
                quality={60}
              />
              <div className="absolute inset-0 bg-linear-to-b from-[#0f0f0f] via-black/40 to-black/70" />
            </div>
          </div>
        )}

        <div className="relative z-20">
          <Trend />
        </div>

        {/* Footer sits inside bloom — bg-transparent lets bloom show through */}
        <div className="relative z-20">
          <Footer />
        </div>
      </div>
    </>
  );
}