"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <footer className="bg-[var(--color-dark-bg)] text-[var(--color-text-light)] py-[20px] md:py-[30px] px-[5%] md:px-[8%] border-t border-[#333] flex flex-col md:flex-row justify-between items-center gap-[20px]">
      <p className="text-[12px] uppercase tracking-[2px]">&copy; {new Date().getFullYear()} Z Andrie.</p>
      <div className="flex gap-[30px] text-[12px] uppercase tracking-[2px]">
        <a href="#" className="hover:text-white transition-colors">Twitter</a>
        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
        <a href="#" className="hover:text-white transition-colors">Instagram</a>
      </div>
    </footer>
  );
}
