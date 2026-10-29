"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { scrollToTarget } from "@/lib/smoothScroll";
import { certificatesData, Certificate } from "@/data/certificates";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Certificates({ certificates = [] }: { certificates?: Certificate[] }) {
  const displayCertificates = certificates && certificates.length > 0 ? certificates : certificatesData;
  const totalCards = displayCertificates.length + 2; // +1 lead card, +1 archive card
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [activeModalCert, setActiveModalCert] = useState<Certificate | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  // Dynamic scroll runway: gives each card ~340px of comfortable horizontal gliding distance
  const scrollDistance = Math.max(1, totalCards - 1) * 340;

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Programmatic jump to a specific card
  const goToCard = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(totalCards - 1, index));
      setActiveCardIndex(clamped);

      const trig = triggerRef.current;
      if (trig) {
        const start = trig.start;
        const end = trig.end;
        const targetProgress = clamped / Math.max(1, totalCards - 1);
        const targetScroll = start + targetProgress * (end - start);
        scrollToTarget(targetScroll, { duration: 0.6 });
      }
    },
    [totalCards]
  );

  // Native CSS Sticky + GSAP Horizontal Conveyor Scrub
  useGSAP(
    () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const getScrollAmount = () => {
        const parentWidth = track.parentElement?.clientWidth || window.innerWidth;
        return Math.max(0, track.scrollWidth - parentWidth);
      };

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollProgress(p);
            const idx = Math.min(totalCards - 1, Math.floor(p * totalCards));
            setActiveCardIndex(idx);
          },
        },
      });

      triggerRef.current = tween.scrollTrigger ?? null;
      ScrollTrigger.refresh();

      return () => {
        tween.kill();
        triggerRef.current = null;
      };
    },
    { scope: containerRef, dependencies: [totalCards] }
  );

  // Ref tracking activeCardIndex to prevent stale closures
  const activeCardIndexRef = useRef(activeCardIndex);
  useEffect(() => {
    activeCardIndexRef.current = activeCardIndex;
  }, [activeCardIndex]);

  // Keyboard Navigation: ArrowRight / ArrowLeft / ArrowDown / ArrowUp
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const isActive = rect.top <= 120 && rect.bottom >= 120;
      if (!isActive) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        const current = activeCardIndexRef.current;
        if (current < totalCards - 1) {
          e.preventDefault();
          goToCard(current + 1);
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        const current = activeCardIndexRef.current;
        if (current > 0) {
          e.preventDefault();
          goToCard(current - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalCards, goToCard]);

  // Touch swipe support for mobile
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -50) {
      goToCard(activeCardIndex + 1);
    } else if (diff > 50) {
      goToCard(activeCardIndex - 1);
    }
  };

  return (
    <section
      id="certificates"
      ref={containerRef}
      style={{
        height: `calc(100vh + ${scrollDistance}px)`,
      }}
      className="relative w-full bg-transparent text-[#e7e5df] border-t border-[#232220]/50 select-none"
    >
      {/* ── THEATRICAL STAGE (STICKY TOP-0 FOR NATIVE 60FPS COMPOSITING) ── */}
      <div
        ref={stageRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-[75px] md:pt-[85px] pb-5 px-6 md:px-12 bg-[#070707]/60 backdrop-blur-[1px] z-20"
      >
        {/* Subtle theatrical background atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 30%, rgba(244, 221, 184, 0.08) 0%, rgba(7, 7, 7, 0.95) 75%)",
          }}
        />

        {/* Top Header HUD */}
        <div className="relative z-10 w-full max-w-[1550px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-[3px] font-mono text-[#d36b54] font-bold mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d36b54] animate-pulse" />
                [ 03 // CREDENTIAL VAULT • {displayCertificates.length} ACCREDITATIONS ]
              </p>
              <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-stencil uppercase text-[#e7e5df] leading-[0.98] tracking-tight">
                Technical <span className="text-[#f4ddb8]">Certificates</span>
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[11px] font-mono text-[#888] uppercase tracking-wider hidden sm:inline-block">
                Glide sideways to explore →
              </span>

              {/* Slider Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToCard(activeCardIndex - 1)}
                  disabled={activeCardIndex === 0}
                  aria-label="Scroll certificates left"
                  className="w-8 h-8 rounded-sm border border-[#2a2a28] bg-[#121110] hover:bg-[#d36b54] disabled:opacity-30 disabled:hover:bg-[#121110] text-[#aaa] hover:text-white hover:border-[#d36b54] transition-all flex items-center justify-center text-sm font-mono cursor-pointer"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => goToCard(activeCardIndex + 1)}
                  disabled={activeCardIndex === totalCards - 1}
                  aria-label="Scroll certificates right"
                  className="w-8 h-8 rounded-sm border border-[#2a2a28] bg-[#121110] hover:bg-[#d36b54] disabled:opacity-30 disabled:hover:bg-[#121110] text-[#aaa] hover:text-white hover:border-[#d36b54] transition-all flex items-center justify-center text-sm font-mono cursor-pointer"
                >
                  →
                </button>
                <a
                  href="https://github.com/ZAndrie/portfolio-contents/tree/main/certificates"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 px-3.5 py-1.5 bg-[#161514] hover:bg-[#d36b54] text-[#e7e5df] hover:text-white border border-[#2e2d2b] hover:border-[#d36b54] text-[10px] uppercase font-mono font-bold tracking-[1.5px] transition-colors rounded-sm hidden md:inline-flex items-center gap-1.5"
                >
                  <span>View Repo</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Horizontal Track Progress Line */}
          <div className="w-full h-[2px] bg-[#1a1918] relative overflow-hidden rounded-full">
            <div
              className="absolute top-0 left-0 bottom-0 bg-[#d36b54] transition-all duration-150 ease-out"
              style={{
                width: `${Math.max(5, Math.round(scrollProgress * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* ── SMOOTH HORIZONTAL CONVEYOR TRACK ── */}
        <div className="relative z-10 w-full max-w-[1550px] mx-auto flex-1 flex items-center min-h-0 overflow-hidden py-2">
          <div
            ref={trackRef}
            className="flex items-center gap-5 sm:gap-6 will-change-transform"
          >
            {/* Intro Lead Card */}
            <div
              onClick={() => goToCard(0)}
              className={`w-[280px] sm:w-[310px] md:w-[330px] shrink-0 h-[330px] sm:h-[350px] bg-[#0c0c0b] border border-dashed rounded-sm flex flex-col justify-between p-6 transition-all duration-300 ${
                activeCardIndex === 0
                  ? "border-[#d36b54] shadow-[0_0_25px_rgba(211,107,84,0.18)]"
                  : "border-[#282725]"
              }`}
            >
              <div>
                <span className="text-[11px] font-mono text-[#d36b54] font-bold uppercase tracking-widest">
                  CREDENTIAL VAULT
                </span>
                <h3 className="text-[22px] sm:text-[24px] font-stencil uppercase text-[#e7e5df] leading-tight mt-3 mb-3">
                  Verified <span className="text-[#f4ddb8]">Accreditations</span>
                </h3>
                <p className="text-[12px] text-[#a8a59d] leading-relaxed font-sans font-light">
                  Official technical certifications spanning Cybersecurity, Web Development, Systems Architecture, and Design Engineering.
                </p>
              </div>
              <div className="pt-4 border-t border-[#1f1e1c] flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#d36b54]">
                <span>SWIPE OR GLIDE</span>
                <span className="text-base leading-none">→</span>
              </div>
            </div>

            {/* Certificate Cards */}
            {displayCertificates.map((item, index) => {
              const cardIdx = index + 1;
              const isActive = activeCardIndex === cardIdx;
              const imageSrc = imageErrors[item.id] ? "/download/Development.jpg" : item.imageUrl;
              const isExternal = imageSrc?.startsWith("http");

              return (
                <div
                  key={item.id || index}
                  onClick={() => setActiveModalCert(item)}
                  className={`w-[280px] sm:w-[320px] md:w-[350px] shrink-0 h-[330px] sm:h-[350px] bg-[#0e0d0c] hover:bg-[#131210] border rounded-sm shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between p-4 group relative overflow-hidden ${
                    isActive
                      ? "border-[#d36b54] shadow-[0_0_25px_rgba(211,107,84,0.15)] -translate-y-1"
                      : "border-[#242321] hover:border-[#d36b54]/70"
                  }`}
                >
                  {/* Precision Corner Crosshairs */}
                  <span className="absolute -top-1 -left-1 text-[11px] font-mono text-[#d36b54] leading-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                  <span className="absolute -top-1 -right-1 text-[11px] font-mono text-[#d36b54] leading-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                  <span className="absolute -bottom-1 -left-1 text-[11px] font-mono text-[#d36b54] leading-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                  <span className="absolute -bottom-1 -right-1 text-[11px] font-mono text-[#d36b54] leading-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>

                  <div>
                    {/* Certificate Frame Preview */}
                    <div className="relative w-full h-[155px] sm:h-[175px] rounded-[2px] overflow-hidden bg-[#070707] mb-3 border border-[#232220]">
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        unoptimized={isExternal}
                        onError={() => handleImageError(item.id)}
                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 filter contrast-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/60 via-transparent to-transparent pointer-events-none" />

                      {/* Badges */}
                      <span className="absolute top-2 left-2 text-[9px] font-mono font-bold uppercase tracking-wider text-white bg-[#d36b54]/90 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
                        ✦ VERIFIED
                      </span>

                      <span className="absolute bottom-2 right-2 text-[9px] font-mono font-medium text-[#f4ddb8] bg-black/70 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
                        {item.date || "2026"}
                      </span>
                    </div>

                    {/* Details */}
                    <h3 className="text-[13px] sm:text-[14px] font-bold text-[#e7e5df] uppercase tracking-[0.5px] group-hover:text-[#f4ddb8] transition-colors line-clamp-2 leading-snug mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-[#d36b54] font-semibold line-clamp-1 mb-1">
                      {item.issuer}
                    </p>
                    <p className="text-[10px] text-[#888] font-mono">
                      Issued: {item.date}
                    </p>
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-2.5 border-t border-[#1f1e1c] flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-[1px] mt-2">
                    <span className="text-[#a8a59d] group-hover:text-[#f4ddb8] inline-flex items-center gap-1 transition-colors">
                      <span>Inspect Credential</span>
                      <span>↗</span>
                    </span>
                    {item.repoUrl ? (
                      <a
                        href={item.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#d36b54] hover:underline flex items-center gap-0.5"
                        title="View file on GitHub"
                      >
                        GitHub ↗
                      </a>
                    ) : (
                      <span className="text-[10px] font-mono text-[#666]">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Outro Explorer Card */}
            <div
              onClick={() => goToCard(totalCards - 1)}
              className={`w-[280px] sm:w-[310px] md:w-[330px] shrink-0 h-[330px] sm:h-[350px] bg-[#0c0c0b] text-white p-6 rounded-sm flex flex-col justify-between border transition-all duration-300 ${
                activeCardIndex === totalCards - 1
                  ? "border-[#d36b54] shadow-[0_0_25px_rgba(211,107,84,0.18)]"
                  : "border-[#232220]"
              }`}
            >
              <div>
                <span className="text-[11px] font-mono text-[#d36b54] font-bold uppercase tracking-widest">
                  PORTFOLIO ARCHIVE
                </span>
                <h3 className="text-[22px] sm:text-[24px] font-stencil uppercase text-[#e7e5df] leading-tight mt-3 mb-2">
                  View Full <span className="text-[#f4ddb8]">Records</span>
                </h3>
                <p className="text-[12px] text-[#888] leading-relaxed font-sans font-light">
                  All certificates, source files, and verified image assets are hosted openly on GitHub.
                </p>
              </div>

              <div className="pt-4 border-t border-[#1f1e1c]">
                <a
                  href="https://github.com/ZAndrie/portfolio-contents/tree/main/certificates"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono font-bold uppercase tracking-[2px] text-[#e7e5df] hover:text-[#f4ddb8] transition-colors inline-flex items-center gap-2"
                >
                  <span>OPEN REPOSITORY</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM STAGE PROGRESS BAR & CONTROLS HINT ── */}
        <div className="relative z-10 w-full max-w-[1550px] mx-auto pt-2">
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#666] uppercase tracking-[2px] mb-2">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54]" />
              Horizontal Vault Conveyor
            </span>
            <span className="hidden sm:inline-block">
              [← / →] Scroll or Arrow Keys to Explore Credentials
            </span>
            <span>
              {Math.round(((activeCardIndex + 1) / totalCards) * 100)}% Verified
            </span>
          </div>

          {/* GSAP Progress Line */}
          <div className="w-full h-[2px] bg-[#1a1918] relative overflow-hidden rounded-full">
            <div
              className="absolute top-0 left-0 bottom-0 bg-[#d36b54] transition-all duration-150 ease-out"
              style={{
                width: `${Math.max(4, Math.round(scrollProgress * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX INSPECTION MODAL ── */}
      {activeModalCert && (
        <div
          className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveModalCert(null)}
        >
          <div
            className="relative w-full max-w-[720px] bg-[#0e0d0c] rounded-sm border border-[#2e2d2b] p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-[#e7e5df]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[2px] text-[#d36b54] font-bold">
                  OFFICIAL ACCREDITATION
                </span>
                <h3 className="text-[18px] sm:text-[22px] font-stencil uppercase text-[#e7e5df] leading-tight mt-1">
                  {activeModalCert.title}
                </h3>
                <p className="text-[11px] font-mono text-[#888]">
                  Issued by {activeModalCert.issuer} • {activeModalCert.date}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalCert(null)}
                aria-label="Close preview"
                className="w-8 h-8 rounded-sm border border-[#2a2a28] hover:bg-[#d36b54] hover:text-white transition-all flex items-center justify-center text-sm font-bold shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Large Image */}
            <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-black border border-[#232220]">
              <Image
                src={imageErrors[activeModalCert.id] ? "/download/Development.jpg" : activeModalCert.imageUrl}
                alt={activeModalCert.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-[#1f1e1c] flex-wrap gap-2">
              {activeModalCert.repoUrl ? (
                <a
                  href={activeModalCert.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono font-bold text-[#d36b54] hover:text-[#f4ddb8] hover:underline inline-flex items-center gap-1"
                >
                  <span>View Original Record on GitHub</span>
                  <span>↗</span>
                </a>
              ) : (
                <span className="text-[10px] font-mono text-[#888]">
                  ✦ Verified Digital Credential
                </span>
              )}

              <button
                type="button"
                onClick={() => setActiveModalCert(null)}
                className="px-5 py-2 bg-[#181716] text-[#e7e5df] text-[10px] font-mono uppercase font-bold tracking-[1.5px] rounded-sm hover:bg-[#d36b54] hover:text-white transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
