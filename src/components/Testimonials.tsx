"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Testimonials({
  testimonials = []
}: {
  testimonials?: { id: string; name: string; role: string; content: string; imageUrl: string | null; rating?: number }[]
}) {

  return (
    <section id="testimonials" className="pt-[100px] pb-[40px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] border-t border-[var(--color-border)] flex-1 flex flex-col justify-center overflow-hidden">
      
      {/* Header */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[80px] gap-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-[400px]">
          <h2 className="text-[36px] md:text-[48px] text-[var(--color-text-dark)] font-serif uppercase leading-[1.1] mb-[20px]">
            What Clients<br />
            <span className="text-[var(--color-primary)]">Say</span>
          </h2>
        </div>
        
        <div className="flex-1 max-w-[300px]">
          <p className="text-[var(--color-text-light)] text-[14px] leading-[1.6]">
            Honest feedback from amazing clients I've had the pleasure to work with.
          </p>
        </div>

        <div className="flex justify-end w-full md:w-auto">
          <a href="#" className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-[10px]">
            MORE REVIEWS <span className="text-[var(--color-primary)] text-lg leading-none font-light">→</span>
          </a>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
        {testimonials.length > 0 ? (
          testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id || index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-[var(--color-light-bg)] border border-[var(--color-border)] p-[40px] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-[10px]">
                  <div className="text-[60px] font-serif text-[var(--color-primary)] opacity-40 leading-none h-[40px]">
                    “
                  </div>
                  <div className="flex gap-1 text-[var(--color-primary)] text-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} style={{ color: (testimonial.rating || 5) >= star ? "#fbbf24" : "#e5e7eb" }}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-[14px] leading-[1.8] text-[var(--color-text-dark)] mb-[40px] italic">
                  {testimonial.content}
                </p>
              </div>
              
              <div className="flex items-center gap-[15px]">
                <div className="w-[45px] h-[45px] rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                  {testimonial.imageUrl ? (
                    <Image
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      width={45}
                      height={45}
                      className="w-full h-full object-cover grayscale"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold uppercase">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                </div>
              <div>
                <h4 className="text-[13px] font-bold text-[var(--color-text-dark)]">
                  {testimonial.name}
                </h4>
                <p className="text-[var(--color-text-light)] text-[11px] uppercase tracking-[1px]">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </motion.div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-3 text-center py-20 text-gray-400 text-sm uppercase tracking-widest border border-dashed border-[var(--color-border)]">
            No testimonials found.
          </div>
        )}
      </div>
    </section>
  );
}
