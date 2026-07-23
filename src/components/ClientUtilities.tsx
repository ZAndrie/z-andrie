"use client";

import { useState, useEffect } from "react";

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
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setWidth(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[4px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] z-[9999] transition-[width] duration-100"
      style={{ width: `${width}%` }}
    ></div>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-[30px] right-[30px] w-[50px] h-[50px] bg-[var(--color-primary)] text-white border-none rounded-full text-[24px] cursor-pointer flex items-center justify-center transition-all duration-300 z-[999] hover:-translate-y-[5px] ${
        show ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      ↑
    </button>
  );
}
