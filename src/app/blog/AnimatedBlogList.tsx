"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AnimatedBlogList({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-500 py-10 border-t border-[var(--color-border)]"
      >
        No articles published yet. Check back soon!
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="h-full"
        >
          <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full border border-[var(--color-border)] bg-white shadow-sm hover:shadow-xl transition-all duration-300">
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
        </motion.div>
      ))}
    </div>
  )
}
