"use client";

import React, { useState } from "react";
import Trend from "../components/Trend";

const images = [
  "https://4kwallpapers.com/images/walls/thumbs_3t/21613.jpg",
  "https://4kwallpapers.com/images/walls/thumbs_3t/10148.jpg",
  "https://4kwallpapers.com/images/walls/thumbs_3t/24522.jpg",
  "https://1.vikiplatform.com/c/41238c/2fb66c5c74.jpg?x=b",
  "https://i0.wp.com/movizark.com/wp-content/uploads/2025/10/Ek-Deewane-Ki-Deewaniyat.jpg?resize=1500%2C768&ssl=1",
  "https://www.framerated.co.uk/frwpcontent/uploads/2025/11/frankenstein2025_01.jpg",
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const goTo = (idx: number) => setCurrent(idx);
  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <>
      <main className="w-full h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="relative w-full h-full">
          <div className="relative h-full overflow-hidden">
            {images.map((src, idx) => (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  current === idx ? "opacity-100 z-20" : "opacity-0 z-10"
                }`}
                style={{ pointerEvents: current === idx ? "auto" : "none" }}
              >
                <img
                  src={src}
                  className="block w-full h-full object-cover"
                  alt={`Slide ${idx + 1}`}
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
          </div>

          <button
            type="button"
            className="absolute top-0 left-0 z-40 flex items-center justify-center h-full px-4 cursor-pointer"
            onClick={prev}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50">
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
            className="absolute top-0 right-0 z-40 flex items-center justify-center h-full px-4 cursor-pointer"
            onClick={next}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50">
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
      </main>

      <Trend />
    </>
  );
}
