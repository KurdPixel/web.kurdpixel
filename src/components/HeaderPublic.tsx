"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IconFilm, IconHome, IconMenu, IconTheater } from "./Icons";

export default function HeaderPublic() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "سەرەتا", href: "/", icon: IconHome },
    { name: "فیلمەکان", href: "/movies", icon: IconTheater },
    { name: "زنجیرەکان", href: "/series", icon: IconFilm },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useEffect(() => {
    let rafId = 0;
    let ro: ResizeObserver | null = null;

    const measure = () => {
      rafId = 0;
      const index = navItems.findIndex((i) => isActive(i.href));
      const el = itemRefs.current[index];
      const navEl = navRef.current;
      if (!el || !navEl) return;

      const navRect = navEl.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const nextLeft = elRect.left - navRect.left;
      const nextWidth = elRect.width;

      setPill((prev) => {
        if (Math.abs(prev.left - nextLeft) < 0.5 && Math.abs(prev.width - nextWidth) < 0.5) return prev;
        return { left: nextLeft, width: nextWidth };
      });
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(measure);
    };

    schedule();
    ro = new ResizeObserver(schedule);
    if (navRef.current) ro.observe(navRef.current);
    window.addEventListener("load", schedule, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("load", schedule);
      ro?.disconnect();
      ro = null;
    };
  }, [pathname]);

  return (
    <>
      <nav className="absolute top-3 sm:top-4 md:top-6 left-0 z-50 w-full px-3 sm:px-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="KurdPixel Logo"
                width={154}
                height={48}
                sizes="(max-width: 768px) 96px, (max-width: 1200px) 120px, 154px"
                className="h-5 sm:h-6 md:h-7 max-w-12 max-h-12"
                draggable={false}
                priority
                quality={70}
              />
            </Link>
          </div>

          <div
            ref={navRef}
            className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 p-2 rounded-full shadow-lg relative"
          >
            <div
              className="absolute top-1 bottom-1 bg-white/80 rounded-full shadow-md transition-all duration-300"
              style={{ left: pill.left, width: pill.width }}
            />

            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={`relative z-10 flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium transition-all ${
                  isActive(item.href) ? "text-black" : "text-black/60 hover:text-black"
                }`}
              >
                <item.icon className="h-[18px] w-[18px]" />
                <span className="kurdish-text transition-all">{item.name}</span>
              </Link>
            ))}

            <Link
              href="/sign-in"
              className="relative z-10 rounded-full bg-violet-500 px-4 py-2 text-sm text-white hover:bg-violet-600"
            >
              چوونەژوورەوە
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-full text-white hover:bg-white/20 transition"
          >
            <IconMenu className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed top-14 sm:top-16 left-3 sm:left-4 right-3 sm:right-4 z-40 md:hidden">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3 sm:p-4 shadow-lg">
            <div className="flex flex-col gap-2 sm:gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition text-sm sm:text-base ${
                    isActive(item.href) ? "bg-white text-black" : "text-black/60 hover:bg-white/30 hover:text-black"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="kurdish-text">{item.name}</span>
                </Link>
              ))}

              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full bg-violet-500 px-4 py-2 text-sm text-white hover:bg-violet-600 text-center"
              >
                چوونەژوورەوە
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

