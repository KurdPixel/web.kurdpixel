"use client";

import React from "react";

interface CardGridSkeletonProps {
  count?: number;
  className?: string;
  cardClassName?: string;
}

export default function CardGridSkeleton({
  count = 12,
  className = "",
  cardClassName = "",
}: CardGridSkeletonProps) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`relative bg-white/5 rounded-lg overflow-hidden animate-pulse ${cardClassName}`}
        >
          <div className="relative w-full aspect-[2/3] bg-gray-700/60">
            <div className="absolute inset-0 bg-linear-to-b from-white/5 via-transparent to-black/40" />
            <div className="absolute left-2 right-2 bottom-3">
              <div className="h-3 w-3/4 rounded bg-white/25" />
              <div className="mt-2 h-2.5 w-1/2 rounded bg-white/20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
