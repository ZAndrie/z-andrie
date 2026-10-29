"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, KeyRound, AlertCircle, ShieldCheck, Terminal } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("zandriebarraba.1305@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    urlError === "Configuration"
      ? "GitHub OAuth is not configured yet. Please use direct Admin Credentials below."
      : urlError === "CredentialsSignin"
      ? "Invalid credentials. Please check your admin email and password."
      : ""
  );

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false,
        callbackUrl: "/admin",
      });

      if (res?.error) {
        setErrorMessage("Access denied. Please check your email and password.");
        setLoading(false);
      } else if (res?.ok) {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setErrorMessage("An unexpected authentication error occurred.");
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setGithubLoading(true);
    setErrorMessage("");
    try {
      await signIn("github", { callbackUrl: "/admin" });
    } catch {
      setErrorMessage("Could not connect to GitHub OAuth.");
      setGithubLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0e0e11]/90 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10">
      {/* HUD Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[var(--color-primary)]" />
          <span className="font-mono text-[10px] uppercase tracking-[3px] text-gray-400">
            SYSTEM // AUTH_DECK
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          GATE_ONLINE
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="font-stencil text-3xl md:text-4xl text-white uppercase tracking-wider mb-2">
          ADMIN <span className="text-[var(--color-primary)]">TERMINAL</span>
        </h1>
        <p className="text-gray-400 text-[12px] font-mono tracking-wide">
          Direct clearance required for mission control and repository synchronization.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[12px] font-mono flex items-start gap-2.5">
          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Direct Credentials Login */}
      <form onSubmit={handleCredentialsLogin} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-[2px] text-gray-400 mb-1.5">
            Admin Identity (Email)
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="zandriebarraba.1305@gmail.com"
              className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white font-mono text-[13px] placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-mono uppercase tracking-[2px] text-gray-400">
              Admin Passcode
            </label>
            <span className="text-[9px] font-mono text-gray-500">Default: admin123</span>
          </div>
          <div className="relative">
            <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter passcode"
              className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white font-mono text-[13px] placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[#e05330] text-white font-mono text-[11px] font-bold uppercase tracking-[2px] py-3 rounded-lg shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/40 transition-all duration-300 transform active:scale-[0.99] disabled:opacity-50"
        >
          <ShieldCheck size={16} />
          <span>{loading ? "AUTHENTICATING..." : "DEPLOY TO ADMIN PANEL"}</span>
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="border-t border-white/10 w-full" />
        <span className="bg-[#0e0e11] px-3 text-[10px] font-mono uppercase tracking-widest text-gray-500 absolute">
          OR
        </span>
      </div>

      {/* GitHub OAuth Button */}
      <button
        type="button"
        onClick={handleGitHubLogin}
        disabled={githubLoading}
        className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-200 font-mono text-[11px] font-semibold uppercase tracking-[2px] py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
        <span>{githubLoading ? "CONNECTING..." : "CONTINUE WITH GITHUB"}</span>
      </button>

      <div className="mt-6 pt-4 border-t border-white/5 text-center">
        <span className="text-[9px] font-mono uppercase tracking-[2px] text-gray-500">
          AUTHORIZED PERSONNEL ONLY • CLEARANCE LEVEL 04
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#070708] px-4 relative overflow-hidden text-gray-200">
      {/* Return Navigation */}
      <Link
        href="/"
        className="absolute top-8 left-6 md:left-10 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[2px] text-gray-400 hover:text-[var(--color-primary)] transition-colors z-20 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Stage Select
      </Link>

      {/* Atmospheric Background Ambience */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)]/5 blur-[130px] pointer-events-none" />

      {/* Subtle Scanline Overlay */}
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
            INITIALIZING SECURITY GATEWAY...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
