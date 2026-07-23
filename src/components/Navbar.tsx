"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "WORKS", href: "#portfolio" },
    { name: "EXPERTISE", href: "#expertise" },
    { name: "TESTIMONIALS", href: "#testimonials" },
    { name: "CONTACT", href: "#contact" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      className={`flex justify-between items-center fixed top-0 w-full z-[1000] transition-all duration-300 font-sans border-b border-[var(--color-border)] ${
        scrolled ? "py-[15px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)]/95 backdrop-blur-sm" : "py-[20px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)]"
      }`}
    >
      <a href="#home" onClick={(e) => handleLinkClick(e, "#home")} className="flex items-center gap-[10px]">
        <div className="relative h-[25px] w-[130px] md:h-[30px] md:w-[150px]">
          <Image
            src="/logo-primary.jpg"
            alt="Z Andrie Logo"
            fill
            className="object-contain object-left mix-blend-multiply"
            priority
          />
        </div>
      </a>

      <div
        className="md:hidden flex flex-col gap-[4px] cursor-pointer"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="w-[20px] h-[2px] bg-[var(--color-text-dark)] transition-all duration-300"></span>
        <span className="w-[20px] h-[2px] bg-[var(--color-text-dark)] transition-all duration-300"></span>
      </div>

      <ul
        className={`flex gap-[30px] list-none md:flex md:flex-row md:static md:w-auto md:bg-transparent md:p-0 md:shadow-none
          ${mobileMenuOpen ? "absolute top-full left-0 right-0 bg-[var(--color-light-bg)] flex-col p-8 border-b border-[var(--color-border)]" : "hidden"}
        `}
      >
        {navLinks.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="relative text-[var(--color-text-dark)] font-semibold uppercase text-[11px] md:text-[12px] tracking-[1.5px] transition-all duration-300 hover:text-[var(--color-primary)]"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex items-center gap-[15px]">
        <a
          href="#contact"
          onClick={(e) => handleLinkClick(e, "#contact")}
          className="text-[12px] font-bold uppercase tracking-[1.5px] text-[var(--color-text-dark)] transition-all duration-300 hover:text-[var(--color-primary)] flex items-center gap-[10px]"
        >
          AVAILABLE FOR FREELANCE 
          <span className="text-[var(--color-primary)] text-lg leading-none font-light">→</span>
        </a>
      </div>
    </nav>
  );
}
