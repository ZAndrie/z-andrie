"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { certificatesData, Certificate } from "@/data/certificates";

export default function Certificates({ certificates = [] }: { certificates?: Certificate[] }) {
  const displayCertificates = certificates && certificates.length > 0 ? certificates : certificatesData;
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [activeModalCert, setActiveModalCert] = useState<Certificate | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Update horizontal track progress bar on scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (max > 0) {
        setScrollProgress(track.scrollLeft / max);
      }
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [displayCertificates]);

  // Smooth horizontal scroll buttons
  const handleScrollClick = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const amount = direction === "left" ? -420 : 420;
    track.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section
      id="certificates"
      className="relative w-full py-16 md:py-20 bg-[#070707] text-[#e7e5df] border-t border-[#232220] select-none overflow-hidden"
    >
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 mb-6">
        {/* Header HUD */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[3px] font-mono text-[#d36b54] font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d36b54] animate-pulse" />
              [ 03 // CREDENTIAL VAULT • {displayCertificates.length} ACCREDITATIONS ]
            </p>
            <h2 className="text-[34px] sm:text-[44px] md:text-[54px] font-stencil uppercase text-[#e7e5df] leading-[0.98] tracking-tight">
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
                onClick={() => handleScrollClick("left")}
                aria-label="Scroll certificates left"
                className="w-9 h-9 rounded-sm border border-[#2a2a28] bg-[#121110] hover:bg-[#d36b54] text-[#aaa] hover:text-white hover:border-[#d36b54] transition-all flex items-center justify-center text-sm font-mono cursor-pointer"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => handleScrollClick("right")}
                aria-label="Scroll certificates right"
                className="w-9 h-9 rounded-sm border border-[#2a2a28] bg-[#121110] hover:bg-[#d36b54] text-[#aaa] hover:text-white hover:border-[#d36b54] transition-all flex items-center justify-center text-sm font-mono cursor-pointer"
              >
                →
              </button>
              <a
                href="https://github.com/ZAndrie/portfolio-contents/tree/main/certificates"
                target="_blank"
                rel="noreferrer"
                className="ml-2 px-3.5 py-2 bg-[#161514] hover:bg-[#d36b54] text-[#e7e5df] hover:text-white border border-[#2e2d2b] hover:border-[#d36b54] text-[10px] uppercase font-mono font-bold tracking-[1.5px] transition-colors rounded-sm hidden md:inline-flex items-center gap-1.5"
              >
                <span>View Repo</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Horizontal Track Progress Line */}
        <div className="w-full h-[2px] bg-[#1a1918] relative overflow-hidden rounded-full mt-2">
          <div
            className="absolute top-0 left-0 bottom-0 bg-[#d36b54] transition-all duration-150 ease-out"
            style={{
              width: `${Math.max(5, Math.round(scrollProgress * 100))}%`,
            }}
          />
        </div>
      </div>

      {/* ── SMOOTH HORIZONTAL CAROUSEL TRACK ── */}
      <div
        ref={trackRef}
        className="w-full overflow-x-auto scroll-smooth scrollbar-none flex items-stretch gap-5 sm:gap-6 px-6 md:px-12 py-3"
      >
        {/* Intro Lead Card */}
        <div className="w-[280px] sm:w-[310px] md:w-[330px] shrink-0 h-[340px] sm:h-[360px] bg-[#0c0c0b] border border-dashed border-[#282725] p-6 rounded-sm flex flex-col justify-between">
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
          <div className="pt-4 border-t border-[#1f1e1c] flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#d36b54]">
            <span>SWIPE OR GLIDE</span>
            <span className="text-base leading-none">→</span>
          </div>
        </div>

        {/* Certificate Cards */}
        {displayCertificates.map((item, index) => {
          const imageSrc = imageErrors[item.id] ? "/download/Development.jpg" : item.imageUrl;
          const isExternal = imageSrc?.startsWith("http");

          return (
            <div
              key={item.id || index}
              onClick={() => setActiveModalCert(item)}
              className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 h-[340px] sm:h-[360px] bg-[#0e0d0c] hover:bg-[#131210] border border-[#242321] hover:border-[#d36b54]/70 rounded-sm shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between p-4 group relative overflow-hidden"
            >
              {/* Precision Corner Crosshairs */}
              <span className="absolute -top-1 -left-1 text-[11px] font-mono text-[#d36b54] leading-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              <span className="absolute -top-1 -right-1 text-[11px] font-mono text-[#d36b54] leading-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              <span className="absolute -bottom-1 -left-1 text-[11px] font-mono text-[#d36b54] leading-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              <span className="absolute -bottom-1 -right-1 text-[11px] font-mono text-[#d36b54] leading-none font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>

              <div>
                {/* Certificate Frame Preview */}
                <div className="relative w-full h-[160px] sm:h-[180px] rounded-[2px] overflow-hidden bg-[#070707] mb-3 border border-[#232220]">
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
        <div className="w-[280px] sm:w-[310px] md:w-[330px] shrink-0 h-[340px] sm:h-[360px] bg-[#0c0c0b] text-white p-6 rounded-sm flex flex-col justify-between border border-[#232220]">
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