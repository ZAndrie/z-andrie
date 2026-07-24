"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide the public navbar on admin and login routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "WORKS", href: "/works" },
    { name: "EXPERTISE", href: "/expertise" },
    { name: "CERTIFICATES", href: "/certificates" },
    { name: "BLOG", href: "/blog" },
    { name: "TESTIMONIALS", href: "/testimonials" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <nav
      className={`flex justify-between items-center fixed top-0 w-full z-[1000] transition-all duration-300 font-sans border-b border-[var(--color-border)] ${
        scrolled ? "py-[15px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)]/95 backdrop-blur-sm" : "py-[20px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)]"
      }`}
    >
      <div className="relative flex items-center gap-[10px]">
        <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block relative h-[25px] w-[130px] md:h-[30px] md:w-[150px]" title="Admin Access">
          <Image
            src="/logo-primary.jpg"
            alt="Z Andrie Logo"
            fill
            className="object-contain object-left mix-blend-multiply"
            priority
          />
        </Link>
      </div>

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
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.name}>
              <Link
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`relative font-semibold uppercase text-[11px] md:text-[12px] tracking-[1.5px] transition-all duration-300 hover:text-[var(--color-primary)] ${
                  isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-dark)]"
                }`}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="hidden md:flex items-center gap-[15px]">
        <Link
          href="/contact"
          className="text-[12px] font-bold uppercase tracking-[1.5px] text-[var(--color-text-dark)] transition-all duration-300 hover:text-[var(--color-primary)] flex items-center gap-[10px]"
        >
          AVAILABLE FOR FREELANCE 
          <span className="text-[var(--color-primary)] text-lg leading-none font-light">→</span>
        </Link>
      </div>
    </nav>
  );
}
