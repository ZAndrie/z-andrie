"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import RoomScene3D from "./RoomScene3D";

interface WebGLHeroSceneProps {
  onTelemetryUpdate?: (data: { x: number; y: number; focus: number; target: string }) => void;
}

// Helpers for checking WebGL capability
function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Main WebGL Hero Canvas Container with Performance Optimization & Graceful Fallback.
 */
export default function WebGLHeroScene({ onTelemetryUpdate }: WebGLHeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Compute performance settings safely
  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    const urlParams = new URLSearchParams(window.location.search);
    const dprParam = parseFloat(urlParams.get("dpr") || "");

    const isLowPower =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      ((navigator as unknown as { deviceMemory?: number }).deviceMemory &&
        (navigator as unknown as { deviceMemory?: number }).deviceMemory! <= 4) ||
      window.innerWidth <= 640;

    const baseDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    return !isNaN(dprParam) ? dprParam : isLowPower ? Math.min(baseDpr, 1.1) : baseDpr;
  }, []);

  const hasWebGL = useSyncExternalStore(
    () => () => {},
    () => checkWebGLSupport(),
    () => true
  );

  // Pause rendering when tab is hidden or offscreen
  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      observer.disconnect();
    };
  }, []);

  // Pointer tracking
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current = { x, y, active: true };
  }, []);

  const handlePointerLeave = useCallback(() => {
    pointerRef.current = { x: 0, y: 0, active: false };
  }, []);

  if (!hasWebGL) {
    return null; // Graceful fallback
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      {isVisible && (
        <Canvas
          shadows
          dpr={dpr}
          camera={{ position: [0, 0.8, 6.2], fov: 36, near: 0.1, far: 30 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.1;
            gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
          }}
        >
          <RoomScene3D
            pointerRef={pointerRef}
            onTelemetryUpdate={onTelemetryUpdate}
          />
        </Canvas>
      )}
    </div>
  );
}
