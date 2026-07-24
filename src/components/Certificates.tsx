"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Certificates({ certificates = [] }: { certificates?: any[] }) {
  return (
    <section id="certificates" className="pt-[100px] pb-[40px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] flex-1 flex flex-col justify-center overflow-hidden min-h-screen">
      
      {/* Header section */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[80px] gap-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-[400px]">
          <h2 className="text-[36px] md:text-[48px] text-[var(--color-text-dark)] font-serif uppercase leading-[1.1] mb-[20px]">
            My<br />
            <span className="text-[var(--color-primary)]">Certificates</span>
          </h2>
        </div>
        
        <div className="flex-1 max-w-[400px]">
          <p className="text-[var(--color-text-light)] text-[14px] leading-[1.6]">
            A collection of my professional certifications, courses, and achievements.
          </p>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]"
        layout
      >
        <AnimatePresence mode="popLayout">
          {certificates.length === 0 ? (
            <div className="col-span-full text-center text-[var(--color-text-light)] py-20">
              No certificates uploaded yet.
            </div>
          ) : certificates.map((item, index) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="group cursor-pointer"
            >
              <div className="w-full aspect-[4/3] overflow-hidden mb-[20px] bg-white border border-[var(--color-border)] p-[10px] shadow-sm group-hover:shadow-md transition-shadow">
                <div className="relative w-full h-full overflow-hidden bg-[var(--color-dark-bg)]">
                  {item.imageUrl?.includes("type=pdf") ? (
                    <>
                      <iframe 
                        src={`${item.imageUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 pointer-events-none" 
                        title={item.title} 
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                    </>
                  ) : (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-[15px]">
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-[var(--color-text-dark)] uppercase tracking-[1px] mb-[5px]">
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-text-light)] text-[12px] uppercase font-bold tracking-wider text-[var(--color-primary)]">
                    {item.issuer}
                  </p>
                  <p className="text-[var(--color-text-light)] text-[11px] mt-1">
                    Issued: {item.date}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
