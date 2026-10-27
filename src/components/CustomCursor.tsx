"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    // Only activate on devices with a fine pointer (mouse / trackpad)
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!cursor || !dot) return;

    // Smooth physics quickTo setters
    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.18, ease: "power2.out" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.18, ease: "power2.out" });
    const xToDot = gsap.quickTo(dot, "x", { duration: 0.04, ease: "power1.out" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.04, ease: "power1.out" });

    let currentHoverType: "none" | "link" | "project" | "view" | "drag" = "none";

    const onMouseMove = (e: MouseEvent) => {
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToDot(e.clientX);
      yToDot(e.clientY);

      gsap.to([cursor, dot], { opacity: 1, duration: 0.2, overwrite: "auto" });
    };

    const onMouseDown = () => {
      gsap.to(cursor, {
        scale: currentHoverType === "none" ? 0.8 : 1.3,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const onMouseUp = () => {
      gsap.to(cursor, {
        scale: currentHoverType === "none" ? 1 : 1.8,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const onMouseLeave = () => {
      gsap.to([cursor, dot], { opacity: 0, duration: 0.3 });
    };

    // Attach hover listener for interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest<HTMLElement>(
        "a, button, [role='button'], input, textarea, [data-cursor], .cursor-pointer"
      );

      if (interactive) {
        const cursorData = interactive.getAttribute("data-cursor");

        if (cursorData === "view" || interactive.closest("#works") || interactive.closest("[data-project]")) {
          if (currentHoverType !== "view") {
            currentHoverType = "view";
            setCursorText("VIEW");
            gsap.to(cursor, {
              scale: 2.2,
              borderColor: "#f4ddb8",
              backgroundColor: "rgba(244, 221, 184, 0.14)",
              duration: 0.25,
              ease: "power2.out",
            });
            gsap.to(dot, { opacity: 0, duration: 0.15 });
            if (label) gsap.to(label, { opacity: 1, scale: 1, duration: 0.2 });
          }
        } else {
          if (currentHoverType !== "link") {
            currentHoverType = "link";
            setCursorText("");
            gsap.to(cursor, {
              scale: 1.7,
              borderColor: "var(--color-primary)",
              backgroundColor: "rgba(211, 107, 84, 0.15)",
              duration: 0.25,
              ease: "power2.out",
            });
            gsap.to(dot, { opacity: 0, duration: 0.15 });
            if (label) gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.15 });
          }
        }
      } else if (currentHoverType !== "none") {
        currentHoverType = "none";
        setCursorText("");
        gsap.to(cursor, {
          scale: 1,
          borderColor: "rgba(244, 221, 184, 0.6)",
          backgroundColor: "transparent",
          duration: 0.25,
          ease: "power2.out",
        });
        gsap.to(dot, { opacity: 1, duration: 0.2 });
        if (label) gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.15 });
      }
    };

    // Global Magnetic Hover Pull on [data-magnetic] and .magnetic-btn elements
    const handleMagneticMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-magnetic], .magnetic-btn"
      );
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      gsap.to(target, {
        x: relX * 0.28,
        y: relY * 0.28,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMagneticLeave = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-magnetic], .magnetic-btn"
      );
      if (!target) return;

      gsap.to(target, {
        x: 0,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", handleElementHover, { passive: true });
    window.addEventListener("mousemove", handleMagneticMove, { passive: true });
    document.addEventListener("mouseout", handleMagneticLeave, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleElementHover);
      window.removeEventListener("mousemove", handleMagneticMove);
      document.removeEventListener("mouseout", handleMagneticLeave);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Outer Reticle / Follower Ring with Label */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[99999] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#f4ddb8]/60 opacity-0 will-change-transform flex items-center justify-center hidden md:flex backdrop-blur-[0.5px]"
        style={{ transformOrigin: "center center" }}
      >
        <span
          ref={labelRef}
          className="text-[8px] font-mono tracking-widest text-[#f4ddb8] font-bold opacity-0 scale-75 select-none pointer-events-none"
        >
          {cursorText}
        </span>
      </div>

      {/* Inner Incandescent Precision Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[99999] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#f4ddb8] opacity-0 will-change-transform hidden md:block shadow-[0_0_6px_#f4ddb8]"
        style={{ transformOrigin: "center center" }}
      />
    </>
  );
}