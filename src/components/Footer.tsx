"use client";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <p className="text-[12px] uppercase tracking-[2px]">&copy; {new Date().getFullYear()} Z Andrie.</p>
      <div className="flex gap-[30px] text-[12px] uppercase tracking-[2px]">
        <a href="#" className="hover:text-white transition-colors">Twitter</a>
        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
        <a href="#" className="hover:text-white transition-colors">Instagram</a>
      </div>
    </motion.footer>
  );
}
