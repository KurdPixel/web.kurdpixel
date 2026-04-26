"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { IconFilm, IconHome, IconMenu, IconSearch, IconTheater } from "./Icons";

const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });

export default function HeaderPublic() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

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
      if (index === -1) {
        setPill({ left: 0, width: 0 });
        return;
      }
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
                className="h-5 sm:h-6 md:h-7 w-auto"
                draggable={false}
                priority
                quality={45}
              />
            </Link>
          </div>

          <div
            ref={navRef}
            className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 p-2 rounded-full shadow-lg relative"
          >
            <div
              className="absolute top-1 bottom-1 rounded-full shadow-md transition-all duration-300 bg-white/15 border border-white/20"
              style={{ left: pill.left, width: pill.width }}
            />

            {navItems.map((item, i) => (
              // Show the icon only for the active item (pill)
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={`relative z-10 flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold transition-colors ${
                  isActive(item.href) ? "text-white" : "text-white hover:text-white/60"
                }`}
              >
                {isActive(item.href) && <item.icon className="h-[18px] w-[18px]" />}
                <span className="kurdish-text transition-all">{item.name}</span>
              </Link>
            ))}

            <Link
              href="/search"
              className={`relative z-10 rounded-full border p-2 transition ${
                isActive("/search")
                  ? "bg-white/15 border-white/20 text-white"
                  : "border-white/20 bg-white/10 text-white hover:bg-white/20"
              }`}
              aria-label="Search"
            >
              <IconSearch className="h-4 w-4" />
            </Link>

            <SignedOut>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setAuthOpen(true);
                }}
                className="relative z-10 rounded-full bg-violet-700 px-4 py-2 text-sm text-white hover:bg-violet-800"
              >
                چوونەژوورەوە
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="relative z-10 flex items-center self-center">
                <UserButton />
              </div>
            </SignedIn>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="public-mobile-nav-menu"
            className="md:hidden p-1.5 sm:p-2 rounded-full text-white hover:bg-white/20 transition"
          >
            <IconMenu className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div id="public-mobile-nav-menu" className="fixed top-14 sm:top-16 left-3 sm:left-4 right-3 sm:right-4 z-40 md:hidden">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3 sm:p-4 shadow-lg">
            <div className="flex flex-col gap-2 sm:gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm sm:text-base font-bold ${
                    isActive(item.href) ? "bg-white/15 text-white" : "text-white hover:bg-white/10 hover:text-white/60"
                  }`}
                >
                  {isActive(item.href) && <item.icon className="h-5 w-5" />}
                  <span className="kurdish-text">{item.name}</span>
                </Link>
              ))}

              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-full px-4 py-2 text-sm text-center ${
                  isActive("/search")
                    ? "bg-white/25 text-white"
                    : "bg-white/15 text-white hover:bg-white/20"
                }`}
              >
                گەڕان
              </Link>

              <SignedOut>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    setAuthOpen(true);
                  }}
                  className="rounded-full bg-violet-700 px-4 py-2 text-sm text-white hover:bg-violet-800 text-center"
                >
                  چوونەژوورەوە
                </Link>
              </SignedOut>

              <SignedIn>
                <div className="flex justify-center py-1">
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}

      {authOpen ? (
        <AuthModal
          open={authOpen}
          initialMode="sign-in"
          onClose={() => setAuthOpen(false)}
        />
      ) : null}
    </>
  );
}

