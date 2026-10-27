"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

interface WebGLHeroSceneProps {
  onTelemetryUpdate?: (data: { x: number; y: number; focus: number; target: string }) => void;
}

// Deterministic PRNG for pure particle color generation
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates particle positions by sampling text rendered onto an offscreen canvas.
 */
function sampleTextPoints(text: string, count: number, width: number = 600, height: number = 200): Float32Array {
  if (typeof document === "undefined") return new Float32Array(count * 3);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return new Float32Array(count * 3);

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 78px 'Big Shoulders Stencil', 'Arial Narrow', sans-serif`;
  ctx.fillText(text, width / 2, height / 2);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const validPixels: [number, number][] = [];

  const step = 2;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      if (data[idx] > 128) {
        validPixels.push([x, y]);
      }
    }
  }

  const positions = new Float32Array(count * 3);
  const scale = 0.016;
  const len = validPixels.length;
  const rng = mulberry32(12345);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    if (len > 0) {
      const pixel = validPixels[i % len];
      positions[i3] = (pixel[0] - width / 2) * scale + (rng() - 0.5) * 0.05;
      positions[i3 + 1] = -(pixel[1] - height / 2) * scale + (rng() - 0.5) * 0.05;
      positions[i3 + 2] = (rng() - 0.5) * 0.4;
    } else {
      positions[i3] = (rng() - 0.5) * 8;
      positions[i3 + 1] = (rng() - 0.5) * 5;
      positions[i3 + 2] = (rng() - 0.5) * 3;
    }
  }

  return positions;
}

/**
 * Generates particle positions for a stylized logo / monogram ("Z" with frame).
 */
function sampleLogoPoints(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const rng = mulberry32(67890);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const t = i / count;
    if (t < 0.35) {
      const u = t / 0.35;
      positions[i3] = -1.6 + u * 3.2;
      positions[i3 + 1] = 1.6;
      positions[i3 + 2] = (rng() - 0.5) * 0.2;
    } else if (t < 0.70) {
      const u = (t - 0.35) / 0.35;
      positions[i3] = 1.6 - u * 3.2;
      positions[i3 + 1] = 1.6 - u * 3.2;
      positions[i3 + 2] = (rng() - 0.5) * 0.2;
    } else {
      const u = (t - 0.70) / 0.30;
      positions[i3] = -1.6 + u * 3.2;
      positions[i3 + 1] = -1.6;
      positions[i3 + 2] = (rng() - 0.5) * 0.2;
    }
    positions[i3] += (rng() - 0.5) * 0.08;
    positions[i3 + 1] += (rng() - 0.5) * 0.08;
  }
  return positions;
}

/**
 * Generates loose floating dust motes filling the 3D spotlight cone volume.
 */
function sampleAmbientDust(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const rng = mulberry32(54321);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = rng() * 3.8;
    const theta = rng() * Math.PI * 2;
    positions[i3] = Math.cos(theta) * r;
    positions[i3 + 1] = (rng() - 0.5) * 5.5;
    positions[i3 + 2] = (rng() - 0.5) * 3.5;
  }
  return positions;
}

/**
 * Generates deterministic particle colors.
 */
function createParticleColors(count: number): Float32Array {
  const c = new Float32Array(count * 3);
  const colorAmber = new THREE.Color("#f2dcb4");
  const colorTerracotta = new THREE.Color("#d36b54");
  const colorWhite = new THREE.Color("#ffffff");
  const rng = mulberry32(99999);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const pick = rng();
    const col = pick < 0.65 ? colorTerracotta : pick < 0.9 ? colorAmber : colorWhite;
    c[i3] = col.r;
    c[i3 + 1] = col.g;
    c[i3 + 2] = col.b;
  }
  return c;
}

/**
 * The 3D Particles Mesh and Physics Loop.
 */
function ParticleField({
  particleCount,
  pointerRef,
  onTelemetryUpdate,
}: {
  particleCount: number;
  pointerRef: React.MutableRefObject<{ x: number; y: number; active: boolean }>;
  onTelemetryUpdate?: (data: { x: number; y: number; focus: number; target: string }) => void;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const spotLightRef = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  // Target morph formations (pure, static per count)
  const stateA = useMemo(() => sampleTextPoints("Z ANDRIE", particleCount), [particleCount]);
  const stateB = useMemo(() => sampleLogoPoints(particleCount), [particleCount]);
  const stateDust = useMemo(() => sampleAmbientDust(particleCount), [particleCount]);
  const colors = useMemo(() => createParticleColors(particleCount), [particleCount]);

  // Physics velocities held in ref, initialized on first use in useFrame
  const velocitiesRef = useRef<Float32Array | null>(null);

  // Active target state: 0 = "Z ANDRIE", 1 = LOGO
  const targetModeRef = useRef<number>(0);
  const morphAlphaRef = useRef<number>(0);
  const scrollScatterRef = useRef<number>(0);

  // Toggle morph target on click / space
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        targetModeRef.current = targetModeRef.current === 0 ? 1 : 0;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Sync scroll scatter
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      scrollScatterRef.current = Math.min(1.2, scrollY / (heroHeight * 0.7));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Render loop
  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    if (!velocitiesRef.current || velocitiesRef.current.length !== particleCount * 3) {
      velocitiesRef.current = new Float32Array(particleCount * 3);
    }
    const velocities = velocitiesRef.current;

    const time = state.clock.getElapsedTime();
    const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    const pointer = pointerRef.current;
    const targetX = pointer.x * (viewport.width * 0.45);
    const targetY = pointer.y * (viewport.height * 0.45);

    // Update spotlight follow
    if (spotLightRef.current) {
      spotLightRef.current.position.x = THREE.MathUtils.lerp(spotLightRef.current.position.x, targetX * 0.8, 0.08);
      spotLightRef.current.position.y = THREE.MathUtils.lerp(spotLightRef.current.position.y, targetY * 0.8, 0.08);
    }

    // Morph interpolation
    const destMode = targetModeRef.current;
    morphAlphaRef.current = THREE.MathUtils.lerp(morphAlphaRef.current, destMode, 0.04);
    const alpha = morphAlphaRef.current;
    const scatter = scrollScatterRef.current;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Base target calculation
      let tx = THREE.MathUtils.lerp(stateA[i3], stateB[i3], alpha);
      let ty = THREE.MathUtils.lerp(stateA[i3 + 1], stateB[i3 + 1], alpha);
      let tz = THREE.MathUtils.lerp(stateA[i3 + 2], stateB[i3 + 2], alpha);

      // Subtle atmospheric breathing / turbulence
      const noise = Math.sin(time * 1.5 + i * 0.05) * 0.04;
      const noiseY = Math.cos(time * 1.2 + i * 0.04) * 0.04;
      tx += noise;
      ty += noiseY;

      // Scatter outward as user scrolls down
      if (scatter > 0.01) {
        tx = THREE.MathUtils.lerp(tx, stateDust[i3] * (1 + scatter * 2.5), scatter);
        ty = THREE.MathUtils.lerp(ty, stateDust[i3 + 1] + scatter * 5.0, scatter);
        tz = THREE.MathUtils.lerp(tz, stateDust[i3 + 2] * (1 + scatter * 2.0), scatter);
      }

      // Pointer interaction (interactive physics stir & repulsion)
      const dx = posArray[i3] - targetX;
      const dy = posArray[i3 + 1] - targetY;
      const distSq = dx * dx + dy * dy;
      const interactRadius = 1.8;

      if (distSq < interactRadius * interactRadius) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / interactRadius) * 0.12;
        velocities[i3] += (dx / dist) * force;
        velocities[i3 + 1] += (dy / dist) * force;
      }

      // Spring back towards target
      velocities[i3] += (tx - posArray[i3]) * 0.06;
      velocities[i3 + 1] += (ty - posArray[i3 + 1]) * 0.06;
      velocities[i3 + 2] += (tz - posArray[i3 + 2]) * 0.06;

      // Friction / Damping
      velocities[i3] *= 0.82;
      velocities[i3 + 1] *= 0.82;
      velocities[i3 + 2] *= 0.82;

      // Apply
      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];
    }

    posAttr.needsUpdate = true;

    // Telemetry updates
    if (onTelemetryUpdate && Math.random() < 0.15) {
      const focus = Math.max(0, Math.min(100, Math.round((1 - scatter) * 100)));
      onTelemetryUpdate({
        x: Math.round(pointer.x * 100) / 100,
        y: Math.round(pointer.y * 100) / 100,
        focus,
        target: destMode === 0 ? "Z ANDRIE" : "MONOGRAM LOGO",
      });
    }
  });

  return (
    <>
      {/* Warm Incandescent Spotlight follow */}
      <pointLight
        ref={spotLightRef}
        position={[0, 0, 3.5]}
        color="#f2dcb4"
        intensity={3.2}
        distance={9}
        decay={1.6}
      />
      {/* Terracotta Ambient Fill */}
      <ambientLight color="#1a120e" intensity={0.8} />

      {/* Theatrical Wall Backdrop Plane */}
      <mesh position={[0, 0, -2.5]} receiveShadow>
        <planeGeometry args={[22, 14]} />
        <meshStandardMaterial color="#080808" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Interactive Morphing Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[stateA, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  );
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
  const { dpr, particleCount } = useMemo(() => {
    if (typeof window === "undefined") return { dpr: 1, particleCount: 1800 };
    const urlParams = new URLSearchParams(window.location.search);
    const dprParam = parseFloat(urlParams.get("dpr") || "");

    const isLowPower =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      ((navigator as unknown as { deviceMemory?: number }).deviceMemory &&
        (navigator as unknown as { deviceMemory?: number }).deviceMemory! <= 4) ||
      window.innerWidth <= 640;

    const baseDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const finalDpr = !isNaN(dprParam) ? dprParam : isLowPower ? Math.min(baseDpr, 1.1) : baseDpr;
    const finalCount = isLowPower ? 1800 : 3800;

    return { dpr: finalDpr, particleCount: finalCount };
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
          dpr={dpr}
          camera={{ position: [0, 0, 7.2], fov: 38, near: 0.1, far: 30 }}
          gl={{
            antialias: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.NoToneMapping;
            gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
          }}
        >
          <ParticleField
            particleCount={particleCount}
            pointerRef={pointerRef}
            onTelemetryUpdate={onTelemetryUpdate}
          />
        </Canvas>
      )}
    </div>
  );
}
