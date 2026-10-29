"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";

function LoginCard() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGitHubLogin = async () => {
    setLoading(true);
    await signIn("github", { callbackUrl: "/admin" });
  };

  return (
    <div className="w-full max-w-md bg-[#0e0e11]/95 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative z-10 transition-all">
      {/* HUD Header Status */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-ping" />
          <span className="font-mono text-[10px] uppercase tracking-[3px] text-gray-400">
            SYSTEM // CLEARANCE_GATE
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
          GITHUB_OAUTH
        </span>
      </div>

      <div className="text-center mb-8">
        <h1 className="font-stencil text-3xl md:text-4xl text-white uppercase tracking-wider mb-3">
          ADMIN <span className="text-[var(--color-primary)]">ACCESS</span>
        </h1>
        <p className="text-gray-400 text-[12px] font-mono leading-relaxed tracking-wide">
          Sign in directly with your authorized GitHub account to manage portfolio projects, certifications, and expertise records.
        </p>
      </div>

      {/* Error Notices */}
      {error === "Configuration" && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[12px] font-mono flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-amber-300 font-bold block mb-1">GitHub OAuth Not Configured:</strong>
            Missing <code className="bg-black/40 px-1 py-0.5 rounded text-amber-100">GITHUB_ID</code> and <code className="bg-black/40 px-1 py-0.5 rounded text-amber-100">GITHUB_SECRET</code> in your <code className="bg-black/40 px-1 py-0.5 rounded text-amber-100">.env.local</code>.
          </div>
        </div>
      )}

      {error === "AccessDenied" && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-[12px] font-mono flex items-start gap-3">
          <ShieldAlert size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-red-300 font-bold block mb-1">Access Restricted:</strong>
            Your GitHub account is not authorized. Clearance is restricted strictly to Z Andrie (<code className="text-red-200">zandriebarraba.1305@gmail.com</code>).
          </div>
        </div>
      )}

      {/* GitHub Direct Sign-In Button */}
      <button
        type="button"
        onClick={handleGitHubLogin}
        disabled={loading}
        className="group w-full flex items-center justify-center gap-3.5 bg-white hover:bg-gray-100 text-[#0e0e11] font-mono text-[11px] font-bold uppercase tracking-[2px] py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:scale-110 transition-transform duration-300"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
        <span className="mt-[1px]">
          {loading ? "CONNECTING TO GITHUB..." : "CONTINUE WITH GITHUB"}
        </span>
      </button>

      {/* Security Clearance Footer */}
      <div className="mt-8 pt-4 border-t border-white/5 text-center flex flex-col items-center gap-1.5">
        <span className="text-[9px] font-mono uppercase tracking-[2px] text-gray-400">
          AUTHORIZED PERSONNEL ONLY • VERIFIED GITHUB ID
        </span>
        <span className="text-[8px] font-mono text-gray-400">
          CLEARANCE: zandriebarraba.1305@gmail.com
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#070708] px-4 relative overflow-hidden text-gray-200">
      {/* Return to Portfolio Navigation */}
      <Link
        href="/"
        className="absolute top-8 left-6 md:left-10 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[2px] text-gray-400 hover:text-[var(--color-primary)] transition-colors z-20 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Stage Select
      </Link>

      {/* Ambient Lighting */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)]/5 blur-[130px] pointer-events-none" />

      {/* Scanline Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "100% 4px",
        }}
      />

      <Suspense
        fallback={
          <div className="w-full max-w-md p-10 bg-[#0e0e11] rounded-2xl border border-white/10 text-center font-mono text-[12px] text-gray-400">
            CONNECTING CLEARANCE GATE...
          </div>
        }
      >
        <LoginCard />
      </Suspense>
    </div>
  );
}
