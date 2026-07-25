"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formData = new FormData(e.currentTarget);
      
      // Web3Forms required fields
      formData.append("access_key", "1a0fae38-6e0a-4cf5-855c-c90366f8e2cb");
      formData.append("subject", "New Contact Form Submission - Z Andrie Portfolio");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Also save to our own database for the admin panel Messages tab
        try {
          await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.get("name"),
              email: formData.get("email"),
              message: formData.get("message"),
            }),
          });
        } catch (dbError) {
          console.error("Failed to save to database", dbError);
        }

        setSubmitStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        console.error("Error submitting form", data);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Network error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 7000);
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
          viewport={{ once: false, amount: 0.2 }}
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
              <a href="tel:+639123456789" className="text-[14px] md:text-[16px] font-bold hover:text-[var(--color-primary)] transition-colors">
                +63 912 345 6789
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right: Minimal Form & QR Code */}
        <motion.div 
          className="w-full lg:w-[400px] flex flex-col gap-[30px]"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-[15px]">
            <div>
              <input
                type="text"
                name="name"
                placeholder="YOUR NAME"
                required
                className="w-full p-[12px] border-b border-[#333] bg-transparent text-[12px] uppercase tracking-[1px] transition-all duration-300 focus:outline-none focus:border-[var(--color-primary)] placeholder-[#666]"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="EMAIL ADDRESS"
                required
                className="w-full p-[12px] border-b border-[#333] bg-transparent text-[12px] uppercase tracking-[1px] transition-all duration-300 focus:outline-none focus:border-[var(--color-primary)] placeholder-[#666]"
              />
            </div>
            <div>
              <textarea
                name="message"
                placeholder="YOUR MESSAGE"
                required
                className="w-full p-[12px] border-b border-[#333] bg-transparent text-[12px] uppercase tracking-[1px] transition-all duration-300 focus:outline-none focus:border-[var(--color-primary)] resize-y min-h-[80px] placeholder-[#666]"
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
              <div className="text-[11px] text-[var(--color-primary)] mt-1 uppercase tracking-[1px]">
                Message sent successfully.
              </div>
            )}
            {submitStatus === "error" && (
              <div className="text-[11px] text-red-500 mt-1 uppercase tracking-[1px]">
                An error occurred. Please try again.
              </div>
            )}
          </form>

          {/* QR Code Placeholder */}
          <div className="border border-[#333] p-[20px] flex items-center gap-[20px]">
            <div className="w-[70px] h-[70px] bg-white flex items-center justify-center p-[5px]">
              {/* Fake QR code using borders */}
              <div className="w-full h-full border-[8px] border-black border-dashed"></div>
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
