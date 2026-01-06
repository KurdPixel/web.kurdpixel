"use client";
import React, { useState } from "react";


const images = [
  "https://images.thedirect.com/media/article_full/spider-man-no-way-home-posters.jpg",
  "https://snworksceo.imgix.net/ame-egl/71b1929c-0c30-475b-9287-c2adec9fb164.sized-1000x1000.jpeg?w=800&dpr=2&ar=16%3A9&fit=crop&crop=faces",
  "https://mir-s3-cdn-cf.behance.net/project_modules/fs/62071096474123.5eaf65302480b.png",
  "https://www.tallengestore.com/cdn/shop/products/Fast_Furious_-_Vin_Diesel_-_Dwayne_Rock_Johnson_-_Hollywood_Action_Movie_Poster_4d33a269-2e9d-46cb-af8b-eb095fd1cc08.jpg?v=1582542919",
  "https://w0.peakpx.com/wallpaper/269/249/HD-wallpaper-stranger-things-season-2-tv-series-2017-movie-poster-stranger-things-2.jpg",
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
                <img src={src} className="block w-full h-full object-cover" alt={`Slide ${idx + 1}`} />
              </div>
            ))}
          </div>

          {/* Black bloom / shadow rising from bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 md:h-1/4 pointer-events-none z-[25] bg-gradient-to-t from-black/80 to-transparent blur-3xl opacity-90" />

          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`w-3 h-3 rounded-full ${current === idx ? "bg-white/80" : "bg-white/30"}`}
                aria-current={current === idx}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => goTo(idx)}
              />
            ))}
          </div>

          <button
            type="button"
            className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
            onClick={prev}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
              <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m15 19-7-7 7-7" />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>

          <button
            type="button"
            className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
            onClick={next}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
              <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m9 5 7 7-7 7" />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>
      </main>
    </>
  );
}
