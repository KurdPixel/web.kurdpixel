"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const defaultImg = "https://i.imgur.com/p8pYw4Y.png";
  const hoverImg = "https://i.imgur.com/vvVukVy.png";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("ontouchstart" in window) return; // disable on touch devices

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let raf = 0;

    cursor.style.backgroundImage = `url('${defaultImg}')`;

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Determine if the native cursor should be shown at this point.
      const el = document.elementFromPoint(e.clientX, e.clientY);
      let showNative = false;
      if (el && el instanceof Element) {
        // When over an iframe (cross-origin players like Vidmoly) the browser
        // will show the iframe's native cursor which we cannot control.
        // To avoid both cursors appearing, hide the custom cursor and let
        // the native cursor show when over an iframe.
        if (el.tagName === 'IFRAME' || (el.closest && el.closest('iframe'))) {
          showNative = true;
        } else {
          const cs = window.getComputedStyle(el).cursor;
          if (cs && cs !== "none") showNative = true;
        }
      }

      if (cursor) {
        cursor.style.opacity = showNative ? "0" : "1";
      }
    }

    function onMouseEnter() {
      if (cursor) cursor.style.opacity = "1";
    }

    function onMouseLeave() {
      if (cursor) cursor.style.opacity = "0";
    }

    function lerp(a: number, b: number, n: number) {
      return (1 - n) * a + n * b;
    }

    function animate() {
      currentX = lerp(currentX, mouseX, 0.2);
      currentY = lerp(currentY, mouseY, 0.2);
      if (cursor) {
        cursor.style.left = currentX + "px";
        cursor.style.top = currentY + "px";
      }
      raf = requestAnimationFrame(animate);
    }

    function onOver(e: Event) {
      const target = e.target as Node | null;
      if (!target || !(target instanceof Element)) return;
      if (target.closest("a, button, input, textarea, select, [role=button], .interactive")) {
        if (cursor) cursor.style.backgroundImage = `url('${hoverImg}')`;
      }
    }

    function onOut(e: Event) {
      if (cursor) cursor.style.backgroundImage = `url('${defaultImg}')`;
    }

    // Prevent selection, right-click and common devtools shortcuts (F12, Ctrl+Shift+I)
    function onSelectStart(e: Event) {
      const target = e.target as Node | null;
      if (!target || !(target instanceof Element)) return;
      if (target.closest("input, textarea, [contenteditable='true']")) return; // allow typing/select in inputs
      e.preventDefault();
    }

    function onContextMenu(e: Event) {
      e.preventDefault();
    }

    function onKeyDownDev(e: KeyboardEvent) {
      if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === "i")) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDownDev);

    animate();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDownDev);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      id="custom-cursor"
      className={`fixed pointer-events-none z-[9999] w-8 h-8 bg-no-repeat bg-center bg-contain opacity-0 transition-all duration-0`}
      style={{ transform: "translate(-50%, -5%)" }}
    />
  );
}
