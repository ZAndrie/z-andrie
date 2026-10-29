"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import TechParticles from "./TechParticles";

const WebGLHeroScene = dynamic(() => import("./WebGLHeroScene"), {
  ssr: false,
  loading: () => null,
});

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Global 3D Theatrical Scene container mounted at the root of the portfolio.
 * Stays permanently in the background across all sections with smooth camera dolly.
 */
export default function Global3DScene() {
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  if (isReducedMotion) {
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <TechParticles />
      </div>
    );
  }

  return <WebGLHeroScene />;
}
