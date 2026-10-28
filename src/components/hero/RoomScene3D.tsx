"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { emitTelemetry } from "@/lib/telemetry";

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

interface CameraWaypoint {
  progress: number;
  pos: [number, number, number];
  look: [number, number, number];
  targetName: string;
}

/**
 * Camera Choreography Waypoints across the entire page scroll journey:
 * 01. Hero overview: wide isometric room showing the lamp, full desk, monitor, and back wall.
 * 02. About section: camera moves forward and downward, zooming in close to the desk and CRT monitor.
 * 03. Works section: camera adjusts angle to frame the theatrical projector stage.
 * 04. Skills & Expertise: camera tracks right towards the companion robot and bookshelf.
 * 05. Certificates & Blog: elegant atmospheric vantage across the room.
 * 06. Contact: camera centers on the lamp cord.
 */
const CAMERA_WAYPOINTS: CameraWaypoint[] = [
  {
    progress: 0.0,
    pos: [0, 1.05, 5.8],
    look: [0, 0.05, -1.0],
    targetName: "ISOMETRIC OVERVIEW",
  },
  {
    progress: 0.12,
    pos: [-0.22, 0.28, 3.1],
    look: [-0.18, -0.05, -1.0],
    targetName: "DESK & CRT TERMINAL",
  },
  {
    progress: 0.22,
    pos: [-0.15, 0.35, 3.3],
    look: [-0.12, -0.02, -1.0],
    targetName: "PHILOSOPHY WORKSPACE",
  },
  {
    progress: 0.36,
    pos: [0.0, 0.65, 4.3],
    look: [0.0, 0.22, -1.0],
    targetName: "THEATRICAL PROJECTOR",
  },
  {
    progress: 0.55,
    pos: [0.0, 0.6, 4.3],
    look: [0.0, 0.18, -1.0],
    targetName: "PROJECTOR STAGE",
  },
  {
    progress: 0.7,
    pos: [0.45, 0.42, 3.7],
    look: [0.15, 0.05, -1.0],
    targetName: "COMPANION & ARCHITECTURE",
  },
  {
    progress: 0.82,
    pos: [-0.35, 0.58, 4.1],
    look: [-0.05, 0.1, -1.0],
    targetName: "CREDENTIAL VAULT",
  },
  {
    progress: 0.92,
    pos: [-0.1, 0.72, 4.6],
    look: [0.0, 0.12, -1.0],
    targetName: "EDITORIAL ARCHIVE",
  },
  {
    progress: 1.0,
    pos: [0, 0.85, 4.9],
    look: [0, 0.1, -1.0],
    targetName: "LAMP CONTROLS",
  },
];

/**
 * Procedural Theatrical 3D Isometric Room with Interactive Volumetric Spotlight Beam
 * and Scroll-Driven Cinematic Camera Tracking.
 */
