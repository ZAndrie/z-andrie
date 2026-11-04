"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedBlogList from "@/app/blog/AnimatedBlogList";

export default function BlogSection({ posts = [] }: { posts?: any[] }) {
  return (
    <section
      id="blog"
      className="py-20 md:py-28 px-6 md:px-12 bg-[#070709]/75 backdrop-blur-[2px] border-t border-white/[0.08] relative overflow-hidden z-10"
    >
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-6 border-b border-white/[0.08]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono tracking-[2px] uppercase text-[#a8a59d] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54]" />
              <span>06 / Technical Devlogs</span>
            </div>
            <h2 className="text-[34px] sm:text-[44px] md:text-[52px] font-heading font-bold uppercase text-[#ffffff] leading-[1.05] tracking-tight">
              Latest <span className="text-[#d36b54]">Articles</span>
            </h2>
          </div>

          <Link
            href="/blog"
            className="group px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-[#d36b54] border border-white/[0.1] hover:border-[#d36b54] text-white text-[11px] font-mono uppercase tracking-wider font-semibold transition-all inline-flex items-center gap-2 shadow-sm"
          >
            <span>View All Articles</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>

        {/* Content */}
        {posts.length === 0 ? (
          <div className="py-16 px-8 text-center rounded-2xl bg-[#0c0c0f]/80 backdrop-blur-xl border border-white/[0.08] shadow-xl">
            <p className="text-[14px] text-[#9ca3af] font-sans">
              Technical articles and architectural breakdowns are being published soon. Stay tuned!
            </p>
          </div>
        ) : (
          <AnimatedBlogList posts={posts.slice(0, 3)} />
        )}

      </div>
    </section>
  );
}
