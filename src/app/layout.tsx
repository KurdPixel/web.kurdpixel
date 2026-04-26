import type { Metadata } from "next";
import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

import { Geist, Geist_Mono } from "next/font/google";
import HeaderPublic from "../components/HeaderPublic";
import "./globals.css";
import localFont from 'next/font/local';

const kurdishFont = localFont({
  src: "../fonts/Kurdish.ttf",
  variable: "--font-kurdish",
  display: "swap",
  preload: true,
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KurdPixel",
  description: "KurdPixel - Your Gateway to Kurdish Movies and Series",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`flex flex-col min-h-screen ${geistSans.variable} ${geistMono.variable} ${kurdishFont.variable} bg-[#0f0f0f]`}>
        <SpeedInsights />
        <Analytics />
        <HeaderPublic />

        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}