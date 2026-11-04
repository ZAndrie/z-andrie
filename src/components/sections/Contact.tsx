"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useGSAP(() => {
    // 1. Kinetic Headline & Staggered Reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        once: true,
      },
    });

    tl.from(".gsap-contact-eyebrow", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out",
    })
    .from(".gsap-contact-h1", {
      x: -50,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out",
    }, "-=0.3")
    .from(".gsap-contact-h2", {
      x: 40,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out",
    }, "-=0.6")
    .from(".gsap-contact-item", {
      y: 25,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.4")
    .from(".gsap-contact-form", {
      x: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.6");

    // 2. Magnetic Physics on Submit Button
    const btn = submitBtnRef.current;
    if (btn && window.matchMedia("(hover: hover)").matches) {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power2.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power2.out" });

      const onMouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * 0.25);
        yTo(relY * 0.25);
      };

      const onMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      btn.addEventListener("mousemove", onMouseMove);
      btn.addEventListener("mouseleave", onMouseLeave);

      return () => {
        btn.removeEventListener("mousemove", onMouseMove);
        btn.removeEventListener("mouseleave", onMouseLeave);
      };
    }
  }, { scope: containerRef });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const message = formData.get("message") as string;

      let success = false;

      // Primary: Call the internal Contact API route
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
        if (res.ok) {
          success = true;
        }
      } catch {
        // Fallback below
      }

      // Fallback: If local API fails or mail service is unconfigured, submit via FormSubmit.co
      if (!success) {
        try {
          const fallbackRes = await fetch("https://formsubmit.co/ajax/zandriebarraba.1305@gmail.com", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              message,
              _subject: `New Portfolio Message from ${name}`,
              _template: "table",
            }),
          });
          if (fallbackRes.ok) {
            success = true;
          }
        } catch {
          // If network is completely offline
        }
      }

      if (success) {
        setSubmitStatus("success");
        form.reset();
      } else {
        setSubmitStatus("error");
        setErrorMessage("Failed to send message. Please reach out via email directly.");
      }
    } catch (error: unknown) {
      console.error("Network error:", error);
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again or email directly.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 10000);
    }
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className="py-20 md:py-28 px-6 md:px-12 bg-[#070709]/75 backdrop-blur-[2px] text-[#e7e5df] border-t border-white/[0.08] relative overflow-hidden z-10 select-none"
    >
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-16">
        
        {/* Left: Headline & Contact Details */}
        <div className="flex-1 max-w-[720px]">
          <div className="gsap-contact-eyebrow inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono tracking-[2px] uppercase text-[#a8a59d] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54]" />
            <span>07 / Initiate Contact</span>
          </div>

          <h2 className="text-[44px] sm:text-[64px] md:text-[80px] lg:text-[92px] font-heading font-bold uppercase leading-[0.92] tracking-[-0.03em] select-none text-white">
            <span className="gsap-contact-h1 block">Let&apos;s Work</span>
            <span className="gsap-contact-h2 block text-[#d36b54]">Together</span>
          </h2>

          <p className="text-[15px] sm:text-[16px] text-[#9ca3af] font-sans leading-relaxed mt-5 max-w-[500px]">
            Have an upcoming project, freelance contract, or technical advisory requirement? Let&apos;s discuss how we can build something exceptional.
          </p>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/[0.08]">
            <div className="gsap-contact-item p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-[10px] text-[#9ca3af] uppercase font-mono tracking-[2px] mb-1">DIRECT EMAIL</p>
              <a href="mailto:zandriebarraba.1305@gmail.com" className="text-[14px] font-semibold text-white hover:text-[#d36b54] transition-colors break-all">
                zandriebarraba.1305@gmail.com
              </a>
            </div>

            <div className="gsap-contact-item p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-[10px] text-[#9ca3af] uppercase font-mono tracking-[2px] mb-1">PHONE / MOBILE</p>
              <a href="tel:+639285893984" className="text-[14px] font-semibold text-white hover:text-[#d36b54] transition-colors">
                +63 928 589 3984
              </a>
            </div>

            <div className="gsap-contact-item p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-[10px] text-[#9ca3af] uppercase font-mono tracking-[2px] mb-1">GITHUB REPOSITORIES</p>
              <a href="https://github.com/ZAndrie" target="_blank" rel="noreferrer" className="text-[14px] font-semibold text-white hover:text-[#d36b54] transition-colors inline-flex items-center gap-1.5">
                <span>github.com/ZAndrie</span>
                <span className="text-[#d36b54]">↗</span>
              </a>
            </div>

            <div className="gsap-contact-item p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-[10px] text-[#9ca3af] uppercase font-mono tracking-[2px] mb-1">LINKEDIN NETWORK</p>
              <a href="https://www.linkedin.com/in/z-andrie-barraba-474428401/" target="_blank" rel="noreferrer" className="text-[14px] font-semibold text-white hover:text-[#d36b54] transition-colors inline-flex items-center gap-1.5">
                <span>in/z-andrie-barraba</span>
                <span className="text-[#d36b54]">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Modern Glass Form */}
        <div className="gsap-contact-form w-full lg:w-[460px]">
          <div className="p-7 rounded-2xl bg-[#0c0c0f]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <h3 className="font-heading font-bold text-xl uppercase tracking-tight text-white mb-2">
              Send a Message
            </h3>
            <p className="text-xs text-[#9ca3af] font-sans mb-6">
              Fill in your details below and I&apos;ll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[13px] text-white transition-all duration-200 focus:outline-none focus:border-[#d36b54] focus:bg-white/[0.05] placeholder-[#666]"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[13px] text-white transition-all duration-200 focus:outline-none focus:border-[#d36b54] focus:bg-white/[0.05] placeholder-[#666]"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Tell me about your project..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[13px] text-white transition-all duration-200 focus:outline-none focus:border-[#d36b54] focus:bg-white/[0.05] resize-y min-h-[100px] placeholder-[#666]"
                />
              </div>
              
              <button
                ref={submitBtnRef}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full bg-[#d36b54] hover:bg-[#b5543f] text-white text-[12px] font-mono uppercase font-semibold tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(211,107,84,0.3)] hover:shadow-[0_0_25px_rgba(211,107,84,0.5)] cursor-pointer"
              >
                {isSubmitting ? "TRANSMITTING..." : "SEND MESSAGE →"}
              </button>
              
              {submitStatus === "success" && (
                <div className="text-[12px] text-emerald-400 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 font-mono text-center">
                  ✓ Message sent! I&apos;ll be in touch shortly.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="text-[12px] text-red-400 p-3 rounded-xl bg-red-950/40 border border-red-800/60 font-mono text-center">
                  {errorMessage || "Failed to send message. Please email directly."}
                </div>
              )}
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
