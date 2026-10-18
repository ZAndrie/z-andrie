"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedBlogList from "@/app/blog/AnimatedBlogList";

export default function BlogSection({ posts = [] }: { posts?: any[] }) {
  return (
    <section
      id="blog"
      className="py-[100px] md:py-[120px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] border-t border-[var(--color-border)] relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[60px] gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <p className="text-[12px] uppercase text-[var(--color-primary)] tracking-[3px] font-bold mb-3">
              ARTICLES &amp; THOUGHTS
            </p>
            <h2 className="text-[36px] sm:text-[46px] md:text-[54px] font-serif uppercase text-[var(--color-text-dark)] leading-[1.05]">
              Latest <span className="text-[var(--color-primary)] italic">Writing</span>
            </h2>
          </div>

          <Link
            href="/blog"
            className="group text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-2"
          >
            <span className="roll">
              <span className="roll__inner">
                <span>VIEW ALL ARTICLES</span>
                <span className="roll__ghost text-[var(--color-primary)]" aria-hidden="true">VIEW ALL ARTICLES</span>
              </span>
            </span>
            <span className="arrow-swap text-[var(--color-primary)] w-[11px] h-[11px]" aria-hidden="true">
              <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </Link>
        </motion.div>

        {/* Content */}
        {posts.length === 0 ? (
          <div className="py-16 px-8 text-center bg-white/50 border border-dashed border-[var(--color-border)] rounded-sm">
            <p className="text-[14px] text-[var(--color-text-light)] font-serif italic">
              Articles and case study breakdowns are currently being cataloged. Check back soon!
            </p>
          </div>
        ) : (
          <AnimatedBlogList posts={posts.slice(0, 3)} />
        )}

      </div>
    </section>
  );
}
