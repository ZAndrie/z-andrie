"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToTarget } from "@/lib/smoothScroll";

interface NavLink {
  id: string;
  num: string;
  name: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { id: "works", num: "01", name: "Works", href: "/#works" },
  { id: "about", num: "02", name: "About", href: "/#about" },
  { id: "expertise", num: "03", name: "Expertise", href: "/#expertise" },
  { id: "certificates", num: "04", name: "Credentials", href: "/#certificates" },
  { id: "blog", num: "05", name: "Devlogs", href: "/#blog" },
  { id: "contact", num: "06", name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [localTime, setLocalTime] = useState("");
  const pathname = usePathname();

  // Scroll listener for sticky compact navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update Philippine local time clock (GMT+8)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(now);
        setLocalTime(formatted);
      } catch {}
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Section Observer for active link highlight
  useEffect(() => {
    const sections = ["home", "about", "works", "expertise", "certificates", "blog", "contact"];
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "-25% 0px -65% 0px",
    });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Smooth navigation handler
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink | { id: string; href: string }) => {
      e.preventDefault();
      setMenuOpen(false);
      document.body.style.overflow = "";

      if (pathname === "/" || pathname === "") {
        if (link.id === "home") {
          scrollToTarget(0, { duration: 0.7 });
          history.pushState(null, "", "/");
        } else {
          const el = document.getElementById(link.id);
          if (el) {
            scrollToTarget(el, { duration: 0.7 });
            history.pushState(null, "", link.href);
          }
        }
      } else {
        window.location.href = link.href;
      }
    },
    [pathname]
  );

  // Hide public navbar on admin and login routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <>
      {/* ── 1. SLEEK FLOATING GLASSMORPHISM NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 w-full z-[1000] transition-all duration-300 select-none ${
          scrolled ? "py-3 px-4 md:px-8" : "py-5 px-6 md:px-12"
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          
          {/* Brand Logo */}
          <Link
            href="/#home"
            onClick={(e) => handleNavClick(e, { id: "home", href: "/#home" })}
            className="group flex items-center gap-3 cursor-pointer"
            title="Z Andrie – Creative Technologist"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d36b54] to-[#f4ddb8] flex items-center justify-center text-[#0a0a0c] font-heading font-black text-xs shadow-[0_0_15px_rgba(211,107,84,0.35)] group-hover:scale-105 transition-transform">
              Z
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] md:text-[15px] font-heading font-bold tracking-tight text-[#ffffff] group-hover:text-[#d36b54] transition-colors leading-none">
                Z ANDRIE
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#9ca3af] uppercase mt-0.5">
                Creative Dev
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Floating Glass Pill) */}
          <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-[#0a0a0d]/75 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] font-mono text-[11px] tracking-wider uppercase">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`px-4 py-2 rounded-full transition-all duration-200 relative ${
                    isActive
                      ? "text-[#ffffff] bg-white/[0.1] font-semibold shadow-sm"
                      : "text-[#9ca3af] hover:text-[#ffffff] hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className={`text-[9px] ${isActive ? "text-[#d36b54]" : "text-[#666]"}`}>
                      {link.num}
                    </span>
                    <span>{link.name}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Deck: Status Pill & Contact CTA */}
          <div className="flex items-center gap-3 font-mono text-[11px]">
            {/* Live Availability Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#a8a59d]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#d1d5db]">
                Available
              </span>
            </div>

            {/* Let's Talk CTA */}
            <Link
              href="/#contact"
              onClick={(e) => handleNavClick(e, { id: "contact", href: "/#contact" })}
              className="px-4 py-2 rounded-full bg-[#d36b54] hover:bg-[#b5543f] text-[#ffffff] font-semibold text-[11px] tracking-wider uppercase transition-all duration-200 shadow-[0_0_20px_rgba(211,107,84,0.3)] hover:shadow-[0_0_25px_rgba(211,107,84,0.5)] cursor-pointer flex items-center gap-1.5"
            >
              <span>Let&apos;s Talk</span>
              <span>↗</span>
            </Link>

            {/* Mobile / Tablet Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-full bg-[#0e0e12]/80 border border-white/[0.1] text-white hover:border-[#d36b54] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <div className="w-4 h-4 flex flex-col justify-center gap-1">
                <span
                  className={`h-0.5 bg-current transition-all duration-300 ${
                    menuOpen ? "rotate-45 translate-y-1 w-4" : "w-4"
                  }`}
                />
                <span
                  className={`h-0.5 bg-current transition-all duration-300 ${
                    menuOpen ? "opacity-0" : "w-3"
                  }`}
                />
                <span
                  className={`h-0.5 bg-current transition-all duration-300 ${
                    menuOpen ? "-rotate-45 -translate-y-1 w-4" : "w-4"
                  }`}
                />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* ── 2. SLEEK MODERN OVERLAY DRAWER (MOBILE & COMPACT) ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigation"
        className={`fixed inset-0 z-[99999] bg-[#070709]/95 backdrop-blur-2xl transition-all duration-300 ease-out flex flex-col justify-between p-6 md:p-12 ${
          menuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        {/* Top Header in Drawer */}
        <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#d36b54] flex items-center justify-center text-black font-heading font-bold text-xs">
              Z
            </div>
            <span className="font-heading font-bold text-base text-white tracking-tight">
              NAVIGATION
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="px-3.5 py-1.5 rounded-full border border-white/[0.1] text-gray-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close ✕
          </button>
        </div>

        {/* Center: Large Clean Typography Links */}
        <div className="w-full max-w-[1200px] mx-auto py-8 flex flex-col gap-4 font-heading">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="group flex items-baseline justify-between py-2 border-b border-white/[0.05] hover:border-[#d36b54] transition-colors"
            >
              <span className="text-[32px] sm:text-[44px] md:text-[56px] font-bold uppercase text-gray-300 group-hover:text-white group-hover:translate-x-2 transition-all">
                {link.name}
              </span>
              <span className="font-mono text-xs text-[#d36b54] opacity-80 group-hover:opacity-100">
                {link.num} ↗
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom Drawer Intel & Contact */}
        <div className="w-full max-w-[1200px] mx-auto border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-[11px] text-gray-400">
          <div className="flex flex-col gap-1">
            <span className="text-white font-semibold">LOCATION</span>
            <span>Philippines • {localTime || "GMT+8"}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-white font-semibold">DIRECT INQUIRIES</span>
            <a
              href="mailto:zandriebarraba.1305@gmail.com"
              className="text-[#d36b54] hover:underline"
            >
              zandriebarraba.1305@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://github.com/ZAndrie"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/z-andrie-barraba-474428401/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
