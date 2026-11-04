"use client";

import { useState, useEffect, useRef } from "react";
import { scrollToTarget } from "@/lib/smoothScroll";

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState(true);

  useEffect(() => {
    // Increased duration slightly to let the user see the skeleton effect
    const timer1 = setTimeout(() => setLoading(false), 1200);
    const timer2 = setTimeout(() => setDisplay(false), 1700);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!display) return null;

  return (
    <div
      className={`fixed inset-0 w-full h-full bg-[var(--color-light-bg)] z-[99999] transition-opacity duration-500 overflow-hidden ${
        loading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-full max-w-[1400px] mx-auto px-[5%] md:px-[8%] pt-[40px] animate-pulse">
        {/* Navbar Skeleton */}
        <div className="flex justify-between items-center mb-[80px] md:mb-[120px]">
          <div className="w-[150px] h-[16px] bg-black/10 rounded"></div>
          <div className="hidden md:flex gap-10">
            <div className="w-[60px] h-[12px] bg-black/10 rounded"></div>
            <div className="w-[60px] h-[12px] bg-black/10 rounded"></div>
            <div className="w-[60px] h-[12px] bg-black/10 rounded"></div>
          </div>
          <div className="w-[180px] h-[16px] bg-black/10 rounded hidden md:block"></div>
        </div>

        {/* Hero Skeleton */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-[50px] lg:gap-[100px]">
          
          {/* Left Text Skeleton */}
          <div className="flex-1 w-full max-w-[500px]">
            <div className="w-[100px] h-[14px] bg-black/10 rounded mb-[25px]"></div>
            <div className="w-[85%] h-[60px] md:h-[90px] bg-black/10 rounded mb-[15px]"></div>
            <div className="w-[65%] h-[60px] md:h-[90px] bg-black/10 rounded mb-[30px]"></div>
            <div className="w-[180px] h-[14px] bg-black/10 rounded mb-[40px]"></div>
            
            <div className="w-full h-[14px] bg-black/10 rounded mb-[15px]"></div>
            <div className="w-[90%] h-[14px] bg-black/10 rounded mb-[15px]"></div>
            <div className="w-[75%] h-[14px] bg-black/10 rounded mb-[50px]"></div>
            
            <div className="w-[200px] h-[30px] bg-black/10 rounded"></div>
          </div>

          {/* Right Image Skeleton */}
          <div className="flex-1 w-full max-w-[500px] flex justify-center mt-10 md:mt-0">
            <div className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] bg-black/10 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const maxScrollRef = useRef(1);

  useEffect(() => {
    const updateMax = () => {
      if (typeof window !== "undefined") {
        maxScrollRef.current = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        );
      }
    };
    updateMax();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (barRef.current) {
            const frac = Math.max(0, Math.min(1, window.scrollY / (maxScrollRef.current || 1)));
            barRef.current.style.transform = `scaleX(${frac})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateMax, { passive: true });
    window.addEventListener("preloader:done", updateMax);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateMax);
      window.removeEventListener("preloader:done", updateMax);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[var(--color-primary)] via-[#f4ddb8] to-[#d36b54] z-[9999] will-change-transform origin-left pointer-events-none"
      style={{ transform: "scaleX(0)" }}
    />
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  const showRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const isPast = window.scrollY > 300;
      if (isPast !== showRef.current) {
        showRef.current = isPast;
        setShow(isPast);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollToTarget(0, { duration: 1.0 });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-[30px] right-[30px] w-[46px] h-[46px] bg-[#d36b54] text-white border border-white/20 rounded-full text-[20px] cursor-pointer flex items-center justify-center transition-all duration-300 z-[999] hover:-translate-y-[4px] shadow-lg shadow-black/50 ${
        show ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"
      }`}
    >
      ↑
    </button>
  );
}