export default function RoomScene3D({ pointerRef, onTelemetryUpdate }: RoomSceneProps) {
  const { viewport } = useThree();

  // Primary animation and lighting refs
  const lampAssemblyRef = useRef<THREE.Group>(null);
  const lampCordRef = useRef<THREE.Mesh>(null);
  const beamMeshRef = useRef<THREE.Mesh>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const poolLightRef = useRef<THREE.PointLight>(null);
  const targetObjectRef = useRef<THREE.Object3D>(null);
  const dustRef = useRef<THREE.Points>(null);
  const wallWordRef = useRef<THREE.Mesh>(null);

  // Smooth camera tracking refs
  const currentCamPosRef = useRef(new THREE.Vector3(0, 1.05, 5.8));
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0.05, -1.0));

  // Position coordinates
  const lampPos = useMemo(() => new THREE.Vector3(0, 2.5, 0.4), []);

  // Geometry for the volumetric conical beam (open-ended cylinder with apex at origin)
  const beamGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.04, 1.0, 1.0, 48, 1, true);
    geo.translate(0, 0.5, 0); // origin at top
    geo.rotateX(Math.PI / 2); // along +Z
    return geo;
  }, []);

  // Volumetric beam shader material
  const beamMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uColor: { value: new THREE.Color("#f4ddb8") },
        uOpacity: { value: 0.24 },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying float vAxial;
        varying vec3 vNormalV;
        varying vec3 vViewPos;
        void main() {
          vAxial = position.z;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vViewPos = mv.xyz;
          vNormalV = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uTime;
        varying float vAxial;
        varying vec3 vNormalV;
        varying vec3 vViewPos;
        void main() {
          float facing = abs(dot(normalize(vNormalV), normalize(-vViewPos)));
          float core = pow(facing, 1.25);
          float along = smoothstep(0.0, 0.08, vAxial) * pow(1.0 - clamp(vAxial, 0.0, 1.0), 1.25);
          float a = uOpacity * core * along;
          gl_FragColor = vec4(uColor * a, 1.0);
        }
      `,
    });
  }, []);

  // Dust particles distributed in the 3D volume
  const dustCount = 850;
  const [dustPositions, dustOffsets, dustSpeeds, dustColors] = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    const offsets = new Float32Array(dustCount * 3);
    const speeds = new Float32Array(dustCount);
    const colors = new Float32Array(dustCount * 3);
    const rng = mulberry32(112233);

    const warm = new THREE.Color("#f4ddb8");

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      const x = (rng() - 0.5) * 4.8;
      const y = -1.2 + rng() * 3.8;
      const z = -2.2 + rng() * 3.6;

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;

      offsets[i3] = x;
      offsets[i3 + 1] = y;
      offsets[i3 + 2] = z;

      speeds[i] = 0.2 + rng() * 0.5;

      colors[i3] = warm.r;
      colors[i3 + 1] = warm.g;
      colors[i3 + 2] = warm.b;
    }
    return [pos, offsets, speeds, colors];
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

  // Texture for the wall projected title ("Z ANDRIE")
  const wallWordTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 512, 256);
    ctx.fillStyle = "#f4ddb8";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 84px 'Big Shoulders Stencil', Impact, sans-serif";
    ctx.fillText("Z ANDRIE", 256, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Connect spotlight target
  useEffect(() => {
    if (spotLightRef.current && targetObjectRef.current) {
      spotLightRef.current.target = targetObjectRef.current;
    }
  }, []);

  // Render / Physics / Camera Choreography loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pointer = pointerRef.current;

    // ── 1. SCROLL-DRIVEN CINEMATIC CAMERA CHOREOGRAPHY ──
    let scrollFrac = 0;
    if (typeof window !== "undefined") {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollFrac = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    }

    // Find bounding camera waypoints
    let p1 = CAMERA_WAYPOINTS[0];
    let p2 = CAMERA_WAYPOINTS[CAMERA_WAYPOINTS.length - 1];

    for (let i = 0; i < CAMERA_WAYPOINTS.length - 1; i++) {
      if (scrollFrac >= CAMERA_WAYPOINTS[i].progress && scrollFrac <= CAMERA_WAYPOINTS[i + 1].progress) {
        p1 = CAMERA_WAYPOINTS[i];
        p2 = CAMERA_WAYPOINTS[i + 1];
        break;
      }
    }

    const segRange = Math.max(0.0001, p2.progress - p1.progress);
    const segFrac = Math.max(0, Math.min(1, (scrollFrac - p1.progress) / segRange));
    // Smooth cosine easing for natural dolly movement
    const ease = 0.5 - 0.5 * Math.cos(segFrac * Math.PI);

    const targetPos = new THREE.Vector3(
      THREE.MathUtils.lerp(p1.pos[0], p2.pos[0], ease),
      THREE.MathUtils.lerp(p1.pos[1], p2.pos[1], ease),
      THREE.MathUtils.lerp(p1.pos[2], p2.pos[2], ease)
    );

    const targetLook = new THREE.Vector3(
      THREE.MathUtils.lerp(p1.look[0], p2.look[0], ease),
      THREE.MathUtils.lerp(p1.look[1], p2.look[1], ease),
      THREE.MathUtils.lerp(p1.look[2], p2.look[2], ease)
    );

    // Subtle interactive mouse parallax
    targetPos.x += pointer.x * 0.16;
    targetPos.y += pointer.y * 0.1;

    // Smooth cinematic lerp (damping)
    currentCamPosRef.current.lerp(targetPos, 0.05);
    currentLookAtRef.current.lerp(targetLook, 0.05);

    state.camera.position.copy(currentCamPosRef.current);
    state.camera.lookAt(currentLookAtRef.current);

    // ── 2. INTERACTIVE SPOTLIGHT AIMING ──
    // Pointer target aim: sweeps across desk and back wall
    const aimX = pointer.x * (viewport.width * 0.42);
    // When zoomed close to desk, spotlight dips naturally towards desk surface
    const isDeskClose = scrollFrac > 0.08 && scrollFrac < 0.32;
    const baseAimY = isDeskClose ? -0.1 : 0.2;
    const aimY = baseAimY + pointer.y * (viewport.height * 0.32);
    const aimZ = -1.8;

    // Lerp target position
    if (targetObjectRef.current) {
      targetObjectRef.current.position.x = THREE.MathUtils.lerp(targetObjectRef.current.position.x, aimX, 0.08);
      targetObjectRef.current.position.y = THREE.MathUtils.lerp(targetObjectRef.current.position.y, aimY, 0.08);
      targetObjectRef.current.position.z = THREE.MathUtils.lerp(targetObjectRef.current.position.z, aimZ, 0.08);
    }

    const currentAim = targetObjectRef.current ? targetObjectRef.current.position : new THREE.Vector3(aimX, aimY, aimZ);

    // Lamp assembly tilt: look towards aim
    if (lampAssemblyRef.current) {
      lampAssemblyRef.current.lookAt(currentAim);
    }

    // Volumetric beam positioning and scaling
    if (beamMeshRef.current) {
      const dist = lampPos.distanceTo(currentAim);
      const spotAngle = 0.52; // Half-angle
      const radius = Math.tan(spotAngle) * dist;

      beamMeshRef.current.position.copy(lampPos);
      beamMeshRef.current.lookAt(currentAim);
      beamMeshRef.current.scale.set(radius, radius, dist * 1.02);

      const mat = beamMeshRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms?.uTime) {
        mat.uniforms.uTime.value = time;
      }
    }

    // Spotlight pool illumination right where the beam lands
    if (poolLightRef.current) {
      poolLightRef.current.position.set(currentAim.x, currentAim.y, currentAim.z + 0.35);
    }

    // Dynamic wall word illumination
    if (wallWordRef.current) {
      const isPreloading = typeof document !== "undefined" && document.documentElement.dataset.preloader === "loading";
      if (isPreloading) {
        (wallWordRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      } else {
        const distToWord = Math.hypot(currentAim.x - 0, currentAim.y - 1.5);
        const intensity = Math.max(0, 1 - distToWord / 2.0);
        (wallWordRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + intensity * 0.85;
      }
    }

    // Dust motes: smooth gentle drift inside the light beam
    if (dustRef.current) {
      const posAttr = dustRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      // Beam direction unit vector
      const beamDir = new THREE.Vector3().subVectors(currentAim, lampPos).normalize();

      for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3;
        const spd = dustSpeeds[i];

        // Smooth sinusoidal turbulence (no hard loops)
        posArray[i3] = dustOffsets[i3] + Math.sin(time * 0.3 * spd + i * 0.2) * 0.15;
        posArray[i3 + 1] = dustOffsets[i3 + 1] + Math.cos(time * 0.4 * spd + i * 0.3) * 0.2;
        posArray[i3 + 2] = dustOffsets[i3 + 2] + Math.sin(time * 0.25 * spd + i * 0.1) * 0.12;

        // Check if mote is inside the light cone
        const motePos = new THREE.Vector3(posArray[i3], posArray[i3 + 1], posArray[i3 + 2]);
        const toMote = motePos.sub(lampPos);
        const distMote = toMote.length();
        const cosAngle = toMote.normalize().dot(beamDir);

        // Hide motes outside the spotlight beam
        const inCone = cosAngle > 0.86 && distMote < 6.0;
        if (!inCone) {
          posArray[i3 + 1] = -10;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Telemetry broadcast (updates Hero HUD and coordinates)
    const telemetryPayload = {
      x: Math.round(pointer.x * 100) / 100,
      y: Math.round(pointer.y * 100) / 100,
      focus: Math.round(Math.max(0, Math.min(100, (1 - Math.hypot(pointer.x, pointer.y)) * 100))),
      target: p1.targetName,
    };

    emitTelemetry(telemetryPayload);
    if (onTelemetryUpdate) {
      onTelemetryUpdate(telemetryPayload);
    }
  });

  return (
    <>
      {/* Target object for spotlight and beam aiming */}
      <object3D ref={targetObjectRef} position={[0, 0, -1.8]} />

      {/* Warm ambient fill matching cozy dev room */}
      <ambientLight color="#181512" intensity={1.1} />

      {/* Hanging Lamp Cord from ceiling */}
      <mesh ref={lampCordRef} position={[0, 3.35, 0.4]}>
        <cylinderGeometry args={[0.005, 0.005, 1.7, 8]} />
        <meshStandardMaterial color="#1f1c19" roughness={0.7} />
      </mesh>

      {/* Overhead Lamp Shade Assembly (Tilts towards target) */}
      <group ref={lampAssemblyRef} position={lampPos}>
        {/* Lamp Cone Shade */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.36, 0.4, 32, 1, true]} />
          <meshStandardMaterial color="#1a1715" roughness={0.4} metalness={0.7} side={THREE.DoubleSide} />
        </mesh>

        {/* Glowing bulb inside shade */}
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshBasicMaterial color="#fff4e0" toneMapped={false} />
        </mesh>

        {/* Overhead SpotLight */}
        <spotLight
          ref={spotLightRef}
          position={[0, 0, 0.08]}
          color="#f4ddb8"
          intensity={6.5}
          angle={0.52}
          penumbra={0.65}
          distance={15}
          decay={1.6}
        />
      </group>

      {/* Volumetric Glowing Light Cone Mesh */}
      <mesh ref={beamMeshRef} geometry={beamGeometry} material={beamMaterial} renderOrder={10} raycast={() => null} />

      {/* Incandescent Light Pool at Aim Point */}
      <pointLight ref={poolLightRef} position={[0, 0, -1.5]} color="#f4ddb8" intensity={4.5} distance={5.5} decay={1.6} />

      {/* Back Wall Plane */}
      <mesh position={[0, 1.2, -2.4]} receiveShadow>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial color="#161412" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Wall Stencil Word ("Z ANDRIE") */}
      {wallWordTexture && (
        <mesh ref={wallWordRef} position={[0, 1.5, -2.38]}>
          <planeGeometry args={[4.2, 2.1]} />
          <meshBasicMaterial
            map={wallWordTexture}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Floor Plane */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#0f0e0c" roughness={0.7} metalness={0.15} />
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
          <mesh key={i} position={[x, -0.05, z]}>
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
          <mesh position={[0, 0, 0.265]}>
            <boxGeometry args={[0.54, 0.46, 0.04]} />
            <meshStandardMaterial color="#302d29" roughness={0.4} />
          </mesh>

          {/* Glowing Green Phosphor Display */}
          {screenTexture && (
            <mesh position={[0, 0, 0.288]}>
              <planeGeometry args={[0.48, 0.4]} />
              <meshBasicMaterial map={screenTexture} toneMapped={false} />
            </mesh>
          )}

          {/* Monitor Stand */}
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.16, 0.22, 0.1, 16]} />
            <meshStandardMaterial color="#948c7e" roughness={0.6} />
          </mesh>

          {/* Vintage Keyboard */}
          <mesh position={[0, -0.31, 0.54]} rotation={[-0.08, 0, 0]}>
            <boxGeometry args={[0.56, 0.04, 0.22]} />
            <meshStandardMaterial color="#c2baa9" roughness={0.5} />
          </mesh>
        </group>

        {/* Desktop Companion Robot / Radio */}
        <group position={[0.48, 0.62, 0.05]} rotation={[0, -0.22, 0]}>
          {/* Body */}
          <mesh>
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
          <mesh position={[0, 0.18, 0]}>
            <boxGeometry args={[0.55, 0.09, 0.52]} />
            <meshStandardMaterial color="#1a1816" roughness={0.7} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.58, 0.24]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.5, 0.62, 0.08]} />
            <meshStandardMaterial color="#1a1816" roughness={0.7} />
          </mesh>
          {/* Vertical Post */}
          <mesh position={[0, -0.1, 0]}>
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
          <mesh>
            <boxGeometry args={[0.6, 1.8, 0.4]} />
            <meshStandardMaterial color="#1b1815" roughness={0.8} />
          </mesh>
          {/* Book rows */}
          {[-0.4, 0.1, 0.55].map((y, rowIdx) => (
            <group key={rowIdx} position={[-0.2, y, 0.08]}>
              {[0, 0.08, 0.16, 0.24, 0.32].map((x, bookIdx) => (
                <mesh key={bookIdx} position={[x, 0, 0]}>
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

      {/* Floating Dust Particles (Only visible inside spotlight beam) */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[dustColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.036}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  );
}
