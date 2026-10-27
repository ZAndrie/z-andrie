"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);
  const [uvActive, setUvActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide the public navbar on admin and login routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  const navLinks = [
    { name: "HOME", href: "/#home" },
    { name: "ABOUT", href: "/#about" },
    { name: "WORKS", href: "/#works" },
    { name: "EXPERTISE", href: "/#expertise" },
    { name: "CERTIFICATES", href: "/#certificates" },
    { name: "BLOG", href: "/#blog" },
    { name: "CONTACT", href: "/#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-[1000] transition-all duration-300 font-mono select-none ${
        scrolled
          ? "py-3 px-6 md:px-12 bg-[#070707]/92 backdrop-blur-md border-b border-[#232220]"
          : "py-5 px-6 md:px-12 bg-transparent"
      }`}
    >
      <div className="max-w-[1500px] mx-auto flex justify-between items-center">
        
        {/* Left: Diallo-style Text Brand & Stencil Role */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="group flex flex-col text-left"
          title="Z Andrie – Creative Developer"
        >
          <span className="text-[20px] md:text-[22px] font-bold tracking-[1.5px] uppercase text-[#e7e5df] font-stencil group-hover:text-[var(--color-primary)] transition-colors duration-200">
            Z ANDRIE
          </span>
          <span className="text-[10px] md:text-[11px] tracking-[2px] uppercase text-[#a8a59d] -mt-1 font-mono">
            Creative Developer
          </span>
        </Link>

        {/* Center / Right: Nav links */}
        <ul
          className={`flex gap-6 lg:gap-8 list-none md:flex md:flex-row md:static md:w-auto md:bg-transparent md:p-0 md:shadow-none
            ${mobileMenuOpen ? "absolute top-full left-0 right-0 bg-[#070707]/98 flex-col p-8 border-b border-[#232220]" : "hidden"}
          `}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group relative text-[11px] md:text-[12px] tracking-[2px] uppercase font-mono transition-colors duration-200 hover:text-[var(--color-primary)] ${
                    isActive ? "text-[var(--color-primary)] font-semibold" : "text-[#e7e5df]/90"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right HUD Controls (Diallo style: Sound toggle, UV, Menu toggle) */}
        <div className="flex items-center gap-4 text-[11px] font-mono tracking-[1.5px] uppercase text-[#a8a59d]">
          
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundActive(!soundActive)}
            className="hidden sm:flex items-center gap-1.5 hover:text-[#e7e5df] transition-colors cursor-pointer"
            title="Toggle Ambient Audio"
          >
            <span className="flex items-end gap-[2px] h-3 w-3" aria-hidden="true">
              <span className={`w-[2px] bg-[#d36b54] ${soundActive ? "h-2.5 animate-pulse" : "h-1"}`}></span>
              <span className={`w-[2px] bg-[#d36b54] ${soundActive ? "h-3 animate-pulse" : "h-1"}`}></span>
              <span className={`w-[2px] bg-[#d36b54] ${soundActive ? "h-1.5 animate-pulse" : "h-1"}`}></span>
            </span>
            <span>Sound {soundActive ? "on" : "off"}</span>
          </button>

          {/* UV Mode Toggle */}
          <button
            type="button"
            onClick={() => setUvActive(!uvActive)}
            className={`px-2 py-0.5 border text-[10px] tracking-[1px] rounded-[2px] transition-colors cursor-pointer ${
              uvActive ? "border-[#9333ea] text-[#c084fc] bg-[#581c87]/30" : "border-[#e7e5df]/20 text-[#a8a59d] hover:border-[#e7e5df]"
            }`}
            title="Toggle Blacklight / UV inspection"
          >
            UV
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="md:hidden flex flex-col gap-[5px] p-1.5 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`w-5 h-[2px] bg-[#e7e5df] transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`}></span>
            <span className={`w-5 h-[2px] bg-[#e7e5df] transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`w-5 h-[2px] bg-[#e7e5df] transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}></span>
          </button>

        </div>

      </div>
    </nav>
  );
}
