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
          className="text-[10px] uppercase tracking-[2px] text-gray-600 hover:text-[var(--color-primary)] transition-colors opacity-40 hover:opacity-100"
          title="Admin Portal"
        >
          • Admin
        </Link>
      </div>
      <div className="flex gap-[30px] text-[12px] uppercase tracking-[2px]">
        <a href="https://github.com/ZAndrie" target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary)] transition-colors">GitHub</a>
        <a href="https://www.linkedin.com/in/z-andrie-barraba-474428401/" className="hover:text-white transition-colors">LinkedIn</a>
        <a href="#" className="hover:text-white transition-colors">Instagram</a>
      </div>
    </motion.footer>
  );
}
