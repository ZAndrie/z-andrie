"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { certificatesData } from "@/data/certificates";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Certificates({ certificates = [] }: { certificates?: any[] }) {
  const displayCertificates = certificates && certificates.length > 0 ? certificates : certificatesData;
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [activeModalCert, setActiveModalCert] = useState<any | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // GSAP ScrollTrigger Entrance & Carousel Physics
  useGSAP(() => {
    // 1. Header entrance choreography on scroll
    gsap.from(".gsap-cert-header", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
    });

    // 2. Staggered card entrance with 3D perspective
    gsap.from(".gsap-cert-card", {
      scrollTrigger: {
        trigger: trackRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 60,
      opacity: 0,
      scale: 0.92,
      rotationY: 10,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });

    // 3. Track horizontal scroll listener to update GSAP progress bar
    const track = trackRef.current;
    const pBar = progressBarRef.current;
    if (!track || !pBar) return;

    const onScroll = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll > 0) {
        const progress = track.scrollLeft / maxScroll;
        gsap.to(pBar, { scaleX: Math.min(Math.max(progress, 0.05), 1), duration: 0.2, ease: "power1.out" });
      }
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, { scope: containerRef, dependencies: [displayCertificates] });

  // Smooth scroll via controls
  const handleScrollClick = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const scrollAmount = direction === "left" ? -420 : 420;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      id="certificates"
      className="relative pt-[90px] md:pt-[120px] pb-[80px] bg-[var(--color-light-bg)] border-t border-[var(--color-border)] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-[5%] md:px-[8%]">
        
        {/* Section Header */}
        <div className="gsap-cert-header flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-[40px]">
          <div>
            <p className="text-[11px] uppercase tracking-[3px] font-mono text-[var(--color-primary)] font-bold mb-2">
              ACCREDITATIONS • GSAP CAROUSEL
            </p>
            <h2 className="text-[32px] sm:text-[42px] md:text-[52px] font-serif uppercase text-[var(--color-text-dark)] leading-[1.05]">
              Verified <span className="text-[var(--color-primary)] italic">Credentials</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-[11px] font-mono text-[var(--color-text-light)] uppercase tracking-wider hidden sm:inline-block">
              Glide to browse credentials →
            </span>

            {/* Slider Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScrollClick("left")}
                aria-label="Scroll certificates left"
                className="w-10 h-10 rounded-sm border border-[var(--color-border)] bg-white/80 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all flex items-center justify-center text-sm shadow-sm"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => handleScrollClick("right")}
                aria-label="Scroll certificates right"
                className="w-10 h-10 rounded-sm border border-[var(--color-border)] bg-white/80 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all flex items-center justify-center text-sm shadow-sm"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* GSAP Dynamic Progress Track Bar */}
        <div className="w-full h-[2px] bg-[var(--color-border)]/50 relative overflow-hidden mb-8">
          <div
            ref={progressBarRef}
            className="absolute top-0 left-0 bottom-0 w-full bg-[var(--color-primary)] origin-left scale-x-[0.1]"
          />
        </div>

      </div>

      {/* ── HORIZONTAL GSAP SCROLL TRACK ── */}
      <div
        ref={trackRef}
        className="w-full overflow-x-auto scrollbar-none flex gap-6 px-[5%] md:px-[8%] py-4 select-none scroll-smooth"
        style={{ perspective: 1000 }}
      >
        {displayCertificates.map((item, index) => {
          const imageSrc = imageErrors[item.id] ? "/download/Development.jpg" : item.imageUrl;
          const isExternal = imageSrc?.startsWith("http");

          return (
            <div
              key={item.id || index}
              onClick={() => setActiveModalCert(item)}
              className="gsap-cert-card w-[290px] sm:w-[340px] md:w-[380px] shrink-0 bg-white/90 hover:bg-white border border-[var(--color-border)] rounded-sm shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between p-4 sm:p-5 group relative"
            >
              {/* Precision Corner Crosshairs */}
              <span className="absolute -top-1 -left-1 text-[11px] font-mono text-[var(--color-primary)] leading-none select-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              <span className="absolute -top-1 -right-1 text-[11px] font-mono text-[var(--color-primary)] leading-none select-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              <span className="absolute -bottom-1 -left-1 text-[11px] font-mono text-[var(--color-primary)] leading-none select-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              <span className="absolute -bottom-1 -right-1 text-[11px] font-mono text-[var(--color-primary)] leading-none select-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>

              <div>
                {/* Certificate Frame Preview */}
                <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-[var(--color-dark-bg)] mb-4 border border-[var(--color-border)]">
                  <Image
                    src={imageSrc}
                    alt={item.title}
                    fill
                    unoptimized={isExternal}
                    onError={() => handleImageError(item.id)}
                    className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Badge */}
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-mono font-bold uppercase tracking-wider text-white bg-[var(--color-primary)]/90 px-2 py-0.5 rounded-sm backdrop-blur-sm">
                    ✦ VERIFIED
                  </span>

                  <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono font-medium text-white/90 bg-black/60 px-2 py-0.5 rounded-sm backdrop-blur-sm">
                    {item.date || "2024"}
                  </span>
                </div>

                {/* Details */}
                <h3 className="text-[14px] sm:text-[15px] font-bold text-[var(--color-text-dark)] uppercase tracking-[0.5px] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-snug mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-primary)] font-semibold mb-2">
                  {item.issuer}
                </p>
              </div>

              {/* Card Footer Action */}
              <div className="pt-3 border-t border-[var(--color-border)]/70 flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.5px] mt-3">
                <span className="text-[var(--color-text-dark)] group-hover:text-[var(--color-primary)] inline-flex items-center gap-1 transition-colors">
                  <span>Inspect Credential</span>
                  <span className="arrow-swap w-[9px] h-[9px]">
                    <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </span>
                <span className="text-[10px] font-mono text-[var(--color-text-light)]">
                  #{String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LIGHTBOX INSPECTION MODAL ── */}
      {activeModalCert && (
        <div
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setActiveModalCert(null)}
        >
          <div
            className="relative w-full max-w-[700px] bg-white rounded-sm border border-[var(--color-border)] p-6 shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[2px] text-[var(--color-primary)] font-bold">
                  OFFICIAL ACCREDITATION
                </span>
                <h3 className="text-[18px] sm:text-[22px] font-serif uppercase text-[var(--color-text-dark)] leading-tight mt-1">
                  {activeModalCert.title}
                </h3>
                <p className="text-[12px] font-mono text-[var(--color-text-light)]">
                  Issued by {activeModalCert.issuer} • {activeModalCert.date}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalCert(null)}
                aria-label="Close preview"
                className="w-8 h-8 rounded-sm border border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Large Image */}
            <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-black/5 border border-[var(--color-border)]">
              <Image
                src={imageErrors[activeModalCert.id] ? "/download/Development.jpg" : activeModalCert.imageUrl}
                alt={activeModalCert.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border)]">
              <span className="text-[10px] font-mono text-[var(--color-text-light)]">
                ✦ Verified Digital Credential
              </span>
              <button
                type="button"
                onClick={() => setActiveModalCert(null)}
                className="px-5 py-2 bg-[var(--color-text-dark)] text-white text-[10px] uppercase font-bold tracking-[1.5px] rounded-sm hover:bg-[var(--color-primary)] transition-colors"
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
