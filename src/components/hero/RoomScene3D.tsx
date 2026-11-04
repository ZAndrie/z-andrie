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

  // Companion bot micro-interaction refs
  const companionEyeLeftRef = useRef<THREE.Mesh>(null);
  const companionEyeRightRef = useRef<THREE.Mesh>(null);
  const companionAntennaTipRef = useRef<THREE.Mesh>(null);

  // Smooth camera tracking refs
  const currentCamPosRef = useRef(new THREE.Vector3(0, 1.05, 5.8));
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0.05, -1.0));

  // Reusable scratch 3D vectors & plane to eliminate per-frame GC allocations
  const targetPosScratch = useMemo(() => new THREE.Vector3(), []);
  const targetLookScratch = useMemo(() => new THREE.Vector3(), []);
  const targetPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 1.1), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);
  const tempBeamDir = useMemo(() => new THREE.Vector3(), []);
  const tempMotePos = useMemo(() => new THREE.Vector3(), []);
  const tempToMote = useMemo(() => new THREE.Vector3(), []);

  // Cached scroll height to eliminate DOM layout thrashing in useFrame
  const maxScrollRef = useRef(1);
  const lastTelemetryTime = useRef(0);

  useEffect(() => {
    const updateMaxScroll = () => {
      if (typeof window !== "undefined") {
        maxScrollRef.current = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        );
      }
    };
    updateMaxScroll();
    window.addEventListener("resize", updateMaxScroll, { passive: true });
    window.addEventListener("preloader:done", updateMaxScroll);
    return () => {
      window.removeEventListener("resize", updateMaxScroll);
      window.removeEventListener("preloader:done", updateMaxScroll);
    };
  }, []);

  // Position coordinates
  const lampPos = useMemo(() => new THREE.Vector3(0, 2.5, 0.4), []);
  const pointerVec = useMemo(() => new THREE.Vector2(), []);

  // Geometry for the volumetric conical beam (apex at origin, base along -Z towards lookAt target)
  const beamGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.04, 1.0, 1.0, 48, 1, true);
    geo.translate(0, -0.5, 0); // Apex at top (0, 0, 0), base at (0, -1, 0)
    geo.rotateX(-Math.PI / 2); // Rotate so base points down -Z (Three.js lookAt forward direction)
    return geo;
  }, []);

  // Volumetric beam shader material (moody 2700K incandescent spotlight beam)
  const beamMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uColor: { value: new THREE.Color("#f4ddb8") },
        uOpacity: { value: 0.28 },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying float vAxial;
        varying vec3 vNormalV;
        varying vec3 vViewPos;
        void main() {
          vAxial = -position.z; // position.z goes from 0.0 down to -1.0
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

  // Texture for the glowing Studio Display screen (Modern Creative Tech Architecture)
  const screenTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Dark sleek IDE backdrop
    ctx.fillStyle = "#090a0f";
    ctx.fillRect(0, 0, 512, 320);

    // Editor top tab bar
    ctx.fillStyle = "#12141c";
    ctx.fillRect(0, 0, 512, 28);

    // Window controls
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(16, 14, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(30, 14, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(44, 14, 4, 0, Math.PI * 2);
    ctx.fill();

    // Tab title
    ctx.fillStyle = "#9ca3af";
    ctx.font = "11px 'IBM Plex Mono', monospace";
    ctx.fillText("StudioCore.ts", 64, 18);

    // Code lines with modern syntax highlighting
    ctx.font = "12px 'IBM Plex Mono', monospace";

    ctx.fillStyle = "#c084fc";
    ctx.fillText("import", 20, 56);
    ctx.fillStyle = "#f3f4f6";
    ctx.fillText(" { Experience } ", 75, 56);
    ctx.fillStyle = "#c084fc";
    ctx.fillText("from", 195, 56);
    ctx.fillStyle = "#34d399";
    ctx.fillText(" \"@z-andrie/spatial\";", 235, 56);

    ctx.fillStyle = "#60a5fa";
    ctx.fillText("interface", 20, 84);
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(" ModernCreative", 95, 84);
    ctx.fillStyle = "#f3f4f6";
    ctx.fillText(" {", 225, 84);

    ctx.fillStyle = "#9ca3af";
    ctx.fillText("  craft: ", 20, 108);
    ctx.fillStyle = "#34d399";
    ctx.fillText("\"Sleek WebGL & 3D Experiences\";", 80, 108);

    ctx.fillStyle = "#9ca3af";
    ctx.fillText("  velocity: ", 20, 130);
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("100", 100, 130);
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("; // FPS 60", 125, 130);

    ctx.fillStyle = "#f3f4f6";
    ctx.fillText("}", 20, 154);

    ctx.fillStyle = "#c084fc";
    ctx.fillText("export const", 20, 184);
    ctx.fillStyle = "#60a5fa";
    ctx.fillText(" studio", 115, 184);
    ctx.fillStyle = "#f3f4f6";
    ctx.fillText(" = ", 170, 184);
    ctx.fillStyle = "#c084fc";
    ctx.fillText("new", 190, 184);
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(" Experience", 220, 184);
    ctx.fillStyle = "#f3f4f6";
    ctx.fillText("({", 310, 184);

    ctx.fillStyle = "#9ca3af";
    ctx.fillText("  status: ", 20, 208);
    ctx.fillStyle = "#34d399";
    ctx.fillText("\"AVAILABLE FOR COMMISSIONS\",", 90, 208);

    ctx.fillStyle = "#9ca3af";
    ctx.fillText("  location: ", 20, 230);
    ctx.fillStyle = "#34d399";
    ctx.fillText("\"PHILIPPINES (GMT+8)\",", 105, 230);

    ctx.fillStyle = "#f3f4f6";
    ctx.fillText("});", 20, 254);

    // Terminal status footer line
    ctx.fillStyle = "#131722";
    ctx.fillRect(0, 285, 512, 35);
    ctx.fillStyle = "#10b981";
    ctx.fillText("● SYSTEM READY", 20, 307);
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("TS 5.5 | NEXT 16 | THREE.JS ACTIVE", 215, 307);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Procedural modern minimalist architectural area rug
  const rugTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Dark charcoal woven wool
    ctx.fillStyle = "#111114";
    ctx.fillRect(0, 0, 512, 384);

    // Subtle fine architectural grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 384);
      ctx.stroke();
    }
    for (let y = 0; y < 384; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Outer refined border (warm champagne)
    ctx.strokeStyle = "rgba(244, 221, 184, 0.25)";
    ctx.lineWidth = 3;
    ctx.strokeRect(24, 24, 464, 336);

    // Inner subtle terracotta hairline border
    ctx.strokeStyle = "rgba(211, 107, 84, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, 440, 312);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Framed sleek modern architectural exhibition print
  const posterTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Matte dark charcoal background
    ctx.fillStyle = "#0c0d12";
    ctx.fillRect(0, 0, 256, 360);

    // Minimal hairline border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, 232, 336);

    // Bauhaus / Minimalist circle composition
    const grad = ctx.createLinearGradient(60, 60, 200, 200);
    grad.addColorStop(0, "#d36b54");
    grad.addColorStop(1, "#f4ddb8");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(128, 120, 52, 0, Math.PI * 2);
    ctx.fill();

    // Architectural geometric accent line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(32, 200);
    ctx.lineTo(224, 200);
    ctx.stroke();

    // Modern Swiss typography
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px 'Space Grotesk', 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Z ANDRIE", 128, 235);

    ctx.fillStyle = "#d36b54";
    ctx.font = "600 9px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("CREATIVE TECHNOLOGIST", 128, 256);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "8px 'IBM Plex Mono', monospace";
    ctx.fillText("SPATIAL ARCHITECTURE // 2026", 128, 276);
    ctx.fillText("STUDIO PHILIPPINES", 128, 292);

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
    ctx.font = "700 76px 'Space Grotesk', 'Plus Jakarta Sans', sans-serif";
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
      scrollFrac = Math.max(0, Math.min(1, window.scrollY / (maxScrollRef.current || 1)));
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

    targetPosScratch.set(
      THREE.MathUtils.lerp(p1.pos[0], p2.pos[0], ease),
      THREE.MathUtils.lerp(p1.pos[1], p2.pos[1], ease),
      THREE.MathUtils.lerp(p1.pos[2], p2.pos[2], ease)
    );

    targetLookScratch.set(
      THREE.MathUtils.lerp(p1.look[0], p2.look[0], ease),
      THREE.MathUtils.lerp(p1.look[1], p2.look[1], ease),
      THREE.MathUtils.lerp(p1.look[2], p2.look[2], ease)
    );

    // Subtle interactive mouse parallax
    targetPosScratch.x += pointer.x * 0.16;
    targetPosScratch.y += pointer.y * 0.1;

    // Smooth cinematic lerp (damping)
    currentCamPosRef.current.lerp(targetPosScratch, 0.05);
    currentLookAtRef.current.lerp(targetLookScratch, 0.05);

    state.camera.position.copy(currentCamPosRef.current);
    state.camera.lookAt(currentLookAtRef.current);

    // ── 2. INTERACTIVE SPOTLIGHT AIMING (CURSOR RAYCASTING) ──
    // Project ray from camera lens through mouse cursor position
    const raycaster = state.raycaster;
    pointerVec.set(pointer.x, pointer.y);
    raycaster.setFromCamera(pointerVec, state.camera);

    const hit = raycaster.ray.intersectPlane(targetPlane, intersectPoint);

    if (!hit) {
      intersectPoint.set(pointer.x * (viewport.width * 0.45), pointer.y * (viewport.height * 0.35), -1.1);
    }

    // Clamp coordinates within room bounds
    intersectPoint.x = THREE.MathUtils.clamp(intersectPoint.x, -3.4, 3.4);
    intersectPoint.y = THREE.MathUtils.clamp(intersectPoint.y, -1.0, 2.4);
    intersectPoint.z = THREE.MathUtils.clamp(intersectPoint.z, -2.2, 0.2);

    // Responsive tracking so light tracks cursor fluidly
    if (targetObjectRef.current) {
      targetObjectRef.current.position.lerp(intersectPoint, 0.18);
    }

    const currentAim = targetObjectRef.current ? targetObjectRef.current.position : intersectPoint;

    // Lamp assembly tilt: look directly towards cursor target
    if (lampAssemblyRef.current) {
      lampAssemblyRef.current.lookAt(currentAim);
    }

    // Volumetric beam positioning, orientation, and scaling
    if (beamMeshRef.current) {
      const dist = lampPos.distanceTo(currentAim);
      const spotAngle = 0.50; // Half-angle
      const radius = Math.tan(spotAngle) * dist;

      beamMeshRef.current.position.copy(lampPos);
      beamMeshRef.current.lookAt(currentAim);
      beamMeshRef.current.scale.set(radius, radius, dist * 1.02);

      const mat = beamMeshRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms?.uTime) {
        mat.uniforms.uTime.value = time;
      }
    }

    // Spotlight pool illumination right at the cursor position
    if (poolLightRef.current) {
      poolLightRef.current.position.set(currentAim.x, currentAim.y, currentAim.z + 0.25);
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

    // Dust motes: smooth gentle drift inside the light beam (zero allocations in loop)
    if (dustRef.current) {
      const posAttr = dustRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      // Beam direction unit vector
      tempBeamDir.subVectors(currentAim, lampPos).normalize();

      for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3;
        const spd = dustSpeeds[i];

        // Smooth sinusoidal turbulence (no hard loops)
        posArray[i3] = dustOffsets[i3] + Math.sin(time * 0.3 * spd + i * 0.2) * 0.15;
        posArray[i3 + 1] = dustOffsets[i3 + 1] + Math.cos(time * 0.4 * spd + i * 0.3) * 0.2;
        posArray[i3 + 2] = dustOffsets[i3 + 2] + Math.sin(time * 0.25 * spd + i * 0.1) * 0.12;

        // Check if mote is inside the light cone
        tempMotePos.set(posArray[i3], posArray[i3 + 1], posArray[i3 + 2]);
        tempToMote.subVectors(tempMotePos, lampPos);
        const distMote = tempToMote.length();
        const cosAngle = tempToMote.normalize().dot(tempBeamDir);

        // Hide motes outside the spotlight beam
        const inCone = cosAngle > 0.86 && distMote < 6.0;
        if (!inCone) {
          posArray[i3 + 1] = -10;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Companion bot micro-interactions: blinking eyes and pulsating antenna
    const blinkCycle = time % 4.6;
    const isBlinking = blinkCycle > 4.45;
    if (companionEyeLeftRef.current && companionEyeRightRef.current) {
      const scaleY = isBlinking ? 0.08 : 1.0;
      companionEyeLeftRef.current.scale.y = scaleY;
      companionEyeRightRef.current.scale.y = scaleY;
    }
    if (companionAntennaTipRef.current) {
      const pulse = 0.55 + 0.45 * Math.sin(time * 3.5);
      const mat = companionAntennaTipRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = pulse;
    }

    // Telemetry broadcast: throttled to 10 FPS to eliminate continuous React re-renders in Hero
    if (time - lastTelemetryTime.current > 0.1) {
      lastTelemetryTime.current = time;
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
    }
  });

  return (
    <>
      {/* Target object for spotlight and beam aiming */}
      <object3D ref={targetObjectRef} position={[0, 0, -1.1]} />

      {/* Warm moody ambient fill matching cozy dev room */}
      <ambientLight color="#12100e" intensity={0.8} />

      {/* Hanging Lamp Cord from ceiling */}
      <mesh ref={lampCordRef} position={[0, 3.35, 0.4]}>
        <cylinderGeometry args={[0.005, 0.005, 1.7, 8]} />
        <meshStandardMaterial color="#1f1c19" roughness={0.7} />
      </mesh>

      {/* Overhead Lamp Shade Assembly (Tilts towards cursor target) */}
      <group ref={lampAssemblyRef} position={lampPos}>
        {/* Lamp Cone Shade (Open mouth faces along -Z towards cursor target) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.36, 0.4, 32, 1, true]} />
          <meshStandardMaterial color="#1a1715" roughness={0.4} metalness={0.7} side={THREE.DoubleSide} />
        </mesh>

        {/* Glowing bulb inside shade */}
        <mesh position={[0, 0, -0.06]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#fff4e0" toneMapped={false} />
        </mesh>
      </group>

      {/* Overhead SpotLight aimed directly at target */}
      <spotLight
        ref={spotLightRef}
        position={[lampPos.x, lampPos.y - 0.05, lampPos.z]}
        color="#f4ddb8"
        intensity={7.2}
        angle={0.52}
        penumbra={0.65}
        distance={15}
        decay={1.6}
      />

      {/* Volumetric Glowing Light Cone Mesh */}
      <mesh ref={beamMeshRef} geometry={beamGeometry} material={beamMaterial} renderOrder={10} raycast={() => null} />

      {/* Incandescent Light Pool at Cursor Aim Point */}
      <pointLight ref={poolLightRef} position={[0, 0, -1.1]} color="#f4ddb8" intensity={4.8} distance={5.5} decay={1.6} />

      {/* Back Wall Plane */}
      <mesh position={[0, 1.2, -2.4]} receiveShadow>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial color="#161412" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Framed Indie Game Wall Poster (Comfortably spaced to the right of "Z ANDRIE") */}
      {posterTexture && (
        <group position={[2.45, 1.35, -2.37]}>
          {/* Dark Wood Frame */}
          <mesh receiveShadow>
            <boxGeometry args={[0.84, 1.14, 0.03]} />
            <meshStandardMaterial color="#1c1815" roughness={0.7} />
          </mesh>
          {/* Poster Canvas Print */}
          <mesh position={[0, 0, 0.018]}>
            <planeGeometry args={[0.76, 1.06]} />
            <meshStandardMaterial map={posterTexture} roughness={0.4} />
          </mesh>
        </group>
      )}

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

      {/* Cozy Vintage Woven Indie Area Rug */}
      {rugTexture && (
        <mesh position={[0, -1.185, -0.45]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3.4, 2.4]} />
          <meshStandardMaterial map={rugTexture} roughness={0.9} metalness={0.05} />
        </mesh>
      )}

      {/* Floor Power Surge Strip with Glowing LED Switch under desk */}
      <group position={[0.62, -1.185, -0.85]} rotation={[0, 0.18, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.32, 0.03, 0.09]} />
          <meshStandardMaterial color="#2d2a26" roughness={0.5} />
        </mesh>
        {/* Outlets */}
        {[-0.1, -0.03, 0.04, 0.11].map((ox, idx) => (
          <mesh key={idx} position={[ox, 0.016, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.005, 10]} />
            <meshStandardMaterial color="#171513" roughness={0.7} />
          </mesh>
        ))}
        {/* Glowing Power Rocker Switch */}
        <mesh position={[-0.13, 0.02, 0]}>
          <boxGeometry args={[0.02, 0.012, 0.035]} />
          <meshBasicMaterial color="#ef4444" toneMapped={false} />
        </mesh>
      </group>

      {/* Sleek Potted Floor Plant (Solid 3D Geometry, Glitch-Free) */}
      <group position={[1.42, -1.2, -0.45]}>
        {/* Ceramic Planter Pot (Rests flat on the floor at y = -1.2) */}
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.11, 0.36, 18]} />
          <meshStandardMaterial color="#6e372b" roughness={0.5} />
        </mesh>
        {/* Pot Top Rim */}
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.16, 0.15, 0.035, 18]} />
          <meshStandardMaterial color="#5c2e24" roughness={0.5} />
        </mesh>
        {/* Pot Soil */}
        <mesh position={[0, 0.355, 0]}>
          <cylinderGeometry args={[0.145, 0.145, 0.02, 16]} />
          <meshStandardMaterial color="#1a1410" roughness={0.9} />
        </mesh>

        {/* Central Stem */}
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.008, 0.012, 0.26, 8]} />
          <meshStandardMaterial color="#1e3e2b" roughness={0.6} />
        </mesh>

        {/* 3D Solid Tapered Leaves (Real geometry thickness with true outward normals) */}
        {[
          { pos: [0.06, 0.52, 0.05], rot: [0.35, 0.4, -0.35], scale: [0.11, 0.008, 0.24] },
          { pos: [-0.06, 0.54, 0.04], rot: [0.28, -0.85, 0.4], scale: [0.12, 0.008, 0.25] },
          { pos: [0.04, 0.49, -0.06], rot: [-0.32, 1.15, -0.25], scale: [0.10, 0.008, 0.22] },
          { pos: [-0.05, 0.50, -0.05], rot: [-0.22, -1.8, 0.32], scale: [0.11, 0.008, 0.23] },
          { pos: [0.0, 0.62, 0.0], rot: [0.15, 0.1, 0.0], scale: [0.12, 0.008, 0.26] },
        ].map((leaf, i) => (
          <group key={i} position={leaf.pos as [number, number, number]} rotation={leaf.rot as [number, number, number]}>
            {/* Petiole Stem */}
            <mesh position={[0, -0.04, -0.06]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.004, 0.006, 0.14, 6]} />
              <meshStandardMaterial color="#1e3e2b" roughness={0.6} />
            </mesh>
            {/* Solid 3D Leaf Blade (Has thickness, never inverts or turns black under lighting!) */}
            <mesh position={[0, 0.02, 0.06]} castShadow receiveShadow>
              <boxGeometry args={leaf.scale as [number, number, number]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#2b6b47" : "#327b52"} roughness={0.35} metalness={0.05} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Isometric Desk Setup */}
      <group position={[0, -0.7, -1.0]}>
        {/* Table Top */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.08, 1.2]} />
          <meshStandardMaterial color="#221e1a" roughness={0.6} metalness={0.2} />
        </mesh>

        {/* Stitched Gamer Desk Mat */}
        <mesh position={[0.05, 0.492, 0.15]} receiveShadow>
          <boxGeometry args={[1.72, 0.006, 0.68]} />
          <meshStandardMaterial color="#1a1816" roughness={0.8} />
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

        {/* Ultra-Slim Modern Studio Display */}
        <group position={[-0.32, 0.88, -0.15]} rotation={[0, 0.12, 0]}>
          {/* Anodized Aluminum Display Chassis */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.82, 0.52, 0.024]} />
            <meshStandardMaterial color="#181a20" roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Slim Outer Bezel */}
          <mesh position={[0, 0, 0.013]}>
            <boxGeometry args={[0.80, 0.50, 0.005]} />
            <meshStandardMaterial color="#0c0d12" roughness={0.2} metalness={0.5} />
          </mesh>

          {/* Active Screen Display (VS Code / Terminal Core) */}
          {screenTexture && (
            <mesh position={[0, 0, 0.017]}>
              <planeGeometry args={[0.78, 0.48]} />
              <meshBasicMaterial map={screenTexture} toneMapped={false} />
            </mesh>
          )}

          {/* Sleek Cantilever Stand Upright Arm */}
          <mesh position={[0, -0.32, -0.06]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.08, 0.28, 0.02]} />
            <meshStandardMaterial color="#2d3039" roughness={0.3} metalness={0.85} />
          </mesh>

          {/* Precision Stand Base Plate */}
          <mesh position={[0, -0.42, 0]}>
            <boxGeometry args={[0.26, 0.008, 0.22]} />
            <meshStandardMaterial color="#2d3039" roughness={0.3} metalness={0.85} />
          </mesh>

          {/* Modern Low-Profile Aluminum Keyboard */}
          <group position={[0, -0.41, 0.42]} rotation={[-0.04, 0, 0]}>
            {/* Keyboard Aluminum Body */}
            <mesh castShadow>
              <boxGeometry args={[0.44, 0.012, 0.15]} />
              <meshStandardMaterial color="#22252c" roughness={0.3} metalness={0.7} />
            </mesh>
            {/* Keypad Plate */}
            <mesh position={[0, 0.007, 0]}>
              <boxGeometry args={[0.42, 0.005, 0.13]} />
              <meshStandardMaterial color="#111317" roughness={0.5} />
            </mesh>
          </group>
        </group>

        {/* Sleek Ergonomic Precision Mouse */}
        <group position={[0.34, 0.495, 0.24]} rotation={[0, -0.08, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.06, 0.022, 0.1]} />
            <meshStandardMaterial color="#1e2129" roughness={0.25} metalness={0.6} />
          </mesh>
          {/* Subtle Accent Glow Ring */}
          <mesh position={[0, 0.012, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.004, 12]} />
            <meshBasicMaterial color="#d36b54" toneMapped={false} />
          </mesh>
        </group>

        {/* Designer Dot-Grid Sketchbook & Aluminum Stylus */}
        <group position={[0.02, 0.495, 0.32]} rotation={[0, 0.14, 0]}>
          {/* Sketchbook Hardcover */}
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.012, 0.24]} />
            <meshStandardMaterial color="#1a1c22" roughness={0.6} />
          </mesh>
          {/* Off-White Paper Pages Block */}
          <mesh position={[0.005, 0.002, 0]}>
            <boxGeometry args={[0.17, 0.01, 0.23]} />
            <meshStandardMaterial color="#e5e5e5" roughness={0.8} />
          </mesh>
          {/* Minimalist Aluminum Stylus Pen */}
          <mesh position={[0.07, 0.015, 0]} rotation={[0, 0, 0.02]} castShadow>
            <cylinderGeometry args={[0.0035, 0.0035, 0.18, 10]} />
            <meshStandardMaterial color="#9ca3af" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>

        {/* Sleek Matte Studio Audio Monitor Speaker */}
        <group position={[-0.82, 0.62, -0.08]} rotation={[0, 0.25, 0]}>
          {/* Speaker Cabinet */}
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.28, 0.18]} />
            <meshStandardMaterial color="#16181f" roughness={0.4} metalness={0.4} />
          </mesh>
          {/* Upper Tweeter Ring */}
          <mesh position={[0, 0.06, 0.091]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.005, 16]} />
            <meshStandardMaterial color="#2d3039" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Lower Woofer Cone with Champagne Ring */}
          <mesh position={[0, -0.05, 0.091]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.006, 24]} />
            <meshStandardMaterial color="#f4ddb8" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>

        {/* Minimalist Ceramic Tumbler */}
        <group position={[-0.78, 0.54, 0.28]} rotation={[0, 0.2, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.042, 0.036, 0.1, 18]} />
            <meshStandardMaterial color="#262830" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Tumbler Rim Ring */}
          <mesh position={[0, 0.048, 0]}>
            <cylinderGeometry args={[0.043, 0.043, 0.005, 18]} />
            <meshStandardMaterial color="#d36b54" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>

        {/* Desktop Companion Robot / Radio */}
        <group position={[0.48, 0.62, 0.05]} rotation={[0, -0.22, 0]}>
          {/* Body */}
          <mesh>
            <boxGeometry args={[0.34, 0.22, 0.24]} />
            <meshStandardMaterial color="#2c2823" roughness={0.4} metalness={0.5} />
          </mesh>

          {/* Flexible Antenna Mast & Glowing Sensor Tip */}
          <group position={[0.1, 0.11, -0.04]} rotation={[-0.15, 0, 0.12]}>
            <mesh position={[0, 0.07, 0]}>
              <cylinderGeometry args={[0.005, 0.007, 0.14, 8]} />
              <meshStandardMaterial color="#948c7e" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh ref={companionAntennaTipRef} position={[0, 0.145, 0]}>
              <sphereGeometry args={[0.016, 12, 12]} />
              <meshBasicMaterial color="#f4ddb8" toneMapped={false} transparent opacity={0.9} />
            </mesh>
          </group>

          {/* Dial Control Knobs */}
          <mesh position={[-0.1, -0.05, 0.125]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.015, 12]} />
            <meshStandardMaterial color="#1a1816" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[-0.04, -0.05, 0.125]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.015, 12]} />
            <meshStandardMaterial color="#1a1816" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Animated Blinking Glowing LED Eyes */}
          <mesh ref={companionEyeLeftRef} position={[-0.07, 0.02, 0.125]}>
            <circleGeometry args={[0.035, 16]} />
            <meshBasicMaterial color="#f2dcb4" />
          </mesh>
          <mesh ref={companionEyeRightRef} position={[0.07, 0.02, 0.125]}>
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

        {/* Bookshelf with Books & Retro Game Collectibles (Firmly Grounded on Floor at y = -1.2) */}
        <group position={[-1.7, 0.38, -0.3]} rotation={[0, 0.24, 0]}>
          {/* Bookshelf Outer Wood Frame (Hollowed Structure) */}
          <group>
            {/* Left Side Panel */}
            <mesh position={[-0.29, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.04, 1.8, 0.38]} />
              <meshStandardMaterial color="#1b1815" roughness={0.75} />
            </mesh>
            {/* Right Side Panel */}
            <mesh position={[0.29, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.04, 1.8, 0.38]} />
              <meshStandardMaterial color="#1b1815" roughness={0.75} />
            </mesh>
            {/* Top Shelf Cap */}
            <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.62, 0.04, 0.38]} />
              <meshStandardMaterial color="#1b1815" roughness={0.75} />
            </mesh>
            {/* Bottom Base */}
            <mesh position={[0, -0.88, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.62, 0.04, 0.38]} />
              <meshStandardMaterial color="#1b1815" roughness={0.75} />
            </mesh>
            {/* Back Panel */}
            <mesh position={[0, 0, -0.17]} receiveShadow>
              <boxGeometry args={[0.58, 1.74, 0.02]} />
              <meshStandardMaterial color="#14110f" roughness={0.85} />
            </mesh>
            {/* Shelf Tier 1 Divider */}
            <mesh position={[0, 0.28, 0]} receiveShadow>
              <boxGeometry args={[0.58, 0.03, 0.36]} />
              <meshStandardMaterial color="#1b1815" roughness={0.75} />
            </mesh>
            {/* Shelf Tier 2 Divider */}
            <mesh position={[0, -0.30, 0]} receiveShadow>
              <boxGeometry args={[0.58, 0.03, 0.36]} />
              <meshStandardMaterial color="#1b1815" roughness={0.75} />
            </mesh>
          </group>

          {/* Top of Bookshelf: Modern Architectural Brass Sculpture & Stoneware */}
          <group position={[0, 0.94, 0]} rotation={[0, 0.15, 0]}>
            {/* Minimalist Brass Ring Sculpture */}
            <mesh position={[-0.08, 0.08, 0]} rotation={[0.4, 0.6, 0]} castShadow>
              <torusGeometry args={[0.07, 0.012, 16, 32]} />
              <meshStandardMaterial color="#f4ddb8" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Matte Stoneware Base */}
            <mesh position={[-0.08, 0.008, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.016, 20]} />
              <meshStandardMaterial color="#1e2026" roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Minimalist Potted Desk Plant on Right */}
            <group position={[0.1, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.045, 0.038, 0.07, 16]} />
                <meshStandardMaterial color="#2c2824" roughness={0.6} />
              </mesh>
              {/* Succulent Leaves */}
              <mesh position={[0, 0.045, 0]}>
                <sphereGeometry args={[0.038, 12, 12]} />
                <meshStandardMaterial color="#4ade80" roughness={0.4} />
              </mesh>
            </group>
          </group>

          {/* Top Shelf Compartment (y = 0.28): Hardcover Architectural Monographs */}
          <group position={[-0.18, 0.44, 0]}>
            {[
              { x: 0.0, color: "#d36b54", h: 0.28 },
              { x: 0.065, color: "#22252e", h: 0.29 },
              { x: 0.13, color: "#e5e7eb", h: 0.27 },
              { x: 0.195, color: "#d36b54", h: 0.28 },
              { x: 0.26, color: "#374151", h: 0.26 },
            ].map((book, idx) => (
              <mesh key={idx} position={[book.x, (book.h - 0.28) / 2, 0]} castShadow>
                <boxGeometry args={[0.055, book.h, 0.22]} />
                <meshStandardMaterial color={book.color} roughness={0.5} />
              </mesh>
            ))}
            {/* Minimalist Cast Aluminum Bookend */}
            <mesh position={[0.33, -0.04, 0]} castShadow>
              <boxGeometry args={[0.03, 0.16, 0.18]} />
              <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>

          {/* Middle Shelf Compartment (y = -0.30): Design Volumes & Ceramic Object */}
          <group position={[-0.20, -0.14, 0]}>
            {[
              { x: 0.0, color: "#1f2937", w: 0.06, h: 0.28 },
              { x: 0.07, color: "#4b5563", w: 0.065, h: 0.30 },
              { x: 0.145, color: "#111827", w: 0.07, h: 0.27 },
              { x: 0.225, color: "#d36b54", w: 0.065, h: 0.29 },
            ].map((box, idx) => (
              <mesh key={idx} position={[box.x, (box.h - 0.28) / 2, 0]} castShadow>
                <boxGeometry args={[box.w, box.h, 0.24]} />
                <meshStandardMaterial color={box.color} roughness={0.4} />
              </mesh>
            ))}
            {/* Geometric Sphere Artifact on Right */}
            <mesh position={[0.34, -0.06, 0]} castShadow>
              <sphereGeometry args={[0.055, 20, 20]} />
              <meshStandardMaterial color="#f4ddb8" roughness={0.25} metalness={0.7} />
            </mesh>
          </group>

          {/* Bottom Shelf Compartment (y = -0.88): Full Library Row */}
          <group position={[-0.23, -0.73, 0]}>
            {[
              { x: 0.0, color: "#d36b54", h: 0.27 },
              { x: 0.06, color: "#57534e", h: 0.29 },
              { x: 0.12, color: "#a8a29e", h: 0.26 },
              { x: 0.18, color: "#d36b54", h: 0.28 },
              { x: 0.24, color: "#78716c", h: 0.30 },
              { x: 0.30, color: "#3f3f46", h: 0.27 },
              { x: 0.36, color: "#b45309", h: 0.28 },
              { x: 0.42, color: "#44403c", h: 0.26 },
            ].map((book, idx) => (
              <mesh key={idx} position={[book.x, (book.h - 0.28) / 2, 0]} castShadow>
                <boxGeometry args={[0.05, book.h, 0.22]} />
                <meshStandardMaterial color={book.color} roughness={0.6} />
              </mesh>
            ))}
          </group>
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
