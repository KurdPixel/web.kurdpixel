"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { IconFilm, IconHome, IconMenu, IconTheater } from "./Icons";

const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });

export default function Header() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");

  const navItems = [
    { name: "سەرەتا", href: "/", icon: IconHome },
    { name: "فیلمەکان", href: "/movies", icon: IconTheater },
    { name: "زنجیرەکان", href: "/series", icon: IconFilm },
  ];

  // ✅ FIXED ACTIVE DETECTION
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* HEADER */}
      <nav className="absolute top-3 sm:top-4 md:top-6 left-0 z-50 w-full px-3 sm:px-4">
        <div className="w-full flex items-center justify-between">

          {/* LEFT */}
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

          {/* NAV */}
          <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 p-2 rounded-full shadow-lg relative">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative z-10 flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold transition-colors ${
                  isActive(item.href)
                    ? "bg-white/15 border border-white/20 text-white"
                    : "text-white hover:text-white/60"
                }`}
              >
                {isActive(item.href) && <item.icon className="h-[18px] w-[18px]" />}

                {/* TEXT ONLY */}
                <span className="kurdish-text transition-all">
                  {item.name}
                </span>
              </Link>
            ))}

            {/* PROFILE */}
            <div className="relative z-10 flex items-center justify-center ml-1 h-full">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setAuthMode("sign-in");
                  setAuthOpen(true);
                }}
                className="rounded-full bg-violet-700 px-4 py-2 text-sm text-white hover:bg-violet-800"
              >
                چوونەژوورەوە
              </a>
            </div>
          </div>

          {/* MOBILE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            className="md:hidden p-1.5 sm:p-2 rounded-full text-white hover:bg-white/20 transition"
          >
            <IconMenu className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div id="mobile-nav-menu" className="fixed top-14 sm:top-16 left-3 sm:left-4 right-3 sm:right-4 z-40 md:hidden">
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

            </div>
          </div>
        </div>
      )}

      {authOpen ? (
        <AuthModal open={authOpen} initialMode={authMode} onClose={() => setAuthOpen(false)} />
      ) : null}
    </>
  );
}