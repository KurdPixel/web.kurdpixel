import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
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
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"/>
        </head>
        <body className={`flex flex-col min-h-screen ${geistSans.variable} ${geistMono.variable}`}>
          <Header />

          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}