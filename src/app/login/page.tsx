"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGitHubLogin = async () => {
    setLoading(true);
    await signIn("github", { callbackUrl: "/admin" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-light-bg)] px-4 relative overflow-hidden">
      <Link
        href="/"
        className="absolute top-8 left-6 md:left-10 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-[var(--color-primary)] transition-colors z-20 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
      
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/60 backdrop-blur-md p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 text-center relative z-10 transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
        
        <div className="mb-8">
          <h2 className="text-4xl font-serif text-[var(--color-text-dark)] uppercase tracking-tight">
            Admin <span className="text-[var(--color-primary)] font-light italic">Access</span>
          </h2>
          <div className="h-[1px] w-12 bg-[var(--color-primary)] mx-auto mt-4 opacity-50"></div>
        </div>

        <p className="text-[var(--color-text-light)] text-[13px] mb-10 leading-relaxed font-light">
          Sign in with your authorized GitHub account to manage your portfolio, projects, and updates.
        </p>
        
        <button
          onClick={handleGitHubLogin}
          disabled={loading}
          className="group w-full flex items-center justify-center gap-4 bg-[var(--color-text-dark)] text-white font-semibold text-[11px] uppercase tracking-[2px] py-[18px] hover:bg-black transition-all duration-300 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:scale-110 transition-transform duration-300"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          <span className="mt-[2px]">{loading ? "Authenticating..." : "Continue with GitHub"}</span>
        </button>

        <div className="mt-8 text-[10px] text-[var(--color-text-light)] uppercase tracking-widest opacity-60">
          Secure Area • Authorized Personnel Only
        </div>
      </div>
    </div>
  );
}
