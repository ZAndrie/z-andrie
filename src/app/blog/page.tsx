import prisma from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import AnimatedBlogList from "./AnimatedBlogList"

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
          <AnimatedBlogList posts={posts} />
        )}
      </div>
    </div>
  )
}
