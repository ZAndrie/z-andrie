import Link from "next/link";
import { FolderKanban, FileText, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const projectsCount = await prisma.project.count();
  const postsCount = await prisma.post.count();
  const certificatesCount = await prisma.certificate.count();
  const testimonialsCount = await prisma.testimonial.count();
  const unreadMessagesCount = await prisma.message.count({ where: { isRead: false } });

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-serif text-[var(--color-text-dark)] uppercase mb-2">
          System <span className="text-[var(--color-primary)] font-light italic">Overview</span>
        </h1>
        <p className="text-[var(--color-text-light)] text-[13px] leading-relaxed font-light">
          Welcome back. Here's a quick summary of your portfolio's content and activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Projects Card */}
        <div className="bg-white p-8 border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="w-12 h-12 rounded-full bg-[var(--color-light-bg)] flex items-center justify-center mb-6 text-[var(--color-primary)]">
              <FolderKanban size={24} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-serif mb-1">Projects</h2>
            <p className="text-sm text-gray-500 font-light mb-6">
              You have <strong className="text-[var(--color-text-dark)]">{projectsCount}</strong> projects showcased.
            </p>
          </div>
          
          <Link href="/admin/projects" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-text-dark)] transition-colors">
            Manage Projects <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Certificates Card */}
        <div className="bg-white p-8 border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="w-12 h-12 rounded-full bg-[var(--color-light-bg)] flex items-center justify-center mb-6 text-[var(--color-primary)]">
              <FolderKanban size={24} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-serif mb-1">Certificates</h2>
            <p className="text-sm text-gray-500 font-light mb-6">
              You have <strong className="text-[var(--color-text-dark)]">{certificatesCount}</strong> certificates uploaded.
            </p>
          </div>
          
          <Link href="/admin/certificates" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-text-dark)] transition-colors">
            Manage Certificates <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Card */}
        <div className="bg-white p-8 border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="w-12 h-12 rounded-full bg-[var(--color-light-bg)] flex items-center justify-center mb-6 text-[var(--color-primary)]">
              <FileText size={24} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-serif mb-1">Blog</h2>
            <p className="text-sm text-gray-500 font-light mb-6">
              You have <strong className="text-[var(--color-text-dark)]">{postsCount}</strong> published updates.
            </p>
          </div>
          
          <Link href="/admin/blog" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-text-dark)] transition-colors">
            Manage Content <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Testimonials Card */}
        <div className="bg-white p-8 border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="w-12 h-12 rounded-full bg-[var(--color-light-bg)] flex items-center justify-center mb-6 text-[var(--color-primary)]">
              <FileText size={24} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-serif mb-1">Testimonials</h2>
            <p className="text-sm text-gray-500 font-light mb-6">
              You have <strong className="text-[var(--color-text-dark)]">{testimonialsCount}</strong> total feedback entries.
            </p>
          </div>
          
          <Link href="/admin/testimonials" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-text-dark)] transition-colors">
            Manage Feedback <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Messages Card */}
        <div className="bg-white p-8 border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="w-12 h-12 rounded-full bg-[var(--color-light-bg)] flex items-center justify-center mb-6 text-[var(--color-primary)]">
              <FileText size={24} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-serif mb-1">Messages</h2>
            <p className="text-sm text-gray-500 font-light mb-6">
              You have <strong className={unreadMessagesCount > 0 ? "text-red-500" : "text-[var(--color-text-dark)]"}>{unreadMessagesCount}</strong> unread messages.
            </p>
          </div>
          
          <Link href="/admin/messages" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-text-dark)] transition-colors">
            View Inbox <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Placeholder for Recent Activity (Can be implemented later) */}
      <div className="mt-8 border-t border-[var(--color-border)] pt-8">
         <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6">System Notice</h3>
         <div className="bg-[var(--color-light-bg)] p-6 rounded border border-[var(--color-border)] text-sm text-gray-600 font-light">
           <span className="text-[var(--color-primary)] font-bold mr-2">New Feature:</span> 
           The admin panel has been redesigned to match the elegant aesthetic of your main portfolio. Additional features are coming soon.
         </div>
      </div>
    </div>
  );
}
