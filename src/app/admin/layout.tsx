"use client";

import { signOut, SessionProvider } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, FileText, Settings, MessageSquare, LogOut, Award } from "lucide-react";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
    { href: "/admin/projects", label: "Projects", icon: <FolderKanban size={18} strokeWidth={1.5} /> },
    { href: "/admin/certificates", label: "Certificates", icon: <Award size={18} strokeWidth={1.5} /> },
    { href: "/admin/testimonials", label: "Testimonials", icon: <MessageSquare size={18} strokeWidth={1.5} /> },
    { href: "/admin/blog", label: "Blog & Updates", icon: <FileText size={18} strokeWidth={1.5} /> },
    { href: "/admin/messages", label: "Messages", icon: <MessageSquare size={18} strokeWidth={1.5} /> },
  ];

  return (
    <SessionProvider>
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#fcfbf9' }}>
        
        {/* Sidebar */}
        <aside style={{ width: '256px', flexShrink: 0, backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'sticky', top: 0, height: '100vh', zIndex: 20 }}>
          <div>
            {/* Logo Area */}
            <div className="h-[80px] flex items-center px-8 border-b border-gray-100">
               <Link href="/" className="relative h-[25px] w-[130px] block">
                  <Image
                    src="/logo-primary.jpg"
                    alt="Z Andrie Logo"
                    fill
                    className="object-contain object-left mix-blend-multiply"
                    priority
                  />
               </Link>
            </div>

            <nav className="flex flex-col gap-1 p-4 mt-2">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-4 mb-2">Menu</div>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 group ${
                    pathname === link.href
                      ? "bg-[var(--color-light-bg)] text-[var(--color-primary)]"
                      : "text-gray-500 hover:text-[var(--color-text-dark)] hover:bg-gray-50"
                  }`}
                >
                  <div className={`${pathname === link.href ? "text-[var(--color-primary)]" : "text-gray-400 group-hover:text-[var(--color-text-dark)]"}`}>
                    {link.icon}
                  </div>
                  <span className={`text-[12px] font-bold tracking-wide uppercase ${pathname === link.href ? "text-[var(--color-text-dark)]" : ""}`}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-100 mt-auto">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:text-white hover:bg-red-500 rounded-md transition-all duration-300 group border border-transparent hover:border-red-600"
            >
              <LogOut size={16} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
              <span className="text-[11px] font-bold tracking-widest uppercase">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div className="w-full max-w-6xl mx-auto p-8 md:p-12 pt-[40px] md:pt-[60px]">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
