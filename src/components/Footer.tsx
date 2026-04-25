"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <footer className={`py-10 ${isHomePage ? "bg-[#0f0f0f]" : "bg-transparent"}`}>

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-4">

        {/* LOGO + DISCORD ROW */}
        <div className="flex items-center justify-center gap-5 py-2">

          {/* LOGO */}
          <Link href="/">
            <img
              src="https://i.imgur.com/8Udniyn.png"
              className="h-10"
              alt="logo"
              draggable={false}
            />
          </Link>

          {/* DIVIDER */}
          <span className="text-gray-500 text-lg select-none">|</span>

          {/* DISCORD ICON (TRANSPARENT CLEAN STYLE) */}
          
            <a href="https://discord.gg/VZHMZJDprW"
            target="_blank"
            className="group flex items-center justify-center"
          >
            <svg
              className="w-6 h-6 text-gray-400 group-hover:text-white transition"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.249.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.369a.07.07 0 0 0-.032.027C.533 9.046-.32 13.579.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.291.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.195.373.291a.077.077 0 0 1-.006.128 12.298 12.298 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.675-3.548-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
          </a>

        </div>

        {/* DESCRIPTION */}
        <p className="kurdish-text text-gray-400 text-sm mt-5">
          کوردپیکسڵ یەکەمین و پڕبینەرترین ماڵپەڕی تایبەت بە فیلم و دراما کوردی و جیهانیەکان
        </p>

        {/* COPYRIGHT */}
        <span className="text-gray-600 text-xs mt-1">
          © {new Date().getFullYear()}{" "}
          <span className="text-violet-400 font-semibold">KurdPixel</span> —
          هەموو مافەکان پارێزراون
        </span>

      </div>
    </footer>
  );
}