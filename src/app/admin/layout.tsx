"use client";

import { signOut, SessionProvider } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  LogOut,
  Award,
  Briefcase,
  Terminal,
  ExternalLink,
  ShieldAlert,
  Radio,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    {
      href: "/admin",
      label: "COMMAND OVERVIEW",
      sector: "SEC-01",
      icon: <LayoutDashboard size={16} strokeWidth={2} />,
    },
    {
      href: "/admin/projects",
      label: "PROJECTS VAULT",
      sector: "SEC-02",
      icon: <FolderKanban size={16} strokeWidth={2} />,
    },
    {
      href: "/admin/expertise",
      label: "EXPERTISE TREE",
      sector: "SEC-03",
      icon: <Briefcase size={16} strokeWidth={2} />,
    },
    {
      href: "/admin/certificates",
      label: "CREDENTIALS ARCHIVE",
      sector: "SEC-04",
      icon: <Award size={16} strokeWidth={2} />,
    },
    {
      href: "/admin/blog",
      label: "DEVLOGS & FIELD NOTES",
      sector: "SEC-05",
      icon: <FileText size={16} strokeWidth={2} />,
    },
    {
      href: "/admin/messages",
      label: "COMMS & INBOX",
      sector: "SEC-06",
      icon: <MessageSquare size={16} strokeWidth={2} />,
    },
  ];

  return (
    <SessionProvider>
      <div className="flex min-h-screen w-full bg-[#070708] text-gray-200 antialiased font-sans selection:bg-[var(--color-primary)] selection:text-white relative">
        {/* Subtle Ambient HUD Grid */}
        <div
          className="fixed inset-0 pointer-events-none opacity-15 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ambient Warm Accent Glows */}
        <div className="fixed top-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[var(--color-primary)]/5 blur-[150px] pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] left-[10%] w-[35%] h-[35%] rounded-full bg-[var(--color-primary)]/5 blur-[150px] pointer-events-none z-0" />

        {/* Tactical Command Sidebar */}
        <aside className="w-64 shrink-0 bg-[#0c0c10]/95 backdrop-blur-md border-r border-white/10 flex flex-col justify-between sticky top-0 h-screen z-30 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
          <div>
            {/* Header / Brand Telemetry */}
            <div className="h-[80px] flex items-center justify-between px-6 border-b border-white/10">
              <Link href="/" className="flex flex-col group">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
                  <span className="font-stencil text-lg text-white tracking-wider group-hover:text-[var(--color-primary)] transition-colors">
                    Z ANDRIE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-[9px] uppercase tracking-[2px] text-gray-400">
                    ADMIN // COMMAND_DECK
                  </span>
                </div>
              </Link>

              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[8px] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SYNC
              </span>
            </div>

            {/* Tactical Navigation Deck */}
            <nav className="flex flex-col gap-1.5 p-3.5 mt-2">
              <div className="flex items-center justify-between px-3 py-1 mb-1">
                <span className="font-mono text-[9px] text-gray-500 uppercase tracking-[2px]">
                  SYSTEM_SECTORS
                </span>
                <span className="font-mono text-[9px] text-gray-600">v2.6</span>
              </div>

              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg font-mono transition-all duration-200 group relative ${
                      isActive
                        ? "bg-[var(--color-primary)]/15 text-white border border-[var(--color-primary)]/40 shadow-[inset_0_0_20px_rgba(230,62,21,0.15)]"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    {/* Active Accent Notch */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[var(--color-primary)] rounded-r" />
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`transition-colors ${
                          isActive
                            ? "text-[var(--color-primary)]"
                            : "text-gray-500 group-hover:text-white"
                        }`}
                      >
                        {link.icon}
                      </div>
                      <span className="text-[11px] font-bold tracking-[1.5px] uppercase">
                        {link.label}
                      </span>
                    </div>

                    <span
                      className={`text-[8px] font-mono tracking-widest ${
                        isActive
                          ? "text-[var(--color-primary)]"
                          : "text-gray-600 group-hover:text-gray-400"
                      }`}
                    >
                      {link.sector}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Deck */}
          <div className="p-4 border-t border-white/10 flex flex-col gap-2.5 bg-black/30">
            {/* View Live Portfolio Link */}
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 text-gray-400 hover:text-white text-[10px] font-mono uppercase tracking-[1.5px] transition-all"
            >
              <span className="flex items-center gap-2">
                <Radio size={13} className="text-[var(--color-primary)]" />
                Live Portfolio
              </span>
              <ExternalLink size={12} />
            </Link>

            {/* Sign Out Button */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-all duration-200 group font-mono text-[10px] font-bold uppercase tracking-[2px]"
            >
              <LogOut size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>TERMINATE_SESSION</span>
            </button>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 min-h-screen flex flex-col relative z-10 overflow-y-auto">
          {/* Top Bar Telemetry */}
          <header className="h-[60px] border-b border-white/10 px-8 flex items-center justify-between bg-[#0a0a0d]/70 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-3 font-mono text-[11px] text-gray-400 uppercase tracking-widest">
              <span className="text-[var(--color-primary)] font-bold">MISSION_CONTROL</span>
              <span>//</span>
              <span className="text-gray-200">
                {pathname.replace("/admin", "").replace("/", "").toUpperCase() || "OVERVIEW"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-gray-300">
                <span className="text-gray-500">OPERATOR:</span>
                <span className="text-[var(--color-primary)] font-bold">Z ANDRIE</span>
              </div>
            </div>
          </header>

          <div className="w-full max-w-7xl mx-auto p-6 md:p-10">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
