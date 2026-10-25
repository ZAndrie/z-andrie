"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only activate on devices with a fine pointer (mouse / trackpad)
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Smooth physics quickTo setters
    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.22, ease: "power2.out" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.22, ease: "power2.out" });
    const xToDot = gsap.quickTo(dot, "x", { duration: 0.04, ease: "power1.out" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.04, ease: "power1.out" });

    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      // Offset by half size so cursor centers on pointer
      xToCursor(e.clientX - 16);
      yToCursor(e.clientY - 16);
      xToDot(e.clientX - 3);
      yToDot(e.clientY - 3);

      gsap.to([cursor, dot], { opacity: 1, duration: 0.2, overwrite: "auto" });
    };

    const onMouseDown = () => {
      gsap.to(cursor, { scale: isHovering ? 1.3 : 0.75, duration: 0.15, ease: "power2.out" });
    };

    const onMouseUp = () => {
      gsap.to(cursor, { scale: isHovering ? 1.7 : 1, duration: 0.2, ease: "power2.out" });
    };

    const onMouseLeave = () => {
      gsap.to([cursor, dot], { opacity: 0, duration: 0.3 });
    };

    // Attach hover listener for interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, textarea, .cursor-pointer");

      if (interactive && !isHovering) {
        isHovering = true;
        gsap.to(cursor, {
          scale: 1.7,
          borderColor: "var(--color-primary)",
          backgroundColor: "rgba(211, 107, 84, 0.12)",
          duration: 0.25,
          ease: "power2.out",
        });
        gsap.to(dot, { opacity: 0, duration: 0.15 });
      } else if (!interactive && isHovering) {
        isHovering = false;
        gsap.to(cursor, {
          scale: 1,
          borderColor: "rgba(211, 107, 84, 0.7)",
          backgroundColor: "transparent",
          duration: 0.25,
          ease: "power2.out",
        });
        gsap.to(dot, { opacity: 1, duration: 0.2 });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", handleElementHover);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleElementHover);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Outer Follower Ring */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[99999] w-8 h-8 rounded-full border border-[var(--color-primary)]/70 opacity-0 will-change-transform mix-blend-difference hidden md:block"
        style={{ transformOrigin: "center center" }}
      />
      {/* Inner Precision Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[99999] w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] opacity-0 will-change-transform hidden md:block"
        style={{ transformOrigin: "center center" }}
      />
    </>
  );
}
