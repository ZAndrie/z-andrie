import Link from "next/link";
import { PlusCircle, Edit3, Trash2, FileText, CheckCircle } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function BlogAdminPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-[var(--color-text-dark)] uppercase mb-2">
            Blog <span className="text-[var(--color-primary)] font-light italic">Management</span>
          </h1>
          <p className="text-sm font-light text-gray-500 max-w-xl">
            Create, edit, and publish updates for your portfolio. Choose between a simple rich text editor or a modern block-based editor.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-[var(--color-primary)] text-white px-6 py-3 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-[var(--color-primary-dark)] transition-colors flex items-center gap-2"
        >
          <PlusCircle size={16} />
          Create Post
        </Link>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-md overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[var(--color-light-bg)] rounded-full flex items-center justify-center mb-4 text-[var(--color-primary)]">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-dark)] mb-2">No posts yet</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              You haven't written any blog posts or updates yet. Click the button above to create your first post.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-light-bg)] border-b border-[var(--color-border)]">
                  <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Title</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Editor</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Date</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-[var(--color-border)] hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[var(--color-text-dark)] mb-1">{post.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{post.excerpt}</div>
                    </td>
                    <td className="p-4">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle size={12} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-50 text-yellow-600 text-[10px] font-bold uppercase tracking-wider">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded uppercase">
                        {post.editorType === "json" ? "Block" : "Classic"}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/edit/${post.id}`}
                          className="p-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors rounded hover:bg-[var(--color-light-bg)]"
                          title="Edit Post"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-50"
                          title="Delete Post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
