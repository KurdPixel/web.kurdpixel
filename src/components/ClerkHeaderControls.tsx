"use client";

import React from "react";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function ClerkHeaderControls({
  onOpenAuth,
  variant,
}: {
  onOpenAuth: () => void;
  variant: "desktop" | "mobile";
}) {
  return (
    <ClerkProvider>
      <SignedOut>
        {variant === "desktop" ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenAuth();
            }}
            className="relative z-10 rounded-full bg-violet-700 px-4 py-2 text-sm text-white hover:bg-violet-800"
          >
            چوونەژوورەوە
          </a>
        ) : (
          <button
            onClick={onOpenAuth}
            className="rounded-full bg-violet-700 px-4 py-2 text-sm text-white hover:bg-violet-800 text-center"
          >
            چوونەژوورەوە
          </button>
        )}
      </SignedOut>

      <SignedIn>
        {variant === "desktop" ? (
          <div className="relative z-10 ml-1 flex items-center self-center">
            <UserButton />
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <UserButton />
          </div>
        )}
      </SignedIn>
    </ClerkProvider>
  );
}

