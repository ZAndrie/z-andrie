import Link from "next/link";
import {
  FolderKanban,
  FileText,
  ArrowRight,
  Award,
  MessageSquare,
  Briefcase,
  GitBranch,
  ShieldCheck,
  Activity,
  Terminal,
  ExternalLink,
} from "lucide-react";
import {
  fetchGitHubProjects,
  fetchGitHubCertificates,
  fetchGitHubBlogPosts,
  fetchGitHubExpertise,
} from "@/lib/github";

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

  const cards = [
    {
      sector: "SEC-02",
      title: "PROJECTS VAULT",
      desc: "Live repositories synced and rendered in the Stage 03 Production grid.",
      count: projectsCount,
      unit: "REPOSITORIES",
      href: "/admin/projects",
      btnText: "MANAGE PROJECTS",
      icon: <FolderKanban size={22} className="text-[var(--color-primary)]" />,
    },
    {
      sector: "SEC-04",
      title: "CREDENTIALS ARCHIVE",
      desc: "Verified academic honors, certifications, and engineering diplomas.",
      count: certificatesCount,
      unit: "AWARDS & CERTS",
      href: "/admin/certificates",
      btnText: "MANAGE CREDENTIALS",
      icon: <Award size={22} className="text-[var(--color-primary)]" />,
    },
    {
      sector: "SEC-03",
      title: "EXPERTISE TREE",
      desc: "Architectural skill pillars, education milestones, and career trajectory.",
      count: expertiseCount,
      unit: "SYNCED ITEMS",
      href: "/admin/expertise",
      btnText: "MANAGE EXPERTISE",
      icon: <Briefcase size={22} className="text-[var(--color-primary)]" />,
    },
    {
      sector: "SEC-05",
      title: "DEVLOGS & FIELD NOTES",
      desc: "Published engineering logs, project postmortems, and release updates.",
      count: postsCount,
      unit: "ARTICLES",
      href: "/admin/blog",
      btnText: "MANAGE DEVLOGS",
      icon: <FileText size={22} className="text-[var(--color-primary)]" />,
    },
    {
      sector: "SEC-06",
      title: "COMMS & DISPATCH",
      desc: "Direct contact transmissions routed securely to your verified Gmail.",
      count: "ONLINE",
      unit: "RELAY ACTIVE",
      href: "/admin/messages",
      btnText: "INSPECT INBOX",
      icon: <MessageSquare size={22} className="text-[var(--color-primary)]" />,
    },
    {
      sector: "SEC-00",
      title: "LIVE REPOSITORY SYNC",
      desc: "Raw content datastore hosted at ZAndrie/portfolio-contents on GitHub.",
      count: "MAIN",
      unit: "ACTIVE BRANCH",
      href: "https://github.com/ZAndrie/portfolio-contents",
      external: true,
      btnText: "OPEN GITHUB REPO",
      icon: <GitBranch size={22} className="text-[var(--color-primary)]" />,
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Tactical Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[3px] text-gray-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            TELEMETRY // SYSTEM_OVERVIEW
          </div>
          <h1 className="font-stencil text-4xl md:text-5xl text-white uppercase tracking-wider mb-2">
            COMMAND <span className="text-[var(--color-primary)]">CENTER</span>
          </h1>
          <p className="text-gray-400 font-mono text-[13px] leading-relaxed max-w-2xl">
            Portfolio operations deck connected live to the GitHub contents datastore. All modifications commit directly to your public repository.
          </p>
        </div>

        {/* Live Telemetry Pill */}
        <div className="flex items-center gap-3 bg-[#0e0e12] border border-white/10 rounded-xl p-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)]">
            <Activity size={18} />
          </div>
          <div className="flex flex-col font-mono">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest">GATEWAY STATUS</span>
            <span className="text-[12px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              100% OPERATIONAL
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Tactical Sector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const isExternal = Boolean(card.external);
          return (
            <div
              key={card.sector}
              className="group bg-[#0e0e12]/90 hover:bg-[#131318] border border-white/10 hover:border-[var(--color-primary)]/50 rounded-xl p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              {/* Corner Tech Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-primary)]/5 rounded-bl-3xl pointer-events-none group-hover:bg-[var(--color-primary)]/10 transition-colors" />

              <div>
                {/* Card Top Row: Sector & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center group-hover:border-[var(--color-primary)]/40 transition-colors">
                    {card.icon}
                  </div>
                  <span className="font-mono text-[10px] text-gray-500 group-hover:text-[var(--color-primary)] tracking-widest uppercase font-bold transition-colors">
                    {card.sector}
                  </span>
                </div>

                {/* Card Header & Description */}
                <h2 className="font-stencil text-2xl text-white uppercase tracking-wider mb-2">
                  {card.title}
                </h2>
                <p className="text-gray-400 font-mono text-[12px] leading-relaxed mb-6 font-light">
                  {card.desc}
                </p>

                {/* Big Metric Display */}
                <div className="mb-6 pb-6 border-b border-white/5 flex items-baseline gap-2">
                  <span className="font-stencil text-4xl text-white group-hover:text-[var(--color-primary)] transition-colors">
                    {card.count}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[2px] text-gray-500">
                    {card.unit}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {isExternal ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 hover:bg-[var(--color-primary)] hover:text-white border border-white/10 hover:border-transparent text-gray-300 font-mono text-[11px] font-bold uppercase tracking-[2px] transition-all duration-200 group-hover:shadow-lg group-hover:shadow-[var(--color-primary)]/20"
                >
                  <span>{card.btnText}</span>
                  <ExternalLink size={14} />
                </a>
              ) : (
                <Link
                  href={card.href}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 hover:bg-[var(--color-primary)] hover:text-white border border-white/10 hover:border-transparent text-gray-300 font-mono text-[11px] font-bold uppercase tracking-[2px] transition-all duration-200 group-hover:shadow-lg group-hover:shadow-[var(--color-primary)]/20"
                >
                  <span>{card.btnText}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
