"use client";

import React, { useRef, useMemo, useCallback } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import RoomScene3D from "./RoomScene3D";

interface WebGLHeroSceneProps {
  onTelemetryUpdate?: (data: { x: number; y: number; focus: number; target: string }) => void;
}

/**
 * Main WebGL Hero Canvas Container with Interactive Spotlight and Stable Persistence.
 */
export default function WebGLHeroScene({ onTelemetryUpdate }: WebGLHeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  // Safe DPR computation
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

  // Pointer tracking across the entire screen
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current = { x, y, active: true };
  }, []);

  const handlePointerLeave = useCallback(() => {
    pointerRef.current = { x: 0, y: 0, active: false };
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 1.0, 5.8], fov: 38, near: 0.1, far: 30 }}
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
