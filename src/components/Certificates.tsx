"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { certificatesData, Certificate } from "@/data/certificates";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Certificates({ certificates = [] }: { certificates?: Certificate[] }) {
  const displayCertificates = certificates && certificates.length > 0 ? certificates : certificatesData;
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [activeModalCert, setActiveModalCert] = useState<Certificate | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // GSAP ScrollTrigger Entrance & Carousel Progress
  useGSAP(() => {
    // 1. Entrance animation (cards remain visible even if trigger is missed)
    const cards = gsap.utils.toArray<HTMLElement>(".gsap-cert-card");
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { y: 30, opacity: 0.6 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    }

    // 2. Track horizontal scroll listener to update progress bar
    const track = trackRef.current;
    const pBar = progressBarRef.current;
    if (!track || !pBar) return;

    const onScroll = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll > 0) {
        const progress = track.scrollLeft / maxScroll;
        gsap.to(pBar, {
          scaleX: Math.min(Math.max(progress, 0.08), 1),
          duration: 0.15,
          ease: "power1.out",
        });
      }
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    ScrollTrigger.refresh();

    return () => track.removeEventListener("scroll", onScroll);
  }, { scope: containerRef, dependencies: [displayCertificates] });

  // Smooth click scroll for button controls
  const handleScrollClick = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const scrollAmount = direction === "left" ? -440 : 440;
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[3px] font-mono text-[var(--color-primary)] font-bold mb-2">
              ACCREDITATIONS • SCROLL SHOWCASE ({displayCertificates.length})
            </p>
            <h2 className="text-[32px] sm:text-[42px] md:text-[52px] font-serif uppercase text-[var(--color-text-dark)] leading-[1.05]">
              My <span className="text-[var(--color-primary)] italic">Certificates</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-[11px] font-mono text-[var(--color-text-light)] uppercase tracking-wider hidden sm:inline-block">
              Scroll horizontally to explore →
            </span>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScrollClick("left")}
                aria-label="Scroll certificates left"
                className="w-10 h-10 rounded-sm border border-[var(--color-border)] bg-white/90 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all flex items-center justify-center text-sm shadow-sm font-bold"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => handleScrollClick("right")}
                aria-label="Scroll certificates right"
                className="w-10 h-10 rounded-sm border border-[var(--color-border)] bg-white/90 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all flex items-center justify-center text-sm shadow-sm font-bold"
              >
                →
              </button>
              <a
                href="https://github.com/ZAndrie/portfolio-contents/tree/main/certificates"
                target="_blank"
                rel="noreferrer"
                className="ml-2 px-4 py-2.5 bg-[var(--color-text-dark)] text-white hover:bg-[var(--color-primary)] text-[10px] uppercase font-bold tracking-[1.5px] transition-colors rounded-sm hidden md:inline-flex items-center gap-1.5"
              >
                <span>View Repo</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* GSAP Dynamic Progress Line */}
        <div className="w-full h-[2px] bg-[var(--color-border)]/60 relative overflow-hidden mb-6">
          <div
            ref={progressBarRef}
            className="absolute top-0 left-0 bottom-0 w-full bg-[var(--color-primary)] origin-left scale-x-[0.1]"
          />
        </div>

      </div>

      {/* ── HORIZONTAL GSAP SCROLL CAROUSEL TRACK ── */}
      <div
        ref={trackRef}
        className="w-full overflow-x-auto scrollbar-none flex gap-5 sm:gap-6 px-[5%] md:px-[8%] py-3 select-none scroll-smooth"
      >
        {displayCertificates.map((item, index) => {
          const imageSrc = imageErrors[item.id] ? "/download/Development.jpg" : item.imageUrl;
          const isExternal = imageSrc?.startsWith("http");

          return (
            <div
              key={item.id || index}
              onClick={() => setActiveModalCert(item)}
              className="gsap-cert-card w-[280px] sm:w-[330px] md:w-[360px] shrink-0 bg-white/95 hover:bg-white border border-[var(--color-border)] rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between p-4 group relative"
            >
              {/* Precision Corner Crosshairs */}
              <span className="absolute -top-1 -left-1 text-[11px] font-mono text-[var(--color-primary)] leading-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              <span className="absolute -top-1 -right-1 text-[11px] font-mono text-[var(--color-primary)] leading-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              <span className="absolute -bottom-1 -left-1 text-[11px] font-mono text-[var(--color-primary)] leading-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              <span className="absolute -bottom-1 -right-1 text-[11px] font-mono text-[var(--color-primary)] leading-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>

              <div>
                {/* Certificate Frame Preview */}
                <div className="relative w-full aspect-[4/3] rounded-[2px] overflow-hidden bg-[var(--color-dark-bg)] mb-3.5 border border-[var(--color-border)]">
                  <Image
                    src={imageSrc}
                    alt={item.title}
                    fill
                    unoptimized={isExternal}
                    onError={() => handleImageError(item.id)}
                    className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Badge */}
                  <span className="absolute top-2 left-2 text-[9px] font-mono font-bold uppercase tracking-wider text-white bg-[var(--color-primary)]/90 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
                    ✦ VERIFIED
                  </span>

                  <span className="absolute bottom-2 right-2 text-[9px] font-mono font-medium text-white/90 bg-black/60 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
                    {item.date || "2026"}
                  </span>
                </div>

                {/* Details */}
                <h3 className="text-[13px] sm:text-[14px] font-bold text-[var(--color-text-dark)] uppercase tracking-[0.5px] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-snug mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-primary)] font-semibold line-clamp-1 mb-1">
                  {item.issuer}
                </p>
                <p className="text-[10px] text-[var(--color-text-light)]">
                  Issued: {item.date}
                </p>
              </div>

              {/* Card Footer Action */}
              <div className="pt-2.5 border-t border-[var(--color-border)]/70 flex items-center justify-between text-[10px] font-bold uppercase tracking-[1px] mt-2.5">
                <span className="text-[var(--color-text-dark)] group-hover:text-[var(--color-primary)] inline-flex items-center gap-1 transition-colors">
                  <span>Inspect Credential</span>
                  <span className="arrow-swap w-[9px] h-[9px]">
                    <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </span>
                {item.repoUrl ? (
                  <a
                    href={item.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[var(--color-primary)] hover:underline flex items-center gap-0.5"
                    title="View file on GitHub"
                  >
                    GitHub ↗
                  </a>
                ) : (
                  <span className="text-[10px] font-mono text-[var(--color-text-light)]">
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LIGHTBOX INSPECTION MODAL ── */}
      {activeModalCert && (
        <div
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveModalCert(null)}
        >
          <div
            className="relative w-full max-w-[720px] bg-white rounded-sm border border-[var(--color-border)] p-5 sm:p-6 shadow-2xl flex flex-col gap-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[2px] text-[var(--color-primary)] font-bold">
                  OFFICIAL ACCREDITATION
                </span>
                <h3 className="text-[16px] sm:text-[20px] font-serif uppercase text-[var(--color-text-dark)] leading-tight mt-1">
                  {activeModalCert.title}
                </h3>
                <p className="text-[11px] font-mono text-[var(--color-text-light)]">
                  Issued by {activeModalCert.issuer} • {activeModalCert.date}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalCert(null)}
                aria-label="Close preview"
                className="w-8 h-8 rounded-sm border border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center justify-center text-sm font-bold shrink-0"
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
            <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border)] flex-wrap gap-2">
              {activeModalCert.repoUrl ? (
                <a
                  href={activeModalCert.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
                >
                  <span>View Original Record on GitHub</span>
                  <span>↗</span>
                </a>
              ) : (
                <span className="text-[10px] font-mono text-[var(--color-text-light)]">
                  ✦ Verified Digital Credential
                </span>
              )}

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
