"use client";
import React, { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Clerk from "@clerk/clerk-sdk-node";

export default function Header() {
  const { isSignedIn, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!isSignedIn || !user) {
        setLoadingAdmin(false);
        return;
      }

      try {
        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) {
          setLoadingAdmin(false);
          return;
        }

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
        console.error("Failed to check admin status:", err);
      } finally {
        setLoadingAdmin(false);
      }
    };

    checkAdmin();
  }, [isSignedIn, user]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 pt-8 z-40">
        <div className="mx-auto w-full max-w-6xl relative rounded-full bg-white/30 backdrop-blur-xl border border-white/30 shadow-lg flex items-center justify-between p-4">
          {/* Left: user button or sign-in/sign-up when not signed in + admin button */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <>
                <UserButton afterSignOutUrl="/sign-in" />
                {isAdmin && !loadingAdmin && (
                  <Link href="/admin" className="flex items-center justify-center p-2 rounded-full hover:bg-white/20 transition-colors" title="Admin Panel">
                    <span className="material-symbols-rounded text-2xl text-white">admin_panel_settings</span>
                  </Link>
                )}
              </>
            ) : (
              <>
              <Link href="/sign-in" className="box-border rounded-full bg-violet-500 px-4 py-2 text-sm font-medium leading-5 text-white shadow-xs hover:bg-violet-700 focus:outline-none">چوونەژوورەوە</Link>
              </>
            )}
          </div>

          {/* Center: nav links (centered on desktop) */}
          <div className="absolute left-1/2 inset-y-0 flex items-center transform -translate-x-1/2 hidden md:flex">
            <ul className="kurdish-text flex flex-row items-center gap-8 font-semibold text-white">
              <li>
                {/* <Link href="/staff" className="flex items-center gap-1 hover:text-violet-400">
                  <span>ستاف</span>
                  <span className="material-symbols-rounded leading-none align-middle">people</span>
                </Link> */}
              </li>
              <li>
                <Link href="/drama" className="flex items-center gap-1 hover:text-violet-500">
                  <span className="kurdish-text">زنجیرەکان</span>
                  <span className="material-symbols-rounded leading-none align-middle">movie</span>
                </Link>
              </li>
              <li>
                <Link href="/movies" className="flex items-center gap-1 hover:text-violet-500">
                  <span className="kurdish-text">فیلمەکان</span>
                  <span className="material-symbols-rounded leading-none align-middle">theaters</span>
                </Link>
              </li>
              <li>
                <Link href="/" className="flex items-center gap-1 hover:text-violet-500">
                  <span className="kurdish-text">سەرەتا</span>
                  <span className="material-symbols-rounded leading-none align-middle">home</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Right: mobile controls and logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex h-10 w-10 items-center justify-center rounded p-2 text-sm text-white hover:bg-white/20 focus:outline-none"
                aria-controls="navbar-default"
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
                </svg>
              </button>
            </div>

            <Link href="/" className="flex items-center gap-3">
              <img src="https://i.imgur.com/8Udniyn.png" className="h-7" alt="" draggable={false} onDragStart={(e) => e.preventDefault()} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed top-24 left-0 right-0 z-30 md:hidden">
          <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white/30 backdrop-blur-xl border border-white/30 shadow-lg p-4">
            <ul className="kurdish-text flex flex-col items-center gap-4 font-semibold text-white">
              {isAdmin && !loadingAdmin && (
                <li>
                  <Link href="/admin" className="flex items-center justify-center p-2 rounded-full hover:bg-white/20 transition-colors" onClick={() => setMobileMenuOpen(false)} title="Admin Panel">
                    <span className="material-symbols-rounded text-2xl">admin_panel_settings</span>
                  </Link>
                </li>
              )}
              <li>
                <Link href="/" className="flex items-center gap-2 hover:text-violet-400" onClick={() => setMobileMenuOpen(false)}>
                  <span className="kurdish-text">سەرەتا</span>
                  <span className="material-symbols-rounded leading-none align-middle">home</span>
                </Link>
              </li>
              <li>
                <Link href="/movies" className="flex items-center gap-2 hover:text-violet-400" onClick={() => setMobileMenuOpen(false)}>
                  <span className="kurdish-text">فیلمەکان</span>
                  <span className="material-symbols-rounded leading-none align-middle">theaters</span>
                </Link>
              </li>
              <li>
                <Link href="/drama" className="flex items-center gap-2 hover:text-violet-400" onClick={() => setMobileMenuOpen(false)}>
                  <span className="kurdish-text">زنجیرەکان</span>
                  <span className="material-symbols-rounded leading-none align-middle">movie</span>
                </Link>
              </li>
              <li>
                 {/* <Link href="/staff" className="flex items-center gap-2 hover:text-violet-400" onClick={() => setMobileMenuOpen(false)}>
                  <span className="kurdish-text">ستاف</span>
                  <span className="material-symbols-rounded leading-none align-middle">people</span>
                </Link> */}
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
