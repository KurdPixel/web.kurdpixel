"use client";
import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { IconFilm, IconHome, IconMenu, IconShield, IconTheater } from "./Icons";

const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });

export default function Header() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

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

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  // ✅ PILL POSITION
  useLayoutEffect(() => {
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
        if (Math.abs(prev.left - nextLeft) < 0.5 && Math.abs(prev.width - nextWidth) < 0.5) {
          return prev;
        }
        return { left: nextLeft, width: nextWidth };
      });
    };

    const scheduleMeasure = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(measure);
    };

    scheduleMeasure();

    ro = new ResizeObserver(scheduleMeasure);
    if (navRef.current) ro.observe(navRef.current);

    // In case fonts/icons load after first paint.
    window.addEventListener("load", scheduleMeasure, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("load", scheduleMeasure);
      ro?.disconnect();
      ro = null;
    };
  }, [pathname]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!isSignedIn || !user) {
        setLoadingAdmin(false);
        return;
      }

      try {
        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) return;

        const res = await fetch("/api/check-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data.isAdmin);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAdmin(false);
      }
    };

    checkAdmin();
  }, [isSignedIn, user]);

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
                className="h-5 sm:h-6 md:h-7 max-w-12 max-h-12"
                draggable={false}
                priority
                quality={70}
              />
            </Link>

            {isSignedIn && isAdmin && !loadingAdmin && (
              <Link
                href="/admin"
                className="p-1.5 sm:p-2 rounded-full text-white hover:bg-white/30 transition"
              >
                <IconShield className="h-6 w-6 sm:h-7 sm:w-7" />
              </Link>
            )}
          </div>

          {/* NAV */}
          <div
            ref={navRef}
            className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 p-2 rounded-full shadow-lg relative"
          >

            {/* PILL */}
            <div
              className="absolute top-1 bottom-1 rounded-full shadow-md transition-all duration-300 bg-white/15 border border-white/20"
              style={{
                left: pill.left,
                width: pill.width,
              }}
            />

            {navItems.map((item, i) => (
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

                {/* TEXT ONLY */}
                <span className="kurdish-text transition-all">
                  {item.name}
                </span>
              </Link>
            ))}

            {/* PROFILE */}
            <div className="relative z-10 flex items-center justify-center ml-1 h-full">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/sign-in" />
              ) : (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setAuthMode("sign-in");
                    setAuthOpen(true);
                  }}
                  className="rounded-full bg-violet-500 px-4 py-2 text-sm text-white hover:bg-violet-600"
                >
                  چوونەژوورەوە
                </a>
              )}
            </div>
          </div>

          {/* MOBILE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-full text-white hover:bg-white/20 transition"
          >
            <IconMenu className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed top-14 sm:top-16 left-3 sm:left-4 right-3 sm:right-4 z-40 md:hidden">
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

              {isSignedIn && isAdmin && !loadingAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-white hover:bg-white/30 transition text-sm sm:text-base"
                >
                  <IconShield className="h-5 w-5" />
                  Admin
                </Link>
              )}

            </div>
          </div>
        </div>
      )}

      <AuthModal open={authOpen} initialMode={authMode} onClose={() => setAuthOpen(false)} />
    </>
  );
}