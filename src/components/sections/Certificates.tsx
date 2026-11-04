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

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const activeCardIndexRef = useRef(0);

  const scrollDistance = Math.max(1, totalCards - 1) * 340;

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const goToCard = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(totalCards - 1, index));
      activeCardIndexRef.current = clamped;
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
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (progressLineRef.current) {
              progressLineRef.current.style.transform = `scaleX(${Math.max(0.04, p)})`;
            }
            const idx = Math.min(totalCards - 1, Math.floor(p * totalCards));
            if (idx !== activeCardIndexRef.current) {
              activeCardIndexRef.current = idx;
              setActiveCardIndex(idx);
            }
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

  useEffect(() => {
    activeCardIndexRef.current = activeCardIndex;
  }, [activeCardIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const isActive = rect.top <= 100 && rect.bottom >= 100;
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
      ref={containerRef}
      id="certificates"
      style={{
        height: `calc(100vh + ${scrollDistance}px)`,
      }}
      className="relative w-full bg-transparent text-[#e7e5df] border-t border-white/[0.08] select-none"
    >
      {/* ── STICKY SHOWCASE VIEWPORT ── */}
      <div
        ref={stageRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-[85px] md:pt-[95px] pb-6 px-6 md:px-12 bg-[#070707]/80 z-20 will-change-transform"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 30%, rgba(244, 221, 184, 0.08) 0%, rgba(7, 7, 7, 0.95) 75%)",
          }}
        />

        {/* Top Header */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-3 pb-3 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono tracking-[2px] uppercase text-[#a8a59d] mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54]" />
                <span>05 / Credentials • {displayCertificates.length} Accreditations</span>
              </div>
              <h2 className="text-[32px] sm:text-[42px] md:text-[48px] font-heading font-bold uppercase text-[#ffffff] leading-[0.98] tracking-tight">
                Verified <span className="text-[#d36b54]">Certifications</span>
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[11px] font-mono text-[#9ca3af] uppercase tracking-wider hidden sm:inline-block">
                Scroll to slide →
              </span>

              {/* Slider Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToCard(activeCardIndex - 1)}
                  disabled={activeCardIndex === 0}
                  aria-label="Scroll left"
                  className="w-8 h-8 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-[#d36b54] hover:border-[#d36b54] disabled:opacity-25 text-white transition-all flex items-center justify-center text-xs font-mono cursor-pointer"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => goToCard(activeCardIndex + 1)}
                  disabled={activeCardIndex === totalCards - 1}
                  aria-label="Scroll right"
                  className="w-8 h-8 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-[#d36b54] hover:border-[#d36b54] disabled:opacity-25 text-white transition-all flex items-center justify-center text-xs font-mono cursor-pointer"
                >
                  →
                </button>
                <a
                  href="https://github.com/ZAndrie/portfolio-contents/tree/main/certificates"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 px-4 py-1.5 bg-white/[0.04] hover:bg-[#d36b54] text-white border border-white/[0.1] hover:border-[#d36b54] text-[10px] uppercase font-mono font-semibold tracking-wider transition-all rounded-full hidden md:inline-flex items-center gap-1.5"
                >
                  <span>Repository</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── SMOOTH HORIZONTAL CONVEYOR TRACK ── */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto flex-1 flex items-center min-h-0 overflow-hidden py-4">
          <div
            ref={trackRef}
            className="flex items-center gap-6 will-change-transform"
          >
            {/* Intro Lead Card */}
            <div
              onClick={() => goToCard(0)}
              className={`w-[290px] sm:w-[320px] md:w-[340px] shrink-0 h-[340px] sm:h-[360px] rounded-2xl bg-[#0c0c0f]/80 backdrop-blur-xl border flex flex-col justify-between p-6 transition-all duration-300 ${
                activeCardIndex === 0
                  ? "border-[#d36b54] shadow-[0_0_30px_rgba(211,107,84,0.2)]"
                  : "border-white/[0.08]"
              }`}
            >
              <div>
                <span className="text-[10px] font-mono text-[#d36b54] font-semibold uppercase tracking-widest">
                  CREDENTIAL OVERVIEW
                </span>
                <h3 className="text-[22px] sm:text-[24px] font-heading font-bold uppercase text-[#ffffff] leading-tight mt-3 mb-3">
                  Verified <span className="text-[#f4ddb8]">Honors</span>
                </h3>
                <p className="text-[13px] text-[#9ca3af] leading-relaxed font-sans font-light">
                  Official technical certifications covering Cybersecurity, Full-Stack Architecture, Cisco Network Defense, and Quality Assurance.
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#d36b54]">
                <span>Scroll or swipe</span>
                <span>→</span>
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
                  className={`w-[290px] sm:w-[320px] md:w-[340px] shrink-0 h-[340px] sm:h-[360px] rounded-2xl bg-[#0c0c0f]/80 backdrop-blur-xl border shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between p-4 group relative overflow-hidden ${
                    isActive
                      ? "border-[#d36b54] shadow-[0_0_25px_rgba(211,107,84,0.2)] -translate-y-1"
                      : "border-white/[0.08] hover:border-white/[0.2]"
                  }`}
                >
                  <div>
                    {/* Certificate Image Container */}
                    <div className="relative w-full h-[160px] sm:h-[180px] rounded-xl overflow-hidden bg-black/60 mb-3 border border-white/[0.08]">
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        unoptimized={isExternal}
                        onError={() => handleImageError(item.id)}
                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 filter contrast-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                      {/* Badges */}
                      <span className="absolute top-2.5 left-2.5 text-[9px] font-mono font-semibold uppercase tracking-wider text-white bg-[#d36b54] px-2 py-0.5 rounded-full backdrop-blur-sm">
                        Verified
                      </span>

                      <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-[#f4ddb8] bg-black/75 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {item.date || "2026"}
                      </span>
                    </div>

                    {/* Details */}
                    <h3 className="text-[13px] sm:text-[14px] font-heading font-semibold text-[#ffffff] uppercase group-hover:text-[#f4ddb8] transition-colors line-clamp-2 leading-snug mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-[#d36b54] font-medium line-clamp-1 mb-1">
                      {item.issuer}
                    </p>
                    <p className="text-[10px] text-[#888] font-mono">
                      Issued: {item.date}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mt-2">
                    <span className="text-[#a8a59d] group-hover:text-white inline-flex items-center gap-1 transition-colors">
                      <span>Inspect Credential</span>
                      <span>↗</span>
                    </span>
                    {item.repoUrl ? (
                      <a
                        href={item.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#d36b54] hover:underline"
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
              className={`w-[290px] sm:w-[320px] md:w-[340px] shrink-0 h-[340px] sm:h-[360px] rounded-2xl bg-[#0c0c0f]/80 backdrop-blur-xl text-white p-6 flex flex-col justify-between border transition-all duration-300 ${
                activeCardIndex === totalCards - 1
                  ? "border-[#d36b54] shadow-[0_0_30px_rgba(211,107,84,0.2)]"
                  : "border-white/[0.08]"
              }`}
            >
              <div>
                <span className="text-[10px] font-mono text-[#d36b54] font-semibold uppercase tracking-widest">
                  PORTFOLIO ARCHIVE
                </span>
                <h3 className="text-[22px] sm:text-[24px] font-heading font-bold uppercase text-[#ffffff] leading-tight mt-3 mb-2">
                  View Full <span className="text-[#f4ddb8]">Records</span>
                </h3>
                <p className="text-[13px] text-[#9ca3af] leading-relaxed font-sans font-light">
                  All certificates, source files, and verified image assets are hosted openly on GitHub.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <a
                  href="https://github.com/ZAndrie/portfolio-contents/tree/main/certificates"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono font-medium uppercase tracking-[2px] text-[#ffffff] hover:text-[#d36b54] transition-colors inline-flex items-center gap-2"
                >
                  <span>OPEN REPOSITORY</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM PROGRESS LINE ── */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto pt-2">
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#888] uppercase tracking-[2px] mb-2">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54]" />
              Credentials Conveyor
            </span>
            <span className="hidden sm:inline-block">
              Scroll or Swipe to View All
            </span>
            <span>
              {Math.round(((activeCardIndex + 1) / totalCards) * 100)}% Verified
            </span>
          </div>

          {/* GSAP Progress Line (GPU accelerated scaleX) */}
          <div className="w-full h-[2px] bg-white/[0.08] relative overflow-hidden rounded-full">
            <div
              ref={progressLineRef}
              className="h-full w-full bg-gradient-to-r from-[#d36b54] to-[#f4ddb8] will-change-transform origin-left rounded-full"
              style={{
                transform: "scaleX(0.04)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX INSPECTION MODAL ── */}
      {activeModalCert && (
        <div
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveModalCert(null)}
        >
          <div
            className="relative w-full max-w-[720px] rounded-2xl bg-[#0c0c0f] border border-white/[0.12] p-6 shadow-2xl flex flex-col gap-4 text-[#e7e5df]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[2px] text-[#d36b54] font-semibold">
                  OFFICIAL ACCREDITATION
                </span>
                <h3 className="text-[18px] sm:text-[22px] font-heading font-bold uppercase text-[#ffffff] leading-tight mt-1">
                  {activeModalCert.title}
                </h3>
                <p className="text-[11px] font-mono text-[#9ca3af]">
                  Issued by {activeModalCert.issuer} • {activeModalCert.date}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalCert(null)}
                aria-label="Close preview"
                className="w-8 h-8 rounded-full border border-white/[0.15] hover:bg-white/[0.1] text-white transition-all flex items-center justify-center text-xs font-bold shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-white/[0.08]">
              <Image
                src={imageErrors[activeModalCert.id] ? "/download/Development.jpg" : activeModalCert.imageUrl}
                alt={activeModalCert.title}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
