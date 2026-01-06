"use client";
import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 pt-8 z-40">
      <div className="mx-auto w-full max-w-6xl relative rounded-full bg-white/30 backdrop-blur-xl border border-white/30 shadow-lg flex items-center justify-between p-4">
        {/* Left: user button or sign-in/sign-up when not signed in */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/sign-in" />
          ) : (
            <>
            <Link href="/sign-in" className="box-border rounded-full bg-violet-500 px-4 py-2 text-sm font-medium leading-5 text-white shadow-xs hover:bg-violet-700 focus:outline-none">چوونەژوورەوە</Link>
            </>
          )}
        </div>

        {/* Center: nav links (centered on desktop) */}
        <div className="absolute left-1/2 inset-y-0 flex items-center transform -translate-x-1/2 hidden md:flex">
          <ul className="flex flex-row items-center gap-8 font-semibold text-white">
            <li>
              <Link href="/staff" className="flex items-center gap-1 hover:text-violet-400">
                <span>ستاف</span>
                <span className="material-symbols-rounded leading-none align-middle">people</span>
              </Link>
            </li>
            <li>
              <Link href="/drama" className="flex items-center gap-1 hover:text-violet-400">
                <span>زنجیرەکان</span>
                <span className="material-symbols-rounded leading-none align-middle">movie</span>
              </Link>
            </li>
            <li>
              <Link href="/movies" className="flex items-center gap-1 hover:text-violet-400">
                <span>فیلمەکان</span>
                <span className="material-symbols-rounded leading-none align-middle">theaters</span>
              </Link>
            </li>
            <li>
              <Link href="/" className="flex items-center gap-1 hover:text-violet-400">
                <span>سەرەتا</span>
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
              className="inline-flex h-10 w-10 items-center justify-center rounded p-2 text-sm hover:bg-neutral-secondary-soft focus:outline-none"
              aria-controls="navbar-default"
              aria-expanded={false}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
              </svg>
            </button>
            <div className="h-10 w-10 rounded-full bg-neutral-secondary-soft" />
          </div>

          <Link href="/" className="flex items-center gap-3">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-7" alt="" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
