"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CardGridSkeleton from "./CardGridSkeleton";

type Series = {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string;
  tmdb_rating?: number;
};

export default function TrendSeries() {
  const isValidImageSrc = (src: unknown): src is string => {
    return (
      typeof src === "string" &&
      src.length > 0 &&
      (src.startsWith("/") || src.startsWith("https://") || src.startsWith("http://"))
    );
  };

  const [series, setSeries] = useState<Series[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let mounted = true;

    const fetchSeries = async () => {
      try {
        const response = await fetch("/api/series");
        const json = await response.json();
        if (mounted) setSeries(Array.isArray(json) ? json : []);
      } catch {
        if (mounted) setSeries([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSeries();

    return () => {
      mounted = false;
    };
  }, [inView]);

  return (
    <section ref={sectionRef} className="bg-transparent py-8">
      <style>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            scale: 0.8;
          }
          100% {
            opacity: 1;
            scale: 1;
          }
        }
        .animate-pop-in {
          animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }
      `}</style>

      <div className="max-w-9/12 mx-auto px-4">
        {inView && (
          <>
            <h3 className="kurdish-text text-lg sm:text-xl font-bold mb-4">
              نوێترین زنجیرەکان
            </h3>

            {loading ? (
              <CardGridSkeleton count={10} cardClassName="border border-gray-800" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {series?.slice(0, 10).map((s, index) => (
                  <Link key={s.id} href={`/series/${s.slug}`} className="block transform duration-300 hover:scale-105">
                    <div
                      className="group relative bg-white/5 rounded-lg border border-gray-800 overflow-hidden hover:scale-105 transition duration-300 cursor-pointer animate-pop-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative w-full aspect-[2/3] bg-gray-700 overflow-hidden">
                        {isValidImageSrc(s.thumbnail_url) ? (
                          <Image
                            src={s.thumbnail_url}
                            alt={s.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                            className="object-cover"
                            draggable={false}
                            quality={45}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm">
                            No image
                          </div>
                        )}

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 brightness-90 opacity-0 group-hover:opacity-100 transition duration-300 px-2">
                          <p className="text-sm font-semibold text-white line-clamp-2">
                            {s.title}
                          </p>

                          <div className="mt-1 flex items-center gap-1 bg-black/50 border border-white/10 text-white font-bold px-2 py-1 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0L5.37 17.85c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L1.373 7.39c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69L9.05 2.927z" />
                            </svg>
                            <span>{s.tmdb_rating ?? "--"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
