import Link from "next/link";
import { FolderKanban, FileText, ArrowRight, Award, MessageSquare, Briefcase } from "lucide-react";
import { fetchGitHubProjects, fetchGitHubCertificates, fetchGitHubBlogPosts, fetchGitHubExpertise } from "@/lib/github";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [projects, certificates, blogPosts, expertise] = await Promise.all([
    fetchGitHubProjects(),
    fetchGitHubCertificates(),
    fetchGitHubBlogPosts(),
    fetchGitHubExpertise(),
  ]);

  const projectsCount = projects.length;
  const postsCount = blogPosts.length;
  const certificatesCount = certificates.length;
  const expertiseCount = expertise.length;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-serif text-[var(--color-text-dark)] uppercase mb-2">
          System <span className="text-[var(--color-primary)] font-light italic">Overview</span>
        </h1>
        <p className="text-[var(--color-text-light)] text-[13px] leading-relaxed font-light">
          Welcome back. Your portfolio is connected live to GitHub repositories.
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
            <h2 className="text-xl font-serif mb-1">GitHub Projects</h2>
            <p className="text-sm text-gray-500 font-light mb-6">
              You have <strong className="text-[var(--color-text-dark)]">{projectsCount}</strong> repositories synced live from GitHub.
            </p>
          </div>
          
          <Link href="/works" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-text-dark)] transition-colors">
            View Live Works <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Certificates Card */}
        <div className="bg-white p-8 border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="w-12 h-12 rounded-full bg-[var(--color-light-bg)] flex items-center justify-center mb-6 text-[var(--color-primary)]">
              <Award size={24} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-serif mb-1">Certificates</h2>
            <p className="text-sm text-gray-500 font-light mb-6">
              You have <strong className="text-[var(--color-text-dark)]">{certificatesCount}</strong> certificates synced from GitHub.
            </p>
          </div>
          
          <Link href="/admin/certificates" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-text-dark)] transition-colors">
            Manage Certificates <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Expertise Card */}
        <div className="bg-white p-8 border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="w-12 h-12 rounded-full bg-[var(--color-light-bg)] flex items-center justify-center mb-6 text-[var(--color-primary)]">
              <Briefcase size={24} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-serif mb-1">Expertise &amp; Resume</h2>
            <p className="text-sm text-gray-500 font-light mb-6">
              You have <strong className="text-[var(--color-text-dark)]">{expertiseCount}</strong> items synced from Expertise-Repository.
            </p>
          </div>
          
          <Link href="/admin/expertise" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-text-dark)] transition-colors">
            Manage Expertise <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Card */}
        <div className="bg-white p-8 border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="w-12 h-12 rounded-full bg-[var(--color-light-bg)] flex items-center justify-center mb-6 text-[var(--color-primary)]">
              <FileText size={24} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-serif mb-1">Blog &amp; Articles</h2>
            <p className="text-sm text-gray-500 font-light mb-6">
              You have <strong className="text-[var(--color-text-dark)]">{postsCount}</strong> published updates.
            </p>
          </div>
          
          <Link href="/blog" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-text-dark)] transition-colors">
            View Live Blog <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Contact / Inquiries Card */}
        <div className="bg-white p-8 border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div>
            <div className="w-12 h-12 rounded-full bg-[var(--color-light-bg)] flex items-center justify-center mb-6 text-[var(--color-primary)]">
              <MessageSquare size={24} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-serif mb-1">Direct Contact</h2>
            <p className="text-sm text-gray-500 font-light mb-6">
              Contact submissions are routed directly to your email via Web3Forms.
            </p>
          </div>
          
          <Link href="/contact" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-text-dark)] transition-colors">
            Go to Contact <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
