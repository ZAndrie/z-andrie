"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="py-[90px] md:py-[120px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] border-t border-[var(--color-border)] relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <motion.div
          className="mb-[50px] md:mb-[70px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[var(--color-primary)] text-[12px] uppercase tracking-[3px] font-bold mb-[12px]">
            BIOGRAPHY & PHILOSOPHY
          </p>
          <h2 className="text-[36px] sm:text-[46px] md:text-[60px] font-serif uppercase text-[var(--color-text-dark)] leading-[1.05]">
            About <span className="text-[var(--color-primary)] italic">Me</span>
          </h2>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[50px] lg:gap-[80px] items-start">
          
          {/* Left Column: 1-2 Paragraph Bio */}
          <motion.div
            className="lg:col-span-7 flex flex-col gap-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="text-[17px] md:text-[19px] text-[var(--color-text-dark)] leading-[1.8] font-serif font-normal">
              I am <span className="font-semibold text-[var(--color-primary)]">Z Andrie</span>, a creative web designer and front-end developer based in the <strong className="font-semibold">Philippines</strong>. I specialize in designing and engineering digital experiences that are not only aesthetically striking, but intuitive, accessible, and grounded in clean design principles.
            </p>

            <p className="text-[15px] md:text-[16px] text-[var(--color-text-light)] leading-[1.8]">
              Currently, I am deepening my expertise in <strong className="text-[var(--color-text-dark)]">modern React architecture</strong>, <strong className="text-[var(--color-text-dark)]">GSAP interactive animations</strong>, Next.js server components, and responsive design systems. My focus is centered on mastering high-performance frontend engineering to build seamless web applications that solve real user needs.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/works"
                className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-2 group"
              >
                DISCOVER MY PROJECTS
                <span className="text-[var(--color-primary)] text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <span className="text-[var(--color-border)]">•</span>
              <Link
                href="/contact"
                className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-2 group"
              >
                GET IN TOUCH
                <span className="text-[var(--color-primary)] text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Key Details & Badges */}
          <motion.div
            className="lg:col-span-5 bg-white/70 backdrop-blur-sm border border-[var(--color-border)] p-8 sm:p-10 rounded-sm shadow-sm flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div>
              <p className="text-[11px] uppercase tracking-[2px] text-[var(--color-primary)] font-bold mb-2">
                LOCATION
              </p>
              <h3 className="text-[20px] font-serif text-[var(--color-text-dark)] flex items-center gap-2">
                <span>📍</span> Philippines
              </h3>
            </div>

            <div className="h-[1px] bg-[var(--color-border)]" />

            <div>
              <p className="text-[11px] uppercase tracking-[2px] text-[var(--color-primary)] font-bold mb-2">
                CURRENT FOCUS & LEARNING
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["React & Next.js", "GSAP Animations", "Tailwind CSS", "TypeScript", "UI/UX Design"].map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-mono px-3 py-1 rounded bg-[var(--color-light-bg)] border border-[var(--color-border)] text-[var(--color-text-dark)] font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-[var(--color-border)]" />

            <div>
              <p className="text-[11px] uppercase tracking-[2px] text-[var(--color-primary)] font-bold mb-2">
                CORE DISCIPLINES
              </p>
              <p className="text-[13px] text-[var(--color-text-light)] leading-relaxed">
                Frontend Engineering • Interactive Web Animations • Responsive UI/UX • Clean Architecture
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
