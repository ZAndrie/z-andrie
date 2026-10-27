"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

interface RoomSceneProps {
  pointerRef: React.MutableRefObject<{ x: number; y: number; active: boolean }>;
  onTelemetryUpdate?: (data: { x: number; y: number; focus: number; target: string }) => void;
}

// Deterministic PRNG for pure generation
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Procedural Vintage 3D Desk Setup (Retro Computer, Chair, Bookshelf, Lamp, Dust).
 */
export default function RoomScene3D({ pointerRef, onTelemetryUpdate }: RoomSceneProps) {
  const { viewport } = useThree();

  // Refs for moving components
  const lampGroupRef = useRef<THREE.Group>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const targetObjectRef = useRef<THREE.Object3D>(null);
  const dustRef = useRef<THREE.Points>(null);
  const screenTextRef = useRef<THREE.Mesh>(null);
  const wallWordRef = useRef<THREE.Mesh>(null);

  // Stable dust motes inside the spotlight cone
  const dustCount = 1200;
  const [dustPositions, dustSpeeds, dustOffsets] = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    const speeds = new Float32Array(dustCount);
    const offsets = new Float32Array(dustCount * 3);
    const rng = mulberry32(42424);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      const r = Math.pow(rng(), 0.7) * 2.2;
      const theta = rng() * Math.PI * 2;
      const y = -1.2 + rng() * 3.8;

      pos[i3] = Math.cos(theta) * r;
      pos[i3 + 1] = y;
      pos[i3 + 2] = -0.5 + Math.sin(theta) * (r * 0.7);

      offsets[i3] = pos[i3];
      offsets[i3 + 1] = pos[i3 + 1];
      offsets[i3 + 2] = pos[i3 + 2];

      speeds[i] = 0.2 + rng() * 0.6;
    }
    return [pos, speeds, offsets];
  }, [dustCount]);

  // Texture for the glowing CRT monitor screen
  const screenTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#07120a";
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#4ade80";
    ctx.font = "16px 'IBM Plex Mono', monospace";
    ctx.fillText("> Z-ANDRIE.SYS", 18, 38);
    ctx.fillText("READY_ 2026", 18, 62);
    ctx.fillText("REACT 19 / THREE", 18, 90);
    ctx.fillText("FPS: 60 | LIVE", 18, 114);
    ctx.fillText("STATUS: ACTIVE", 18, 140);
    ctx.fillText("LAMPLIGHT ON", 18, 168);

    // Scanlines
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    for (let y = 0; y < 256; y += 4) {
      ctx.fillRect(0, y, 256, 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Texture for the shadow word on the wall ("Z ANDRIE")
  const wallWordTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 512, 256);
    ctx.fillStyle = "#f2dcb4";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 82px 'Big Shoulders Stencil', Impact, sans-serif";
    ctx.fillText("Z ANDRIE", 256, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Target object for Spotlight aiming
  useEffect(() => {
    if (spotLightRef.current && targetObjectRef.current) {
      spotLightRef.current.target = targetObjectRef.current;
    }
  }, []);

  // Frame physics loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pointer = pointerRef.current;

    // Smooth aim tracking
    const aimX = pointer.x * (viewport.width * 0.35);
    const aimY = -0.4 + pointer.y * (viewport.height * 0.25);
    const aimZ = -1.2;

    if (targetObjectRef.current) {
      targetObjectRef.current.position.x = THREE.MathUtils.lerp(targetObjectRef.current.position.x, aimX, 0.06);
      targetObjectRef.current.position.y = THREE.MathUtils.lerp(targetObjectRef.current.position.y, aimY, 0.06);
      targetObjectRef.current.position.z = THREE.MathUtils.lerp(targetObjectRef.current.position.z, aimZ, 0.06);
    }

    // Lamp shade tilt
    if (lampGroupRef.current) {
      lampGroupRef.current.rotation.z = THREE.MathUtils.lerp(lampGroupRef.current.rotation.z, -pointer.x * 0.18, 0.05);
      lampGroupRef.current.rotation.x = THREE.MathUtils.lerp(lampGroupRef.current.rotation.x, pointer.y * 0.14, 0.05);
    }

    // Dust particles drift inside light cone
    if (dustRef.current) {
      const posAttr = dustRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3;
        const spd = dustSpeeds[i];

        // Smooth vertical drift and gentle floating turbulence (no sudden loop)
        posArray[i3 + 1] = dustOffsets[i3 + 1] + Math.sin(time * spd + i) * 0.25;
        posArray[i3] = dustOffsets[i3] + Math.cos(time * 0.5 * spd + i * 0.5) * 0.15;
        posArray[i3 + 2] = dustOffsets[i3 + 2] + Math.sin(time * 0.4 * spd + i * 0.3) * 0.15;
      }
      posAttr.needsUpdate = true;
    }

    // Dynamic wall word visibility based on light aim proximity
    if (wallWordRef.current) {
      const wallDist = Math.hypot(aimX - 0, aimY - 1.4);
      const intensity = Math.max(0, 1 - wallDist / 2.2);
      (wallWordRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1 + intensity * 0.85;
    }

    // Telemetry updates
    if (onTelemetryUpdate && Math.random() < 0.1) {
      onTelemetryUpdate({
        x: Math.round(pointer.x * 100) / 100,
        y: Math.round(pointer.y * 100) / 100,
        focus: Math.round(Math.max(0, Math.min(100, (1 - Math.hypot(pointer.x, pointer.y)) * 100))),
        target: "ISOMETRIC DESK",
      });
    }
  });

  return (
    <>
      {/* Target object for spotlight tracking */}
      <object3D ref={targetObjectRef} position={[0, -0.4, -1.2]} />

      {/* Deep dark ambient fill */}
      <ambientLight color="#0e0c0a" intensity={0.65} />

      {/* Overhead Lamp assembly with Spotlight */}
      <group ref={lampGroupRef} position={[0, 2.8, -0.2]}>
        {/* Cord from ceiling */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 1.6, 8]} />
          <meshStandardMaterial color="#1a1816" roughness={0.7} />
        </mesh>

        {/* Lamp Cone Shade */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.38, 0.35, 32, 1, true]} />
          <meshStandardMaterial color="#1f1b17" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Glowing bulb inside shade */}
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#fff2db" />
        </mesh>

        {/* Theatrical Spotlight shining down */}
        <spotLight
          ref={spotLightRef}
          position={[0, -0.08, 0]}
          color="#f4ddb8"
          intensity={5.8}
          angle={0.62}
          penumbra={0.78}
          distance={16}
          decay={1.8}
          castShadow
          shadow-bias={-0.0001}
        />

        {/* Subtle warm point light for local glow */}
        <pointLight position={[0, -0.1, 0]} color="#f2dcb4" intensity={1.2} distance={4} decay={1.5} />
      </group>

      {/* Theatrical Back Wall Plane */}
      <mesh position={[0, 1.2, -2.4]} receiveShadow>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial color="#100e0c" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Stencil Word projected on Wall ("Z ANDRIE") */}
      {wallWordTexture && (
        <mesh ref={wallWordRef} position={[0, 1.5, -2.38]}>
          <planeGeometry args={[4.2, 2.1]} />
          <meshBasicMaterial
            map={wallWordTexture}
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Floor Plane */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#0c0b09" roughness={0.75} metalness={0.15} />
      </mesh>

      {/* Isometric Desk Setup */}
      <group position={[0, -0.7, -1.0]}>
        {/* Table Top */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.08, 1.2]} />
          <meshStandardMaterial color="#221e1a" roughness={0.6} metalness={0.2} />
        </mesh>

        {/* Desk Steel Legs */}
        {[
          [-1.15, -0.5],
          [1.15, -0.5],
          [-1.15, 0.5],
          [1.15, 0.5],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.05, z]} castShadow>
            <cylinderGeometry args={[0.032, 0.032, 0.95, 12]} />
            <meshStandardMaterial color="#141210" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}

        {/* Vintage CRT Computer Monitor */}
        <group position={[-0.32, 0.82, -0.15]} rotation={[0, 0.12, 0]}>
          {/* Monitor Casing */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.62, 0.56, 0.52]} />
            <meshStandardMaterial color="#cfc7b8" roughness={0.55} />
          </mesh>

          {/* CRT Screen Frame */}
          <mesh position={[0, 0, 0.265]} castShadow>
            <boxGeometry args={[0.54, 0.46, 0.04]} />
            <meshStandardMaterial color="#302d29" roughness={0.4} />
          </mesh>

          {/* Glowing Green Phosphor Display */}
          {screenTexture && (
            <mesh ref={screenTextRef} position={[0, 0, 0.288]}>
              <planeGeometry args={[0.48, 0.4]} />
              <meshBasicMaterial map={screenTexture} toneMapped={false} />
            </mesh>
          )}

          {/* Monitor Stand */}
          <mesh position={[0, -0.32, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.22, 0.1, 16]} />
            <meshStandardMaterial color="#948c7e" roughness={0.6} />
          </mesh>

          {/* Vintage Keyboard */}
          <mesh position={[0, -0.31, 0.54]} rotation={[-0.08, 0, 0]} castShadow>
            <boxGeometry args={[0.56, 0.04, 0.22]} />
            <meshStandardMaterial color="#c2baa9" roughness={0.5} />
          </mesh>
        </group>

        {/* Desktop Companion Robot / Radio */}
        <group position={[0.48, 0.62, 0.05]} rotation={[0, -0.22, 0]}>
          {/* Body */}
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.22, 0.24]} />
            <meshStandardMaterial color="#2c2823" roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Glowing LED Eyes */}
          <mesh position={[-0.07, 0.02, 0.125]}>
            <circleGeometry args={[0.035, 16]} />
            <meshBasicMaterial color="#f2dcb4" />
          </mesh>
          <mesh position={[0.07, 0.02, 0.125]}>
            <circleGeometry args={[0.035, 16]} />
            <meshBasicMaterial color="#f2dcb4" />
          </mesh>
        </group>

        {/* Office Chair */}
        <group position={[0, 0.15, 0.9]} rotation={[0, -0.15, 0]}>
          {/* Seat Cushion */}
          <mesh position={[0, 0.18, 0]} castShadow>
            <boxGeometry args={[0.55, 0.09, 0.52]} />
            <meshStandardMaterial color="#1a1816" roughness={0.7} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.58, 0.24]} rotation={[-0.1, 0, 0]} castShadow>
            <boxGeometry args={[0.5, 0.62, 0.08]} />
            <meshStandardMaterial color="#1a1816" roughness={0.7} />
          </mesh>
          {/* Vertical Post */}
          <mesh position={[0, -0.1, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.44, 12]} />
            <meshStandardMaterial color="#403c37" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* 5-star Caster Base */}
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.04, 5]} />
            <meshStandardMaterial color="#22201d" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>

        {/* Bookshelf with Books */}
        <group position={[-1.7, 0.8, -0.3]} rotation={[0, 0.24, 0]}>
          {/* Shelf Frame */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.6, 1.8, 0.4]} />
            <meshStandardMaterial color="#1b1815" roughness={0.8} />
          </mesh>
          {/* Book rows */}
          {[-0.4, 0.1, 0.55].map((y, rowIdx) => (
            <group key={rowIdx} position={[-0.2, y, 0.08]}>
              {[0, 0.08, 0.16, 0.24, 0.32].map((x, bookIdx) => (
                <mesh key={bookIdx} position={[x, 0, 0]} castShadow>
                  <boxGeometry args={[0.065, 0.28, 0.24]} />
                  <meshStandardMaterial
                    color={bookIdx % 2 === 0 ? "#d36b54" : bookIdx === 1 ? "#786c5f" : "#a8a59d"}
                    roughness={0.6}
                  />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      </group>

      {/* Floating Dust Particles drifting gently in the light cone */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.032}
          color="#f4ddb8"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  );
}
