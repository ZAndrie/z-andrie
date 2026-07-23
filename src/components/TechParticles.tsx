"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: "dot" | "cross" | "square" | "circle";
  opacity: number;
}

export default function TechParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particlesPhysics = useRef<Particle[]>([]);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Generate only once on client mount
    const types: ("dot" | "cross" | "square" | "circle")[] = ["dot", "cross", "square", "circle"];
    const generated = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 15 + 8,
      type: types[Math.floor(Math.random() * types.length)],
      opacity: Math.random() * 0.35 + 0.20, // Increased visibility
    }));
    
    setParticles(generated);
    particlesPhysics.current = JSON.parse(JSON.stringify(generated));

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    let animationFrame: number;
    const render = () => {
      const mouse = mouseRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      particlesPhysics.current.forEach((p, i) => {
        // Natural drift
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        // Mouse interaction (Repel)
        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        const interactionRadius = 200;
        
        if (distance < interactionRadius) {
          const force = (interactionRadius - distance) / interactionRadius;
          p.x -= (dx / distance) * force * 4;
          p.y -= (dy / distance) * force * 4;
        }

        // Apply to DOM via ref for 60fps performance without React re-renders
        if (elementsRef.current[i]) {
          elementsRef.current[i]!.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        }
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  if (particles.length === 0) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => { elementsRef.current[i] = el; }}
          className="absolute top-0 left-0 flex items-center justify-center text-[var(--color-primary)] will-change-transform"
          style={{ opacity: p.opacity }}
        >
          {p.type === "cross" && (
            <div style={{ width: p.size, height: p.size, position: "relative" }}>
              <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-current -translate-y-1/2"></div>
              <div className="absolute top-0 left-1/2 w-[1.5px] h-full bg-current -translate-x-1/2"></div>
            </div>
          )}
          {p.type === "square" && (
            <div 
              className="border-[1.5px] border-current"
              style={{ width: p.size * 0.8, height: p.size * 0.8 }}
            ></div>
          )}
          {p.type === "circle" && (
            <div 
              className="border-[1.5px] border-current rounded-full"
              style={{ width: p.size * 0.9, height: p.size * 0.9 }}
            ></div>
          )}
          {p.type === "dot" && (
            <div 
              className="bg-current rounded-full"
              style={{ width: p.size / 3, height: p.size / 3 }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}
