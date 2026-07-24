import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewPostForm from "./NewPostForm";

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[var(--color-primary)] transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>
        <h1 className="text-3xl font-serif text-[var(--color-text-dark)] uppercase mb-2">
          Create <span className="text-[var(--color-primary)] font-light italic">New Post</span>
        </h1>
        <p className="text-sm font-light text-gray-500 max-w-xl">
          Fill in the details below to create a new update for your portfolio.
        </p>
      </div>

      <NewPostForm />
    </div>
  );
}
