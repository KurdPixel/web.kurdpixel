"use client";
import React, { useState, useEffect, useRef } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  const navItems = [
    { name: "سەرەتا", href: "/", icon: "home" },
    { name: "فیلمەکان", href: "/movies", icon: "theaters" },
    { name: "زنجیرەکان", href: "/series", icon: "movie" },
  ];

  // ✅ FIXED ACTIVE DETECTION
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  // ✅ PILL POSITION
  useEffect(() => {
    const updatePill = () => {
      const index = navItems.findIndex((i) => isActive(i.href));
      const el = itemRefs.current[index];

      if (el) {
        setPill({
          left: el.offsetLeft,
          width: el.offsetWidth,
        });
      }
    };

    updatePill();
    window.addEventListener("resize", updatePill);

    return () => window.removeEventListener("resize", updatePill);
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
      <nav className="absolute top-6 left-0 z-50 w-full px-4">
        <div className="w-full flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <Link href="/">
              <img
                src="https://i.imgur.com/8Udniyn.png"
                className="h-8"
                draggable={false}
              />
            </Link>

            {isSignedIn && isAdmin && !loadingAdmin && (
              <Link
                href="/admin"
                className="p-2 rounded-full text-white hover:bg-white/30"
              >
                <span className="material-symbols-rounded">
                  admin_panel_settings
                </span>
              </Link>
            )}
          </div>

          {/* NAV */}
          <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 p-2 rounded-full shadow-lg relative">

            {/* PILL */}
            <div
              className="absolute top-1 bottom-1 bg-white/80 rounded-full shadow-md transition-all duration-300"
              style={{
                left: pill.left,
                width: pill.width,
              }}
            />

            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => (itemRefs.current[i] = el)}
                className={`relative z-10 flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium transition-all
                  ${
                    isActive(item.href)
                      ? "text-black"       // ✅ ACTIVE TEXT (DARK)
                      : "text-black/60 hover:text-black"
                  }
                `}
              >
                {/* ICON (UNCHANGED) */}
                <span className="material-symbols-rounded text-[18px]">
                  {item.icon}
                </span>

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
                <Link
                  href="/sign-in"
                  className="rounded-full bg-violet-500 px-4 py-2 text-sm text-white hover:bg-violet-600"
                >
                  چوونەژوورەوە
                </Link>
              )}
            </div>
          </div>

          {/* MOBILE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-white hover:bg-white/20"
          >
            <span className="material-symbols-rounded">menu</span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-4 right-4 z-40 md:hidden">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-lg">
            <div className="flex flex-col gap-3">

              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition
                    ${
                      isActive(item.href)
                        ? "bg-white text-black"
                        : "text-black/60 hover:bg-white/30 hover:text-black"
                    }
                  `}
                >
                  <span className="material-symbols-rounded">
                    {item.icon}
                  </span>
                  <span className="kurdish-text">{item.name}</span>
                </Link>
              ))}

              {isSignedIn && isAdmin && !loadingAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-white hover:bg-white/30"
                >
                  <span className="material-symbols-rounded">
                    admin_panel_settings
                  </span>
                  Admin
                </Link>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}