"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TechParticles from "./TechParticles";

export default function Hero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative flex flex-1 w-full items-center justify-center bg-[var(--color-light-bg)] overflow-hidden pt-[80px] pb-[40px]"
    >
      {/* Floating Tech Particles */}
      <TechParticles />

      {/* Giant Background Typography - Outlined so it doesn't clash */}
      <motion.div 
        className="absolute top-[15%] left-0 w-full text-center select-none pointer-events-none z-0 flex justify-center"
        style={{ transform: `translateY(${offset * 0.2}px)` }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <h1 
          className="text-[18vw] leading-none font-bold tracking-[-0.04em] font-serif uppercase text-transparent"
          style={{ WebkitTextStroke: "2px rgba(28, 28, 28, 0.1)" }}
        >
          Portfolio
        </h1>
      </motion.div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-[5%] md:px-[8%] flex flex-col md:flex-row items-center justify-between gap-[50px] lg:gap-[100px]">
        
        {/* Left Content */}
        <motion.div 
          className="flex-1 max-w-[500px] mt-[40px] md:mt-0 relative z-20 bg-[var(--color-light-bg)]/50 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none p-4 md:p-0 rounded-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-[var(--color-text-dark)] text-[14px] mb-[15px] uppercase tracking-[2px] font-bold">
            HELLO, I'M
          </p>
          <h2 className="text-[38px] sm:text-[48px] md:text-[72px] lg:text-[100px] leading-[0.9] font-serif text-[var(--color-text-dark)] mb-[20px] uppercase">
            Z<br />Andrie
          </h2>
          <p className="text-[var(--color-primary)] font-bold text-[13px] uppercase tracking-[2px] mb-[25px]">
            WEB DESIGNER & DIGITAL CREATIVE
          </p>
          <p className="text-[var(--color-text-light)] mb-[40px] leading-[1.8] text-[15px] sm:text-[16px] max-w-full md:max-w-[400px]">
            I craft clean, modern, and user-focused websites that help brands stand out and connect with the right audience.
          </p>
          
          {/* Faux Signature */}
          <div className="font-serif italic text-[36px] text-[var(--color-text-dark)] opacity-70">
            Andrei
          </div>
        </motion.div>
        
        {/* Right Content - Image */}
        <motion.div 
          className="flex-1 relative flex justify-center items-center w-full max-w-[500px] mt-[40px] md:mt-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          
          {/* Profile Image - Circular with Orange Border */}
          <div className="relative z-10 w-[300px] h-[300px] md:w-[400px] md:h-[400px] overflow-hidden rounded-full shadow-2xl border-[15px] border-[var(--color-primary)]">
            <Image
              src="/profile.png"
              alt="Z Andrie"
              fill
              sizes="(max-width: 768px) 300px, 400px"
              className="object-cover object-center scale-[1.05]"
              priority
            />
          </div>

        </motion.div>
      </div>
    </section>
  );
}
