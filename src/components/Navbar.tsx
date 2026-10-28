"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToTarget } from "@/lib/smoothScroll";

interface MenuItem {
  id: string;
  num: string;
  name: string;
  tag: string;
  href: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);
  const [uvActive, setUvActive] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { id: "home", num: "01", name: "HOME", tag: "Start here", href: "/#home" },
    { id: "about", num: "02", name: "ABOUT", tag: "Philosophy & Bio", href: "/#about" },
    { id: "works", num: "03", name: "WORKS", tag: "Selected Projects", href: "/#works" },
    { id: "expertise", num: "04", name: "EXPERTISE", tag: "Skills & Tech Stack", href: "/#expertise" },
    { id: "certificates", num: "05", name: "CERTIFICATES", tag: "Credentials & Awards", href: "/#certificates" },
    { id: "blog", num: "06", name: "BLOG", tag: "Articles & Insights", href: "/#blog" },
    { id: "contact", num: "07", name: "CONTACT", tag: "Get in touch", href: "/#contact" },
  ];

  // Scroll detection & active section spy
  useEffect(() => {
    const sectionIds = ["home", "about", "works", "skills", "expertise", "certificates", "blog", "contact"];

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const scrollPos = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(id === "skills" ? "expertise" : id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut listener: ESC or M toggles menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "Escape") {
        setMenuOpen((prev) => !prev);
      } else if (e.key === "m" || e.key === "M") {
        setMenuOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock background scroll when fullscreen menu is open
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

  // Intercept anchor clicks for smooth navigation and close menu
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, link: MenuItem) => {
      setMenuOpen(false);

      if (pathname === "/") {
        e.preventDefault();
        if (link.id === "home") {
          scrollToTarget(0, { duration: 1.2 });
          history.pushState(null, "", "/");
        } else {
          const el = document.getElementById(link.id);
          if (el) {
            scrollToTarget(el, { duration: 1.2 });
            history.pushState(null, "", link.href);
          }
        }
      }
    },
    [pathname]
  );

  // Hide the public navbar on admin and login routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <>
      {/* ── 1. MINIMAL TOP NAVIGATION BAR (Diallo style) ── */}
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-[1000] transition-all duration-300 font-mono select-none ${
          scrolled
            ? "py-3 px-6 md:px-12 bg-[#070707]/90 backdrop-blur-md border-b border-[#232220]"
            : "py-5 px-6 md:px-12 bg-transparent"
        }`}
      >
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          {/* Left: Text Brand & Stencil Role */}
          <Link
            href="/#home"
            onClick={(e) => handleNavClick(e, menuItems[0])}
            className="group flex flex-col text-left cursor-pointer"
            title="Z Andrie – Creative Developer"
          >
            <span className="text-[20px] md:text-[22px] font-bold tracking-[1.5px] uppercase text-[#e7e5df] font-stencil group-hover:text-[var(--color-primary)] transition-colors duration-200">
              Z ANDRIE
            </span>
            <span className="text-[10px] md:text-[11px] tracking-[2px] uppercase text-[#a8a59d] -mt-1 font-mono">
              Creative Developer
            </span>
          </Link>

          {/* Right Controls: Sound Toggle, UV Mode, and Game Menu Button */}
          <div className="flex items-center gap-4 sm:gap-6 text-[11px] font-mono tracking-[1.5px] uppercase text-[#a8a59d]">
            {/* Sound Toggle */}
            <button
              type="button"
              data-magnetic
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
              data-magnetic
              onClick={() => setUvActive(!uvActive)}
              className={`px-2 py-0.5 border text-[10px] tracking-[1px] rounded-[2px] transition-colors cursor-pointer ${
                uvActive
                  ? "border-[#9333ea] text-[#c084fc] bg-[#581c87]/30"
                  : "border-[#e7e5df]/20 text-[#a8a59d] hover:border-[#e7e5df]"
              }`}
              title="Toggle Blacklight / UV inspection"
            >
              UV
            </button>

            {/* Diallo Game Menu Toggle Button */}
            <button
              type="button"
              data-magnetic
              onClick={() => setMenuOpen(!menuOpen)}
              className="group flex items-center gap-2 px-3 py-1.5 border border-[#3e3b36] hover:border-[var(--color-primary)] bg-[#141210]/60 hover:bg-[#1a1714] text-[#e7e5df] hover:text-[var(--color-primary)] rounded-[2px] transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              aria-label="Toggle game navigation menu"
              aria-expanded={menuOpen}
            >
              <div className="flex flex-col gap-[3.5px] w-4 justify-center" aria-hidden="true">
                <span
                  className={`h-[1.5px] bg-current transition-all duration-300 ${
                    menuOpen ? "rotate-45 translate-y-[5px]" : "w-4"
                  }`}
                />
                <span
                  className={`h-[1.5px] bg-current transition-all duration-300 ${
                    menuOpen ? "opacity-0" : "w-3 group-hover:w-4"
                  }`}
                />
                <span
                  className={`h-[1.5px] bg-current transition-all duration-300 ${
                    menuOpen ? "-rotate-45 -translate-y-[5px]" : "w-4"
                  }`}
                />
              </div>
              <span className="font-bold tracking-[2px] text-[11px]">
                {menuOpen ? "CLOSE" : "MENU"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── 2. FULLSCREEN DIALLO-STYLE GAME PAUSE MENU OVERLAY ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Game Pause Menu"
        className={`fixed inset-0 w-screen h-screen z-[99999] bg-[#090807]/98 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto overflow-x-hidden font-mono select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        {/* Subtle CRT Scanline overlay texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"
          aria-hidden="true"
        />

        {/* ── MENU TOP HEADER ── */}
        <header className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 py-6 flex justify-between items-center border-b border-[#23201d]">
          <div className="flex items-center gap-3">
            <span className="text-[11px] md:text-[12px] tracking-[2.5px] uppercase text-[#a8a59d]">
              // GAME MENU
            </span>
            <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded border border-[#3e3b36] text-[#786c5f]">
              PAUSE
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="group flex items-center gap-2.5 text-[11px] md:text-[12px] tracking-[2px] uppercase text-[#e7e5df] hover:text-[var(--color-primary)] transition-colors cursor-pointer py-1"
          >
            <span>Close</span>
            <span className="px-1.5 py-0.5 border border-[#3e3b36] rounded text-[10px] bg-[#1a1815] text-[#a8a59d] group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)] transition-colors">
              ESC
            </span>
          </button>
        </header>

        {/* ── MENU ROWS (Full Width Stencil Typography) ── */}
        <main className="relative z-10 w-full max-w-[1600px] mx-auto flex-1 flex flex-col justify-center my-auto py-2">
          {menuItems.map((item) => {
            const isActive = pathname === "/" ? activeSection === item.id : pathname === item.href;
            const isHovered = hoveredItem === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="w-full border-b border-[#23201d]/75 first:border-t"
              >
                <Link
                  href={item.href}
                  prefetch={true}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`group w-full flex items-center justify-between px-6 md:px-12 py-3.5 sm:py-4 md:py-5 lg:py-6 transition-all duration-300 cursor-pointer ${
                    isHovered ? "bg-[#181512]/60" : "bg-transparent"
                  }`}
                >
                  {/* Left: Index + Big Stencil Title */}
                  <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
                    {/* Index Number & Retro Arrow */}
                    <div className="flex items-center gap-1.5 w-8 sm:w-12 text-left">
                      <span
                        className={`text-[12px] sm:text-[14px] md:text-[15px] font-mono transition-colors duration-200 ${
                          isActive || isHovered ? "text-[var(--color-primary)] font-bold" : "text-[#5e5850]"
                        }`}
                      >
                        {item.num}
                      </span>
                      <span
                        className={`text-[12px] text-[var(--color-primary)] transition-all duration-200 ${
                          isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                        }`}
                      >
                        ►
                      </span>
                    </div>

                    {/* Stencil Giant Title */}
                    <span
                      className={`font-stencil font-bold tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px] uppercase leading-none transition-all duration-300 ${
                        isActive
                          ? "text-[#f4ddb8] translate-x-2"
                          : isHovered
                          ? "text-[#f4ddb8] translate-x-3 scale-[1.01]"
                          : "text-[#524e47]"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Right: Monospace Contextual Tag */}
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-[11px] sm:text-[12px] md:text-[14px] tracking-[2px] uppercase font-mono transition-colors duration-200 ${
                        isHovered ? "text-[#f4ddb8]" : "text-[#665f54]"
                      }`}
                    >
                      {item.tag}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)] hidden sm:inline-block" />
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </main>

        {/* ── MENU FOOTER (Email, GitHub, LinkedIn) ── */}
        <footer className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-[#23201d] text-[11px] md:text-[12px] tracking-[1.5px] uppercase text-[#786c5f]">
          {/* Email */}
          <a
            href="mailto:zandriebarraba.1305@gmail.com"
            className="hover:text-[#f4ddb8] transition-colors cursor-pointer"
          >
            zandriebarraba.1305@gmail.com
          </a>

          {/* Center: GitHub */}
          <a
            href="https://github.com/ZAndrie"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#f4ddb8] transition-colors cursor-pointer"
          >
            GitHub
          </a>

          {/* Right: LinkedIn */}
          <a
            href="https://www.linkedin.com/in/z-andrie-barraba-474428401/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#f4ddb8] transition-colors cursor-pointer"
          >
            LinkedIn
          </a>
        </footer>
      </div>
    </>
  );
}
