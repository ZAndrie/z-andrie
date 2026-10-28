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

  // Texture for the glowing CRT monitor screen (Indie Dev Quest & Stats)
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
    ctx.font = "14px 'IBM Plex Mono', monospace";
    ctx.fillText("> Z-ANDRIE // DEV_ROOM", 14, 32);
    ctx.fillText("ENGINE: THREE.JS / R3F", 14, 54);
    ctx.fillText("HP: [██████████] 100%", 14, 78);
    ctx.fillText("MP: [████████░░] 85%", 14, 100);
    ctx.fillText("QUEST: IMMERSIVE WEB", 14, 124);
    ctx.fillText("FPS: 60 | 2700K AMBER", 14, 148);
    ctx.fillText("STATUS: ACTIVE_PLAYER", 14, 172);

    ctx.fillStyle = "#facc15";
    ctx.fillText("▶ AWAITING INPUT_ █", 14, 202);

    // CRT Scanlines
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    for (let y = 0; y < 256; y += 4) {
      ctx.fillRect(0, y, 256, 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Procedural woven geometric area rug texture
  const rugTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Base dark woven wool
    ctx.fillStyle = "#161311";
    ctx.fillRect(0, 0, 512, 384);

    // Micro weave texture
    ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
    for (let x = 0; x < 512; x += 4) {
      ctx.fillRect(x, 0, 2, 384);
    }
    for (let y = 0; y < 384; y += 4) {
      ctx.fillRect(0, y, 512, 2);
    }

    // Outer border (vintage terracotta)
    ctx.strokeStyle = "#8c4033";
    ctx.lineWidth = 14;
    ctx.strokeRect(18, 18, 476, 348);

    // Inner geometric border (warm sand)
    ctx.strokeStyle = "#bfa67a";
    ctx.lineWidth = 4;
    ctx.strokeRect(38, 38, 436, 308);

    // Corner decorative diamonds
    const drawDiamond = (cx: number, cy: number, size: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx + size, cy);
      ctx.lineTo(cx, cy + size);
      ctx.lineTo(cx - size, cy);
      ctx.closePath();
      ctx.fill();
    };

    drawDiamond(56, 56, 12, "#d36b54");
    drawDiamond(456, 56, 12, "#d36b54");
    drawDiamond(56, 328, 12, "#d36b54");
    drawDiamond(456, 328, 12, "#d36b54");

    // Center stepped 8-bit medallion
    drawDiamond(256, 192, 58, "#2d2420");
    drawDiamond(256, 192, 44, "#8c4033");
    drawDiamond(256, 192, 28, "#bfa67a");
    drawDiamond(256, 192, 14, "#f4ddb8");

    // Left and right fringed tassels
    ctx.fillStyle = "#a89a88";
    for (let y = 26; y < 360; y += 6) {
      ctx.fillRect(6, y, 10, 2);
      ctx.fillRect(496, y, 10, 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Framed retro indie game wall poster
  const posterTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Midnight dark sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 360);
    grad.addColorStop(0, "#080911");
    grad.addColorStop(0.55, "#181224");
    grad.addColorStop(1, "#361b28");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 360);

    // Glowing low-poly pixel moon
    ctx.fillStyle = "#f4ddb8";
    ctx.beginPath();
    ctx.arc(128, 90, 32, 0, Math.PI * 2);
    ctx.fill();

    // Distant mountain silhouettes (synthwave / pixel adventure)
    ctx.fillStyle = "#4a2840";
    ctx.beginPath();
    ctx.moveTo(0, 230);
    ctx.lineTo(60, 150);
    ctx.lineTo(128, 200);
    ctx.lineTo(190, 140);
    ctx.lineTo(256, 210);
    ctx.lineTo(256, 360);
    ctx.lineTo(0, 360);
    ctx.closePath();
    ctx.fill();

    // Foreground mountain ridge
    ctx.fillStyle = "#1e1120";
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.lineTo(90, 185);
    ctx.lineTo(160, 240);
    ctx.lineTo(220, 195);
    ctx.lineTo(256, 235);
    ctx.lineTo(256, 360);
    ctx.lineTo(0, 360);
    ctx.closePath();
    ctx.fill();

    // Pixel stars
    ctx.fillStyle = "#fef08a";
    [
      [35, 40],
      [80, 28],
      [210, 45],
      [180, 70],
      [45, 105],
      [225, 110],
    ].forEach(([x, y]) => {
      ctx.fillRect(x, y, 3, 3);
    });

    // Poster Title Typography
    ctx.fillStyle = "#f4ddb8";
    ctx.font = "bold 18px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText("INDIE QUEST", 128, 285);

    ctx.fillStyle = "#d36b54";
    ctx.font = "10px 'Courier New', monospace";
    ctx.fillText("16-BIT CHRONICLES // 199X", 128, 308);

    ctx.fillStyle = "#4ade80";
    ctx.fillText("▶ PRESS START", 128, 330);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Mini bartop arcade screen texture (Space Invader pixel sprite)
  const arcadeScreenTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0a0817";
    ctx.fillRect(0, 0, 128, 128);

    // Pixel Space Invader sprite
    ctx.fillStyle = "#4ade80";
    const invader = [
      "  █     █  ",
      "   █   █   ",
      "  ███████  ",
      " ██ █ █ ██ ",
      "███████████",
      "█ █     █ █",
      "█ █     █ █",
    ];
    invader.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) {
        if (row[c] === "█") {
          ctx.fillRect(18 + c * 8, 26 + r * 7, 7, 6);
        }
      }
    });

    ctx.fillStyle = "#f4ddb8";
    ctx.font = "bold 9px monospace";
    ctx.fillText("HI-SCORE: 9999", 16, 98);
    ctx.fillStyle = "#ef4444";
    ctx.fillText("1P INSERT COIN", 16, 114);

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

    // ── 2. INTERACTIVE SPOTLIGHT AIMING (CURSOR RAYCASTING) ──
    // Project ray from camera lens through mouse cursor position
    const raycaster = state.raycaster;
    pointerVec.set(pointer.x, pointer.y);
    raycaster.setFromCamera(pointerVec, state.camera);

    // Target plane located at workspace depth (z = -1.1)
    const targetPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 1.1);
    const intersectPoint = new THREE.Vector3();
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

      {/* Framed Indie Game Wall Poster */}
      {posterTexture && (
        <group position={[1.45, 1.45, -2.37]}>
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

      {/* Cozy Potted Floor Monstera Plant */}
      <group position={[1.48, -0.85, -0.45]}>
        {/* Modern Ceramic Pot */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.15, 0.55, 18]} />
          <meshStandardMaterial color="#262320" roughness={0.6} />
        </mesh>
        {/* Pot Dark Soil */}
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.04, 18]} />
          <meshStandardMaterial color="#1a1410" roughness={0.9} />
        </mesh>
        {/* Monstera Stems & Broad Leaves catching light */}
        {[
          { rot: [0.35, 0.4, -0.3], pos: [0.08, 0.45, 0.05], scale: [0.26, 0.38] },
          { rot: [0.25, -0.9, 0.35], pos: [-0.06, 0.5, 0.08], scale: [0.28, 0.4] },
          { rot: [-0.3, 1.2, -0.2], pos: [0.04, 0.42, -0.06], scale: [0.24, 0.35] },
          { rot: [-0.2, -2.1, 0.28], pos: [-0.08, 0.48, -0.05], scale: [0.25, 0.36] },
          { rot: [0.1, 0.1, 0.0], pos: [0, 0.58, 0], scale: [0.27, 0.39] },
        ].map((leaf, i) => (
          <group key={i} position={leaf.pos as [number, number, number]} rotation={leaf.rot as [number, number, number]}>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.008, 0.012, 0.32, 6]} />
              <meshStandardMaterial color="#1e3e2b" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.32, 0]} rotation={[0.4, 0, 0]}>
              <circleGeometry args={[leaf.scale[0], 12]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#2b563c" : "#356647"} roughness={0.5} side={THREE.DoubleSide} />
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

          {/* Sticky Note 1: Top Right of CRT Bezel */}
          <group position={[0.22, 0.22, 0.288]} rotation={[0, 0, -0.1]}>
            <mesh>
              <planeGeometry args={[0.075, 0.075]} />
              <meshStandardMaterial color="#facc15" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.01, 0.001]}>
              <planeGeometry args={[0.05, 0.006]} />
              <meshBasicMaterial color="#713f12" />
            </mesh>
            <mesh position={[0, -0.01, 0.001]}>
              <planeGeometry args={[0.04, 0.006]} />
              <meshBasicMaterial color="#713f12" />
            </mesh>
          </group>

          {/* Sticky Note 2: Bottom Left of CRT Bezel */}
          <group position={[-0.22, -0.18, 0.288]} rotation={[0, 0, 0.08]}>
            <mesh>
              <planeGeometry args={[0.065, 0.065]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.001]}>
              <planeGeometry args={[0.045, 0.005]} />
              <meshBasicMaterial color="#0c4a6e" />
            </mesh>
          </group>

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

        {/* Retro Gaming Mouse & Cable */}
        <group position={[0.42, 0.505, 0.35]} rotation={[0, -0.15, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.065, 0.024, 0.1]} />
            <meshStandardMaterial color="#c2baa9" roughness={0.5} />
          </mesh>
          {/* Scroll Wheel */}
          <mesh position={[0, 0.013, -0.015]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.01, 12]} />
            <meshStandardMaterial color="#2d2a26" roughness={0.3} />
          </mesh>
          {/* Thin curved mouse wire */}
          <mesh position={[-0.04, -0.008, -0.16]} rotation={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.0025, 0.0025, 0.24, 6]} />
            <meshStandardMaterial color="#1a1715" roughness={0.6} />
          </mesh>
        </group>

        {/* Retro Indie Gamepad / Controller */}
        <group position={[0.08, 0.508, 0.38]} rotation={[-0.04, 0.22, 0]}>
          {/* Controller Body Shell */}
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.022, 0.09]} />
            <meshStandardMaterial color="#2c2825" roughness={0.5} metalness={0.2} />
          </mesh>
          {/* Left Grip Wing */}
          <mesh position={[-0.075, -0.004, 0.015]} rotation={[0, 0.28, 0]}>
            <boxGeometry args={[0.05, 0.022, 0.095]} />
            <meshStandardMaterial color="#2c2825" roughness={0.5} metalness={0.2} />
          </mesh>
          {/* Right Grip Wing */}
          <mesh position={[0.075, -0.004, 0.015]} rotation={[0, -0.28, 0]}>
            <boxGeometry args={[0.05, 0.022, 0.095]} />
            <meshStandardMaterial color="#2c2825" roughness={0.5} metalness={0.2} />
          </mesh>
          {/* Cross D-Pad on Left */}
          <group position={[-0.055, 0.013, -0.008]}>
            <mesh>
              <boxGeometry args={[0.009, 0.006, 0.028]} />
              <meshStandardMaterial color="#141210" roughness={0.4} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.028, 0.006, 0.009]} />
              <meshStandardMaterial color="#141210" roughness={0.4} />
            </mesh>
          </group>
          {/* 4 Colored Action Buttons on Right (Diamond layout) */}
          <group position={[0.055, 0.014, -0.008]}>
            {/* Top Y (Blue) */}
            <mesh position={[0, 0, -0.01]}>
              <cylinderGeometry args={[0.005, 0.005, 0.006, 10]} />
              <meshStandardMaterial color="#60a5fa" roughness={0.3} />
            </mesh>
            {/* Right B (Terracotta / Red) */}
            <mesh position={[0.01, 0, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.006, 10]} />
              <meshStandardMaterial color="#d36b54" roughness={0.3} />
            </mesh>
            {/* Bottom A (Golden Amber) */}
            <mesh position={[0, 0, 0.01]}>
              <cylinderGeometry args={[0.005, 0.005, 0.006, 10]} />
              <meshStandardMaterial color="#f4ddb8" roughness={0.3} />
            </mesh>
            {/* Left X (Green) */}
            <mesh position={[-0.01, 0, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.006, 10]} />
              <meshStandardMaterial color="#4ade80" roughness={0.3} />
            </mesh>
          </group>
          {/* Twin Thumbsticks */}
          <mesh position={[-0.025, 0.015, 0.018]}>
            <cylinderGeometry args={[0.012, 0.008, 0.012, 12]} />
            <meshStandardMaterial color="#181614" roughness={0.6} />
          </mesh>
          <mesh position={[0.025, 0.015, 0.018]}>
            <cylinderGeometry args={[0.012, 0.008, 0.012, 12]} />
            <meshStandardMaterial color="#181614" roughness={0.6} />
          </mesh>
          {/* Controller Cord leading back */}
          <mesh position={[0, 0.002, -0.12]} rotation={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.16, 6]} />
            <meshStandardMaterial color="#1a1715" roughness={0.7} />
          </mesh>
        </group>

        {/* Ceramic Developer Coffee Mug */}
        <group position={[-0.78, 0.535, 0.32]} rotation={[0, 0.35, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.048, 0.042, 0.09, 16]} />
            <meshStandardMaterial color="#d9d3c5" roughness={0.4} />
          </mesh>
          {/* Coffee Surface */}
          <mesh position={[0, 0.038, 0]}>
            <cylinderGeometry args={[0.042, 0.042, 0.005, 16]} />
            <meshStandardMaterial color="#26140b" roughness={0.2} metalness={0.1} />
          </mesh>
          {/* Mug Handle */}
          <mesh position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.028, 0.007, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#d9d3c5" roughness={0.4} />
          </mesh>
        </group>

        {/* Stack of Retro Game Cartridges & Floppy Disk */}
        <group position={[-0.88, 0.505, -0.08]} rotation={[0, 0.16, 0]}>
          {/* Bottom Cartridge (Grey 16-bit shell) */}
          <group position={[0, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.13, 0.022, 0.16]} />
              <meshStandardMaterial color="#9c9588" roughness={0.5} />
            </mesh>
            {/* Colorful Label Decal */}
            <mesh position={[0, 0.012, 0.01]}>
              <planeGeometry args={[0.095, 0.1]} />
              <meshStandardMaterial color="#d36b54" roughness={0.3} />
            </mesh>
          </group>
          {/* Top Cartridge (Slightly turned) */}
          <group position={[0.01, 0.023, -0.01]} rotation={[0, -0.15, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.13, 0.022, 0.16]} />
              <meshStandardMaterial color="#2a2724" roughness={0.5} />
            </mesh>
            {/* Label Decal */}
            <mesh position={[0, 0.012, 0.01]}>
              <planeGeometry args={[0.095, 0.1]} />
              <meshStandardMaterial color="#f4ddb8" roughness={0.3} />
            </mesh>
          </group>
          {/* 3.5" Floppy Disk next to cartridges */}
          <group position={[0.14, 0.004, 0.06]} rotation={[0, -0.32, 0]}>
            <mesh>
              <boxGeometry args={[0.1, 0.008, 0.105]} />
              <meshStandardMaterial color="#1a1816" roughness={0.6} />
            </mesh>
            {/* Metal Shutter Slider */}
            <mesh position={[0, 0.005, -0.03]}>
              <boxGeometry args={[0.08, 0.002, 0.035]} />
              <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Paper Label */}
            <mesh position={[0, 0.005, 0.018]}>
              <planeGeometry args={[0.075, 0.05]} />
              <meshStandardMaterial color="#f3f4f6" roughness={0.8} />
            </mesh>
          </group>
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

        {/* Bookshelf with Books & Indie Collectibles */}
        <group position={[-1.7, 0.8, -0.3]} rotation={[0, 0.24, 0]}>
          {/* Shelf Frame */}
          <mesh>
            <boxGeometry args={[0.6, 1.8, 0.4]} />
            <meshStandardMaterial color="#1b1815" roughness={0.8} />
          </mesh>

          {/* Cascading Potted Succulent Plant on top of Bookshelf */}
          <group position={[0, 0.96, 0]}>
            {/* Terracotta Pot */}
            <mesh>
              <cylinderGeometry args={[0.08, 0.065, 0.12, 16]} />
              <meshStandardMaterial color="#b45309" roughness={0.7} />
            </mesh>
            {/* Soil */}
            <mesh position={[0, 0.058, 0]}>
              <cylinderGeometry args={[0.076, 0.076, 0.01, 14]} />
              <meshStandardMaterial color="#1f1813" roughness={0.9} />
            </mesh>
            {/* Trailing Vine Leaves cascading down the shelf edge */}
            {[
              { pos: [0.06, 0.04, 0.08], rot: [0.5, 0.2, 0.3], len: 0.18 },
              { pos: [-0.04, 0.03, 0.08], rot: [0.65, -0.15, -0.2], len: 0.26 },
              { pos: [0.02, 0.02, 0.08], rot: [0.8, 0.05, 0], len: 0.22 },
            ].map((vine, vi) => (
              <group key={vi} position={vine.pos as [number, number, number]} rotation={vine.rot as [number, number, number]}>
                <mesh position={[0, -vine.len / 2, 0]}>
                  <cylinderGeometry args={[0.005, 0.007, vine.len, 6]} />
                  <meshStandardMaterial color="#166534" roughness={0.6} />
                </mesh>
                {/* Small cascading leaf nodes */}
                {[-0.04, -0.09, -0.15].map((ly, lidx) => (
                  <mesh key={lidx} position={[lidx % 2 === 0 ? 0.015 : -0.015, ly, 0.01]} rotation={[0.2, 0, 0.4]}>
                    <circleGeometry args={[0.022, 8]} />
                    <meshStandardMaterial color={lidx % 2 === 0 ? "#22c55e" : "#15803d"} side={THREE.DoubleSide} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>

          {/* Glowing Indie Health Potion Flask on top shelf */}
          <group position={[0.18, 0.63, 0.08]}>
            {/* Spherical Glass Bulb */}
            <mesh>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Glowing Liquid Core */}
            <mesh>
              <sphereGeometry args={[0.048, 14, 14]} />
              <meshBasicMaterial color="#ef4444" toneMapped={false} />
            </mesh>
            {/* Flask Neck */}
            <mesh position={[0, 0.065, 0]}>
              <cylinderGeometry args={[0.018, 0.02, 0.04, 12]} />
              <meshStandardMaterial color="#fca5a5" roughness={0.3} />
            </mesh>
            {/* Cork Stopper */}
            <mesh position={[0, 0.09, 0]}>
              <cylinderGeometry args={[0.02, 0.016, 0.02, 10]} />
              <meshStandardMaterial color="#a16207" roughness={0.8} />
            </mesh>
          </group>

          {/* Mini Bartop Arcade Cabinet on middle shelf */}
          <group position={[0.12, 0.16, 0.06]} rotation={[0, -0.3, 0]}>
            {/* Cabinet Body */}
            <mesh>
              <boxGeometry args={[0.18, 0.26, 0.18]} />
              <meshStandardMaterial color="#1a1816" roughness={0.5} />
            </mesh>
            {/* Glowing Marquee Header */}
            <mesh position={[0, 0.1, 0.092]}>
              <planeGeometry args={[0.16, 0.04]} />
              <meshBasicMaterial color="#f4ddb8" toneMapped={false} />
            </mesh>
            {/* Arcade Screen with Invader */}
            {arcadeScreenTexture && (
              <mesh position={[0, 0.02, 0.092]} rotation={[-0.15, 0, 0]}>
                <planeGeometry args={[0.14, 0.11]} />
                <meshBasicMaterial map={arcadeScreenTexture} toneMapped={false} />
              </mesh>
            )}
            {/* Joystick Control Deck */}
            <group position={[0, -0.06, 0.105]} rotation={[0.3, 0, 0]}>
              {/* Red Ball-Top Joystick */}
              <mesh position={[-0.04, 0.015, 0]}>
                <cylinderGeometry args={[0.003, 0.003, 0.025, 6]} />
                <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[-0.04, 0.03, 0]}>
                <sphereGeometry args={[0.01, 10, 10]} />
                <meshStandardMaterial color="#ef4444" roughness={0.3} />
              </mesh>
              {/* Action Buttons */}
              <mesh position={[0.03, 0.005, -0.008]}>
                <cylinderGeometry args={[0.006, 0.006, 0.006, 8]} />
                <meshStandardMaterial color="#3b82f6" roughness={0.4} />
              </mesh>
              <mesh position={[0.05, 0.005, 0.008]}>
                <cylinderGeometry args={[0.006, 0.006, 0.006, 8]} />
                <meshStandardMaterial color="#22c55e" roughness={0.4} />
              </mesh>
            </group>
          </group>

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
