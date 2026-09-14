"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    <section id="contact" className="pt-[80px] pb-[30px] px-[5%] md:px-[8%] bg-[var(--color-dark-bg)] text-[var(--color-light-bg)] flex-1 flex flex-col justify-center">
      
      <div className="flex flex-col lg:flex-row justify-between gap-[50px] lg:gap-[80px]">
        
        {/* Left: Giant Text */}
        <motion.div 
          className="flex-1 max-w-[800px]"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[var(--color-primary)] text-[14px] uppercase tracking-[2px] font-bold mb-[15px]">
            HAVE AN IDEA?
          </p>
          <h2 className="text-[48px] md:text-[80px] lg:text-[100px] font-serif uppercase leading-[0.9] tracking-[-0.02em]">
            Let's Work<br />
            <span className="italic text-[var(--color-primary)]">Together</span>
          </h2>
          
          <div className="mt-[40px] flex gap-[40px]">
            <div>
              <p className="text-[11px] text-[var(--color-text-light)] uppercase tracking-[1.5px] mb-[5px]">EMAIL</p>
              <a href="mailto:zandriebarraba.1305@gmail.com" className="text-[14px] md:text-[16px] font-bold hover:text-[var(--color-primary)] transition-colors">
                zandriebarraba.1305@gmail.com
              </a>
            </div>
            <div>
              <p className="text-[11px] text-[var(--color-text-light)] uppercase tracking-[1.5px] mb-[5px]">PHONE</p>
              <a href="tel:+639285893984" className="text-[14px] md:text-[16px] font-bold hover:text-[var(--color-primary)] transition-colors">
                +63 928 589 3984
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right: Minimal Form & QR Code */}
        <motion.div 
          className="w-full lg:w-[400px] flex flex-col gap-[30px]"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-[15px]">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full p-[12px] border-b border-[#333] bg-transparent text-[13px] tracking-[0.5px] transition-all duration-300 focus:outline-none focus:border-[var(--color-primary)] placeholder-[#666]"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full p-[12px] border-b border-[#333] bg-transparent text-[13px] tracking-[0.5px] transition-all duration-300 focus:outline-none focus:border-[var(--color-primary)] placeholder-[#666]"
              />
            </div>
            <div>
              <textarea
                name="message"
                placeholder="Your Message..."
                required
                rows={4}
                className="w-full p-[12px] border-b border-[#333] bg-transparent text-[13px] tracking-[0.5px] transition-all duration-300 focus:outline-none focus:border-[var(--color-primary)] resize-y min-h-[90px] placeholder-[#666]"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-[5px] w-full bg-[var(--color-primary)] text-white p-[15px] text-[12px] uppercase font-bold tracking-[2px] transition-colors hover:bg-[var(--color-secondary)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "SENDING..." : "START A PROJECT"}
            </button>
            
            {submitStatus === "success" && (
              <div className="text-[11px] text-green-400 mt-1 uppercase tracking-[1px] bg-green-950/40 border border-green-800/60 p-2.5 rounded-sm">
                ✓ Message sent! Delivered directly to my Gmail.
              </div>
            )}
            {submitStatus === "error" && (
              <div className="text-[11px] text-red-400 mt-1 uppercase tracking-[1px] bg-red-950/40 border border-red-800/60 p-2.5 rounded-sm">
                {errorMessage || "An error occurred. Please try again."}
              </div>
            )}
          </form>

          {/* QR Code */}
          <div className="border border-[#333] p-[20px] flex items-center gap-[20px] rounded-sm">
            <div className="w-[70px] h-[70px] bg-white flex items-center justify-center p-[4px] rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BEGIN%3AVCARD%0AVERSION%3A3.0%0AN%3ABarraba%3BZ%20Andrie%0AFN%3AZ%20Andrie%20Barraba%0AEMAIL%3Azandriebarraba.1305%40gmail.com%0ATEL%3A%2B639285893984%0AEND%3AVCARD"
                alt="Z Andrie Contact QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[2px] font-bold mb-[5px]">SCAN QR</p>
              <p className="text-[12px] text-[#666] leading-[1.4]">To save my contact information instantly.</p>
            </div>
          </div>
          
        </motion.div>
        
      </div>
    </section>
  );
}
