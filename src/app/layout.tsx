import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import Link from "next/link";

import { Geist, Geist_Mono } from "next/font/google";
import Header from "../components/Header";
import "./globals.css";
import Footer from "../components/Footer";
import localFont from 'next/font/local';

const kurdishFont = localFont({ src: '../fonts/Kurdish.ttf' });

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
    icon: 'https://i.imgur.com/8Udniyn.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
          <link rel="preload" as="image" href="https://i.imgur.com/8Udniyn.png" />
        </head>
        <body className={`flex flex-col min-h-screen ${geistSans.variable} ${geistMono.variable} bg-[#0f0f0f]`}>
          <SpeedInsights/>
          <Analytics/>
          <Header />

          <main className="flex-1">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}