"use client";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <motion.footer 
      className="bg-[var(--color-dark-bg)] text-[var(--color-text-light)] py-[20px] md:py-[30px] px-[5%] md:px-[8%] border-t border-[#333] flex flex-col md:flex-row justify-between items-center gap-[20px]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center gap-3">
        <p className="text-[12px] uppercase tracking-[2px]">&copy; {new Date().getFullYear()} Z Andrie.</p>
        <Link 
          href="/admin" 
          className="text-[10px] uppercase tracking-[2px] text-gray-500 hover:text-[var(--color-primary)] transition-colors opacity-60 hover:opacity-100 flex items-center gap-1"
          title="Admin Portal"
        >
          🔒 Admin
        </Link>
      </div>
      <div className="flex items-center gap-[15px] text-[16px]">
        <a 
          href="https://github.com/ZAndrie" 
          target="_blank" 
          rel="noreferrer" 
          aria-label="GitHub Profile"
          title="GitHub Profile"
          className="w-[36px] h-[36px] rounded-full border border-[#333] hover:border-[var(--color-primary)] flex items-center justify-center text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-all hover:scale-110"
        >
          <i className="fa-brands fa-github text-[15px]"></i>
        </a>
        <a 
          href="https://www.linkedin.com/in/z-andrie-barraba-474428401/" 
          target="_blank" 
          rel="noreferrer"
          aria-label="LinkedIn Profile"
          title="LinkedIn Profile"
          className="w-[36px] h-[36px] rounded-full border border-[#333] hover:border-[var(--color-primary)] flex items-center justify-center text-[var(--color-text-light)] hover:text-white transition-all hover:scale-110"
        >
          <i className="fa-brands fa-linkedin-in text-[14px]"></i>
        </a>
        <a 
          href="https://www.instagram.com/4ndr_eiiz/" 
          target="_blank" 
          rel="noreferrer"
          aria-label="Instagram Profile"
          title="Instagram Profile"
          className="w-[36px] h-[36px] rounded-full border border-[#333] hover:border-[var(--color-primary)] flex items-center justify-center text-[var(--color-text-light)] hover:text-white transition-all hover:scale-110"
        >
          <i className="fa-brands fa-instagram text-[14px]"></i>
        </a>
        <a 
          href="https://www.wattpad.com/user/RexSkyler" 
          target="_blank" 
          rel="noreferrer" 
          aria-label="Wattpad Profile"
          title="Wattpad Profile"
          className="w-[36px] h-[36px] rounded-full border border-[#333] hover:border-[var(--color-primary)] flex items-center justify-center text-[var(--color-text-light)] hover:text-white transition-all hover:scale-110"
        >
          <i className="fa-solid fa-book-open text-[13px]"></i>
        </a>
      </div>
    </motion.footer>
  );
}
