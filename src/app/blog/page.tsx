import prisma from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="min-h-screen bg-[var(--color-light-bg)] pt-32 pb-20">
      <div className="w-[90%] md:w-[85%] max-w-[1200px] mx-auto">
        <header className="mb-16">
          <p className="text-[12px] uppercase text-[var(--color-primary)] tracking-[2px] font-bold mb-4">
            Blog & Updates
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-text-dark)] leading-tight">
            Read My Latest <br />
            Thoughts and Articles.
          </h1>
        </header>

        {posts.length === 0 ? (
          <div className="text-gray-500 py-10 border-t border-[var(--color-border)]">
            No articles published yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full border border-[var(--color-border)] bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative w-full h-56 overflow-hidden bg-gray-100">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-serif text-3xl">
                      {post.title.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">
                    {new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h2 className="text-xl font-serif text-[var(--color-text-dark)] leading-snug mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[14px] text-gray-600 leading-relaxed mb-6 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-2 text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-text-dark)] group-hover:text-[var(--color-primary)] transition-colors">
                    Read More 
                    <span className="text-lg font-light leading-none transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
