"use client";

import { useState } from "react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // TODO: Hook this up to your Google Notifications implementation
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      };
      
      console.log("Form data ready for Google Notifications:", data);
      
      // Simulating network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 7000);
    }
  };

  return (
    <section id="contact" className="py-[100px] px-[5%] md:px-[8%] bg-[var(--color-dark-bg)] text-[var(--color-light-bg)]">
      
      <div className="flex flex-col lg:flex-row justify-between gap-[80px]">
        
        {/* Left: Giant Text */}
        <div className="flex-1 max-w-[800px]">
          <p className="text-[var(--color-primary)] text-[14px] uppercase tracking-[2px] font-bold mb-[20px]">
            HAVE AN IDEA?
          </p>
          <h2 className="text-[48px] md:text-[80px] lg:text-[110px] font-serif uppercase leading-[0.9] tracking-[-0.02em]">
            Let's Work<br />
            <span className="italic text-[var(--color-primary)]">Together</span>
          </h2>
          
          <div className="mt-[60px] flex gap-[40px]">
            <div>
              <p className="text-[11px] text-[var(--color-text-light)] uppercase tracking-[1.5px] mb-[5px]">EMAIL</p>
              <a href="mailto:zandriebarraba.1305@gmail.com" className="text-[16px] font-bold hover:text-[var(--color-primary)] transition-colors">
                zandriebarraba.1305@gmail.com
              </a>
            </div>
            <div>
              <p className="text-[11px] text-[var(--color-text-light)] uppercase tracking-[1.5px] mb-[5px]">PHONE</p>
              <a href="tel:+639123456789" className="text-[16px] font-bold hover:text-[var(--color-primary)] transition-colors">
                +63 912 345 6789
              </a>
            </div>
          </div>
        </div>

        {/* Right: Minimal Form & QR Code */}
        <div className="w-full lg:w-[400px] flex flex-col gap-[50px]">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
            <div>
              <input
                type="text"
                name="name"
                placeholder="YOUR NAME"
                required
                className="w-full p-[15px] border-b border-[#333] bg-transparent text-[12px] uppercase tracking-[1px] transition-all duration-300 focus:outline-none focus:border-[var(--color-primary)] placeholder-[#666]"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="EMAIL ADDRESS"
                required
                className="w-full p-[15px] border-b border-[#333] bg-transparent text-[12px] uppercase tracking-[1px] transition-all duration-300 focus:outline-none focus:border-[var(--color-primary)] placeholder-[#666]"
              />
            </div>
            <div>
              <textarea
                name="message"
                placeholder="YOUR MESSAGE"
                required
                className="w-full p-[15px] border-b border-[#333] bg-transparent text-[12px] uppercase tracking-[1px] transition-all duration-300 focus:outline-none focus:border-[var(--color-primary)] resize-y min-h-[100px] placeholder-[#666]"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-[10px] w-full bg-[var(--color-primary)] text-white p-[15px] text-[12px] uppercase font-bold tracking-[2px] transition-colors hover:bg-[var(--color-secondary)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "SENDING..." : "START A PROJECT"}
            </button>
            
            {submitStatus === "success" && (
              <div className="text-[11px] text-[var(--color-primary)] mt-2 uppercase tracking-[1px]">
                Message sent successfully.
              </div>
            )}
            {submitStatus === "error" && (
              <div className="text-[11px] text-red-500 mt-2 uppercase tracking-[1px]">
                An error occurred. Please try again.
              </div>
            )}
          </form>

          {/* QR Code Placeholder */}
          <div className="border border-[#333] p-[30px] flex items-center gap-[20px]">
            <div className="w-[80px] h-[80px] bg-white flex items-center justify-center p-[5px]">
              {/* Fake QR code using borders */}
              <div className="w-full h-full border-[8px] border-black border-dashed"></div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[2px] font-bold mb-[5px]">SCAN QR</p>
              <p className="text-[12px] text-[#666] leading-[1.6]">To save my contact information instantly.</p>
            </div>
          </div>
          
        </div>
        
      </div>
    </section>
  );
}
