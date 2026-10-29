import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewPostForm from "./NewPostForm";

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-8 pb-20 font-mono">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-gray-400 hover:text-[var(--color-primary)] transition-colors mb-4 group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
          Back to Devlogs Vault
        </Link>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[3px] text-gray-500 mb-1">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          SECTOR // SEC-05 // COMPOSE
        </div>
        <h1 className="font-stencil text-4xl text-white uppercase tracking-wider mb-2">
          COMPOSE <span className="text-[var(--color-primary)]">DEVLOG ENTRY</span>
        </h1>
        <p className="text-gray-400 text-[13px] leading-relaxed max-w-xl font-light">
          Draft field notes, architecture updates, or project milestones.
        </p>
      </div>

      <NewPostForm />
    </div>
  );
}
