"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToTarget } from "@/lib/smoothScroll";

interface MenuItem {
  id: string;
  num: string;
  stage: string;
  name: string;
  tag: string;
  href: string;
  intel: string;
  objective: string;
  badge: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);
  const [uvActive, setUvActive] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      id: "home",
      num: "01",
      stage: "STAGE 01",
      name: "DEV ROOM",
      tag: "Spawn Point",
      href: "/#home",
      intel:
        "The creative isometric command chamber. Features real-time raycast spotlight tracking, glowing CRT terminal, and companion BOT-01.",
      objective: "Explore isometric workspace & dynamic cursor lighting",
      badge: "ACTIVE SPAWN",
    },
    {
      id: "about",
      num: "02",
      stage: "STAGE 02",
      name: "PHILOSOPHY",
      tag: "Craft & Ethos",
      href: "/#about",
      intel:
        "Design manifesto and developer ethos. Explores how spatial computing, intuitive interactions, and playful engineering shape digital spaces.",
      objective: "Inspect design principles & developer bio",
      badge: "CORE MANIFESTO",
    },
    {
      id: "works",
      num: "03",
      stage: "STAGE 03",
      name: "PRODUCTION",
      tag: "Shipped Works",
      href: "/#works",
      intel:
        "Curated production vault containing 18 deployed web applications, interactive 3D experiments, creative tools, and client deliverables.",
      objective: "Browse 18 case studies & live interactive demos",
      badge: "18 MISSIONS",
    },
    {
      id: "expertise",
      num: "04",
      stage: "STAGE 04",
      name: "SKILL TREE",
      tag: "Tech Stack",
      href: "/#expertise",
      intel:
        "Technical skill matrix covering Three.js/R3F, GLSL shaders, React 19, Next.js App Router, TypeScript, and full-stack architecture.",
      objective: "Analyze tech stack proficiency & frameworks",
      badge: "LVL 99 MASTERED",
    },
    {
      id: "certificates",
      num: "05",
      stage: "STAGE 05",
      name: "CREDENTIALS",
      tag: "Trophy Vault",
      href: "/#certificates",
      intel:
        "Verified academic honors, engineering diplomas, hackathon accolades, and industry-recognized development certifications.",
      objective: "Inspect verified credentials & award archive",
      badge: "VERIFIED HONORS",
    },
    {
      id: "blog",
      num: "06",
      stage: "STAGE 06",
      name: "DEVLOGS",
      tag: "Field Notes",
      href: "/#blog",
      intel:
        "In-depth architectural breakdowns, creative devlogs, 3D shader deep-dives, and performance optimization post-mortems.",
      objective: "Read technical writeups & engineering logs",
      badge: "PUBLIC ARCHIVE",
    },
    {
      id: "contact",
      num: "07",
      stage: "STAGE 07",
      name: "CO-OP LOBBY",
      tag: "Initiate Comms",
      href: "/#contact",
      intel:
        "Direct comms link for client inquiries, freelance collaborations, creative tech contracts, or technical advisory consultations.",
      objective: "Transmit project brief & start multiplayer co-op",
      badge: "LOBBY OPEN",
    },
  ];

  // Procedural Web Audio 8-bit sound effects
  const playMenuSound = useCallback(
    (type: "hover" | "select") => {
      if (!soundActive || typeof window === "undefined") return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === "hover") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(520, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.035);
          gain.gain.setValueAtTime(0.025, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
          osc.start();
          osc.stop(ctx.currentTime + 0.035);
        } else {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(587.33, ctx.currentTime);
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.06);
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        }
      } catch {
        // Blocked by browser autoplay policy
      }
    },
    [soundActive]
  );

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
            const mapped = id === "skills" ? "expertise" : id;
            setActiveSection(mapped);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync selected index with active section when opening menu
  useEffect(() => {
    if (menuOpen) {
      const idx = menuItems.findIndex((item) => item.id === activeSection);
      if (idx !== -1) setSelectedIndex(idx);
    }
  }, [menuOpen, activeSection]);

  // Global toggle listener: ESC or M key toggles menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Keyboard navigation inside game pause menu (Up / Down / Enter / Space)
  useEffect(() => {
    if (!menuOpen) return;

    const handleMenuKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % menuItems.length);
        playMenuSound("hover");
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
        playMenuSound("hover");
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const target = menuItems[selectedIndex];
        if (target) {
          playMenuSound("select");
          triggerNav(target);
        }
      }
    };

    window.addEventListener("keydown", handleMenuKeys);
    return () => window.removeEventListener("keydown", handleMenuKeys);
  }, [menuOpen, selectedIndex, menuItems, playMenuSound]);

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

  // Trigger smooth scroll navigation to stage and close menu
  const triggerNav = useCallback(
    (link: MenuItem) => {
      setMenuOpen(false);

      if (pathname === "/") {
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

  // Click handler wrapper
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, link: MenuItem) => {
      e.preventDefault();
      playMenuSound("select");
      triggerNav(link);
    },
    [triggerNav, playMenuSound]
  );

  // Hide public navbar on admin and login routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  const currentItem = menuItems[selectedIndex] || menuItems[0];

  return (
    <>
      {/* ── 1. MINIMAL TOP NAVIGATION BAR ── */}
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

          {/* Right Controls: Sound Toggle, UV Mode, and Game Pause Menu Button */}
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

            {/* Indie Game Pause Menu Toggle Button */}
            <button
              type="button"
              data-magnetic
              onClick={() => {
                playMenuSound(menuOpen ? "hover" : "select");
                setMenuOpen(!menuOpen);
              }}
              className={`group flex items-center gap-2.5 px-3 py-1.5 border rounded-[3px] transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.5)] ${
                menuOpen
                  ? "border-[var(--color-primary)] bg-[#1e1713] text-[#f4ddb8]"
                  : "border-[#3e3b36] hover:border-[var(--color-primary)] bg-[#141210]/70 hover:bg-[#1a1714] text-[#e7e5df]"
              }`}
              aria-label="Toggle game pause menu"
              aria-expanded={menuOpen}
            >
              <div className="flex flex-col gap-[3px] w-3.5 justify-center" aria-hidden="true">
                <span
                  className={`h-[1.5px] bg-current transition-all duration-300 ${
                    menuOpen ? "rotate-45 translate-y-[4.5px] w-3.5" : "w-3.5"
                  }`}
                />
                <span
                  className={`h-[1.5px] bg-current transition-all duration-300 ${
                    menuOpen ? "opacity-0" : "w-2.5 group-hover:w-3.5"
                  }`}
                />
                <span
                  className={`h-[1.5px] bg-current transition-all duration-300 ${
                    menuOpen ? "-rotate-45 -translate-y-[4.5px] w-3.5" : "w-3.5"
                  }`}
                />
              </div>
              <span className="font-bold tracking-[2px] text-[11px]">
                {menuOpen ? "RESUME" : "PAUSE MENU"}
              </span>
              <span className="hidden md:inline-block text-[9px] px-1 py-0.2 rounded border border-[#3e3b36] text-[#786c5f] group-hover:border-[var(--color-primary)] group-hover:text-[#f4ddb8]">
                ESC
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── 2. ORIGINAL FULLSCREEN INDIE GAMER PAUSE TERMINAL ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Indie Game Pause Menu"
        className={`fixed inset-0 w-screen h-screen z-[99999] bg-[#090807]/94 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto overflow-x-hidden font-mono select-none transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-3"
        }`}
      >
        {/* Subtle CRT Scanline overlay texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"
          aria-hidden="true"
        />

        {/* ── TOP HUD HEADER BAR ── */}
        <header className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 py-5 flex justify-between items-center border-b border-[#23201d]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-[11px] md:text-[12px] tracking-[2px] uppercase text-[#f4ddb8] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
              GAME PAUSED
            </span>
            <span className="text-[#3e3b36]">|</span>
            <span className="hidden sm:inline-block text-[11px] tracking-[1.5px] uppercase text-[#786c5f]">
              MISSION STAGE SELECTOR // V2.6
            </span>
          </div>

          {/* Right: Controls & Resume Button */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 text-[10px] text-[#786c5f] tracking-[1.5px]">
              <span>
                <kbd className="px-1 py-0.5 rounded border border-[#3e3b36] bg-[#141210] text-[#a8a59d]">W/S</kbd> or{" "}
                <kbd className="px-1 py-0.5 rounded border border-[#3e3b36] bg-[#141210] text-[#a8a59d]">↑/↓</kbd> NAVIGATE
              </span>
              <span>
                <kbd className="px-1 py-0.5 rounded border border-[#3e3b36] bg-[#141210] text-[#a8a59d]">ENTER</kbd> DEPLOY
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                playMenuSound("select");
                setMenuOpen(false);
              }}
              className="group flex items-center gap-2 text-[11px] md:text-[12px] tracking-[2px] uppercase text-[#e7e5df] hover:text-[var(--color-primary)] transition-colors cursor-pointer px-3 py-1 border border-[#3e3b36] hover:border-[var(--color-primary)] rounded bg-[#161311]"
            >
              <span>RESUME GAME</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#221c17] text-[#f4ddb8] border border-[#3e3b36]">
                ESC
              </span>
            </button>
          </div>
        </header>

        {/* ── MAIN 2-COLUMN SPLIT: INTEL DOSSIER & STAGE SELECT ── */}
        <main className="relative z-10 w-full max-w-[1600px] mx-auto flex-1 flex flex-col lg:flex-row gap-8 px-6 md:px-12 py-6 my-auto items-stretch">
          
          {/* ── LEFT COLUMN: PLAYER CARD & LIVE MISSION INTEL (Unique original touch!) ── */}
          <aside className="hidden lg:flex lg:w-5/12 flex-col justify-between gap-5 p-6 rounded-[4px] border border-[#23201d] bg-[#110e0c]/80 backdrop-blur-md relative overflow-hidden">
            {/* Corner Decorative Tech Marks */}
            <div className="absolute top-2 left-2 text-[#3e3b36] text-[10px]" aria-hidden="true">+</div>
            <div className="absolute top-2 right-2 text-[#3e3b36] text-[10px]" aria-hidden="true">+</div>
            <div className="absolute bottom-2 left-2 text-[#3e3b36] text-[10px]" aria-hidden="true">+</div>
            <div className="absolute bottom-2 right-2 text-[#3e3b36] text-[10px]" aria-hidden="true">+</div>

            {/* Player / Bot Status Header */}
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-[#23201d]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded border border-[#3e3b36] bg-[#1a1714] flex items-center justify-center text-sm font-mono text-[#f4ddb8]">
                    [•_•]
                  </div>
                  <div>
                    <h2 className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#e7e5df]">
                      Z ANDRIE
                    </h2>
                    <p className="text-[9px] tracking-[1.5px] uppercase text-[#786c5f]">
                      LVL 26 • CREATIVE DEV
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#22c55e]/30 bg-[#22c55e]/10 text-[9px] text-[#4ade80]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                  BOT-01 ONLINE
                </div>
              </div>

              {/* Dynamic Mission Intel Block */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-[10px] tracking-[2px] uppercase">
                  <span className="text-[#d36b54] font-bold">
                    &gt;&gt; STAGE INTEL
                  </span>
                  <span className="px-1.5 py-0.5 rounded border border-[#3e3b36] text-[#f4ddb8] bg-[#1c1814] text-[9px]">
                    {currentItem.badge}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#786c5f] tracking-[1.5px] uppercase block">
                    {currentItem.stage}
                  </span>
                  <h3 className="text-2xl font-stencil font-bold tracking-[1px] uppercase text-[#f4ddb8] leading-tight">
                    {currentItem.name}
                  </h3>
                </div>

                <p className="text-[12px] text-[#a8a59d] leading-relaxed font-mono border-l-2 border-[#d36b54] pl-3 py-1">
                  {currentItem.intel}
                </p>

                <div className="p-3 rounded border border-[#26221d] bg-[#14110e]/90 space-y-1.5">
                  <span className="text-[9px] tracking-[1.5px] text-[#786c5f] uppercase block font-bold">
                    MISSION OBJECTIVE
                  </span>
                  <p className="text-[11px] text-[#e7e5df] font-mono">
                    {currentItem.objective}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Deploy Button */}
            <div className="pt-4 border-t border-[#23201d] flex items-center justify-between">
              <span className="text-[10px] tracking-[1.5px] text-[#786c5f] uppercase">
                READY FOR WARP
              </span>
              <button
                type="button"
                onClick={() => {
                  playMenuSound("select");
                  triggerNav(currentItem);
                }}
                className="px-4 py-2 rounded-[2px] bg-[#d36b54] hover:bg-[#e0755e] text-[#120f0c] text-[11px] font-bold tracking-[2px] uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-[0_0_16px_rgba(211,107,84,0.3)]"
              >
                <span>DEPLOY TO STAGE</span>
                <span>►</span>
              </button>
            </div>
          </aside>

          {/* ── RIGHT COLUMN: TACTICAL STAGE SELECTION DECK ── */}
          <section className="w-full lg:w-7/12 flex flex-col justify-center space-y-2">
            <div className="flex justify-between items-center px-2 pb-1 text-[10px] tracking-[2px] uppercase text-[#786c5f]">
              <span>SELECT STAGE DESTINATION</span>
              <span>7 STAGES AVAILABLE</span>
            </div>

            {menuItems.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              const isActiveSection = activeSection === item.id;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    setSelectedIndex(idx);
                    playMenuSound("hover");
                  }}
                  className="w-full"
                >
                  <Link
                    href={item.href}
                    prefetch={true}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`group w-full flex items-center justify-between p-3.5 sm:p-4 md:p-4.5 rounded-[3px] border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-[#d36b54] bg-[#1a1512] shadow-[0_0_20px_rgba(211,107,84,0.18)] translate-x-2"
                        : "border-[#23201d] hover:border-[#3e3b36] bg-[#110e0c]/60"
                    }`}
                  >
                    {/* Left: Stage number + Title */}
                    <div className="flex items-center gap-3 sm:gap-5">
                      {/* Selection cursor indicator */}
                      <span
                        className={`text-[12px] font-mono transition-all duration-200 w-5 text-center ${
                          isSelected ? "text-[#d36b54] font-bold" : "text-[#5e5850]"
                        }`}
                      >
                        {isSelected ? "►" : item.num}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] tracking-[1.5px] uppercase font-mono ${
                              isSelected ? "text-[#d36b54]" : "text-[#665f54]"
                            }`}
                          >
                            {item.stage}
                          </span>
                          {isActiveSection && (
                            <span className="text-[8px] px-1 py-0.2 rounded bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/40 font-bold">
                              CURRENT
                            </span>
                          )}
                        </div>

                        <span
                          className={`font-stencil font-bold tracking-[1px] uppercase text-2xl sm:text-3xl md:text-4xl transition-colors duration-200 leading-none ${
                            isSelected ? "text-[#f4ddb8]" : "text-[#68635a]"
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                    </div>

                    {/* Right: Stage Badge Chip & Enter hint */}
                    <div className="flex items-center gap-3 text-right">
                      <span
                        className={`hidden sm:inline-block text-[10px] md:text-[11px] tracking-[1.5px] uppercase font-mono px-2 py-0.5 rounded border transition-colors ${
                          isSelected
                            ? "border-[#d36b54]/50 bg-[#261814] text-[#f4ddb8]"
                            : "border-[#2b2723] text-[#5e5850]"
                        }`}
                      >
                        {item.tag}
                      </span>

                      <span
                        className={`text-[12px] text-[#d36b54] transition-opacity duration-200 ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        ↵
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </section>
        </main>

        {/* ── BOTTOM HUD FOOTER BAR ── */}
        <footer className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-[#23201d] text-[10px] md:text-[11px] tracking-[1.5px] uppercase text-[#786c5f]">
          <div className="flex items-center gap-4">
            <span className="text-[#a8a59d]">CONNECT:</span>
            <a
              href="mailto:zandriebarraba.1305@gmail.com"
              className="hover:text-[#f4ddb8] transition-colors cursor-pointer"
            >
              zandriebarraba.1305@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/ZAndrie"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f4ddb8] transition-colors cursor-pointer"
            >
              [GITHUB]
            </a>

            <a
              href="https://www.linkedin.com/in/z-andrie-barraba-474428401/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f4ddb8] transition-colors cursor-pointer"
            >
              [LINKEDIN]
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
