"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ClerkProvider, SignIn, SignUp } from "@clerk/nextjs";

type Mode = "sign-in" | "sign-up";

export default function AuthModal({
  open,
  initialMode = "sign-in",
  onClose,
}: {
  open: boolean;
  initialMode?: Mode;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    if (open) setMode(initialMode);
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Freeze background scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    // Prevent layout shift when scrollbar disappears
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  const title = useMemo(() => (mode === "sign-in" ? "Sign in" : "Sign up"), [mode]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative mx-auto h-full w-full max-w-lg px-4 flex items-center justify-center">
        <div className="w-full rounded-2xl border border-white/15 shadow-2xl overflow-hidden bg-white/8 backdrop-blur-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/20">
            <div className="text-white font-bold">{title}</div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="px-5 pt-4">
            <div className="flex gap-2 bg-white/5 border border-white/10 rounded-full p-1">
              <button
                onClick={() => setMode("sign-in")}
                className={`flex-1 rounded-full py-2 text-sm font-bold transition ${
                  mode === "sign-in" ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => setMode("sign-up")}
                className={`flex-1 rounded-full py-2 text-sm font-bold transition ${
                  mode === "sign-up" ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
                }`}
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="p-5">
            <ClerkProvider>
              <div className="w-full flex justify-center">
                <div className="w-full max-w-md">
                  {mode === "sign-in" ? (
                    <SignIn
                      routing="hash"
                      appearance={{
                        elements: {
                          rootBox: "mx-auto w-full",
                          cardBox: "mx-auto w-full",
                          card: "mx-auto w-full",
                        },
                      }}
                    />
                  ) : (
                    <SignUp
                      routing="hash"
                      appearance={{
                        elements: {
                          rootBox: "mx-auto w-full",
                          cardBox: "mx-auto w-full",
                          card: "mx-auto w-full",
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </ClerkProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

