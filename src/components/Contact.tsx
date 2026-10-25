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
        toggleActions: "play none none reverse",
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

    // 2. Magnetic Physics on Submit Button (Desktop pointer only)
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

      // 1. Try server-side route
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          success = true;
        }
      } catch (serverErr) {
        console.warn("Server route error, trying direct fallback:", serverErr);
      }

      // 2. Direct Formspree fallback if needed
      if (!success) {
        const directRes = await fetch("https://formspree.io/f/xqpkvwqz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ name, email, message, _replyto: email }),
        });

        if (directRes.ok) {
          success = true;
        }
      }

      if (success) {
        setSubmitStatus("success");
        form.reset();
      } else {
        setSubmitStatus("error");
        setErrorMessage("Failed to send message. Please try again.");
      }
    } catch (error: any) {
      console.error("Network error:", error);
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 10000);
    }
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className="pt-[90px] md:pt-[120px] pb-[50px] px-[5%] md:px-[8%] bg-[var(--color-dark-bg)] text-[var(--color-light-bg)] relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between gap-[50px] lg:gap-[80px]">
        
        {/* Left: Giant Kinetic Headline & Contact Details */}
        <div className="flex-1 max-w-[800px]">
          <p className="gsap-contact-eyebrow text-[var(--color-primary)] text-[13px] uppercase tracking-[3px] font-mono font-bold mb-[20px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
            HAVE AN IDEA OR OPPORTUNITY?
          </p>

          <h2 className="text-[48px] sm:text-[68px] md:text-[88px] lg:text-[104px] font-serif uppercase leading-[0.92] tracking-[-0.02em] select-none">
            <span className="gsap-contact-h1 block">Let&apos;s Work</span>
            <span className="gsap-contact-h2 block italic text-[var(--color-primary)]">Together</span>
          </h2>
          
          <div className="mt-[45px] grid grid-cols-1 sm:grid-cols-2 gap-[25px] pt-8 border-t border-[#333]">
            <div className="gsap-contact-item">
              <p className="text-[10px] text-[var(--color-text-light)] uppercase font-mono tracking-[2px] mb-[6px]">EMAIL</p>
              <a href="mailto:zandriebarraba.1305@gmail.com" className="text-[14px] md:text-[15px] font-bold hover:text-[var(--color-primary)] transition-colors">
                zandriebarraba.1305@gmail.com
              </a>
            </div>
            <div className="gsap-contact-item">
              <p className="text-[10px] text-[var(--color-text-light)] uppercase font-mono tracking-[2px] mb-[6px]">PHONE</p>
              <a href="tel:+639285893984" className="text-[14px] md:text-[15px] font-bold hover:text-[var(--color-primary)] transition-colors">
                +63 928 589 3984
              </a>
            </div>
            <div className="gsap-contact-item">
              <p className="text-[10px] text-[var(--color-text-light)] uppercase font-mono tracking-[2px] mb-[6px]">GITHUB</p>
              <a href="https://github.com/ZAndrie" target="_blank" rel="noreferrer" className="text-[14px] md:text-[15px] font-bold hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1.5">
                <span>github.com/ZAndrie</span>
                <span className="text-[var(--color-primary)]">↗</span>
              </a>
            </div>
            <div className="gsap-contact-item">
              <p className="text-[10px] text-[var(--color-text-light)] uppercase font-mono tracking-[2px] mb-[6px]">LINKEDIN</p>
              <a href="https://www.linkedin.com/in/z-andrie-barraba-474428401/" target="_blank" rel="noreferrer" className="text-[14px] md:text-[15px] font-bold hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1.5">
                <span>in/z-andrie-barraba</span>
                <span className="text-[var(--color-primary)]">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Minimal Form & QR Code */}
        <div className="gsap-contact-form w-full lg:w-[420px] flex flex-col gap-[30px]">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full p-[14px] border-b border-[#333] bg-transparent text-[13px] tracking-[0.5px] transition-all duration-300 focus:outline-none focus:border-[var(--color-primary)] placeholder-[#666]"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full p-[14px] border-b border-[#333] bg-transparent text-[13px] tracking-[0.5px] transition-all duration-300 focus:outline-none focus:border-[var(--color-primary)] placeholder-[#666]"
              />
            </div>
            <div>
              <textarea
                name="message"
                placeholder="Your Message..."
                required
                rows={4}
                className="w-full p-[14px] border-b border-[#333] bg-transparent text-[13px] tracking-[0.5px] transition-all duration-300 focus:outline-none focus:border-[var(--color-primary)] resize-y min-h-[95px] placeholder-[#666]"
              ></textarea>
            </div>
            
            <button
              ref={submitBtnRef}
              type="submit"
              disabled={isSubmitting}
              className="mt-[6px] w-full bg-[var(--color-primary)] text-white p-[16px] text-[11px] uppercase font-bold tracking-[2px] transition-all duration-300 hover:bg-[var(--color-secondary)] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-xl rounded-sm"
            >
              {isSubmitting ? "SENDING MESSAGE..." : "START A PROJECT ↗"}
            </button>
            
            {submitStatus === "success" && (
              <div className="text-[11px] text-green-400 mt-1 uppercase tracking-[1px] bg-green-950/40 border border-green-800/60 p-3 rounded-sm font-mono">
                ✓ Message sent! Delivered directly to my Gmail.
              </div>
            )}
            {submitStatus === "error" && (
              <div className="text-[11px] text-red-400 mt-1 uppercase tracking-[1px] bg-red-950/40 border border-red-800/60 p-3 rounded-sm font-mono">
                {errorMessage || "An error occurred. Please try again."}
              </div>
            )}
          </form>

          {/* Contact vCard QR Code */}
          <div className="border border-[#333] p-[20px] flex items-center gap-[20px] rounded-sm bg-white/[0.02]">
            <div className="w-[72px] h-[72px] bg-white flex items-center justify-center p-[4px] rounded-sm shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BEGIN%3AVCARD%0AVERSION%3A3.0%0AN%3ABarraba%3BZ%20Andrie%0AFN%3AZ%20Andrie%20Barraba%0AEMAIL%3Azandriebarraba.1305%40gmail.com%0ATEL%3A%2B639285893984%0AEND%3AVCARD"
                alt="Z Andrie Contact QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-[11px] uppercase font-mono tracking-[2px] font-bold mb-[4px] text-[var(--color-primary)]">
                QUICK VCARD QR
              </p>
              <p className="text-[12px] text-[#888] leading-[1.5]">
                Scan with any mobile camera to instantly save contact details to your phonebook.
              </p>
            </div>
          </div>
          
        </div>
        
      </div>
    </section>
  );
}
