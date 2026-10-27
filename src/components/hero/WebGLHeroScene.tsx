"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import RoomScene3D from "./RoomScene3D";

interface WebGLHeroSceneProps {
  onTelemetryUpdate?: (data: { x: number; y: number; focus: number; target: string }) => void;
}

/**
 * Global 3D Theatrical Scene Canvas:
 * Fixed background across the entire portfolio, responding to mouse position
 * and scroll progress with camera tracking and volumetric spotlight physics.
 */
export default function WebGLHeroScene({ onTelemetryUpdate }: WebGLHeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  // Safe DPR computation capped for low-end hardware efficiency
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

  // Global pointer tracking across the entire window
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointerRef.current = { x, y, active: true };
    };

    const handlePointerLeave = () => {
      pointerRef.current = { x: 0, y: 0, active: false };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 1.05, 5.8], fov: 38, near: 0.1, far: 30 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
          gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
        }}
      >
        <RoomScene3D pointerRef={pointerRef} onTelemetryUpdate={onTelemetryUpdate} />
      </Canvas>
    </div>
  );
}
