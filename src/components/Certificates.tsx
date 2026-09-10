"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Certificates({ certificates = [] }: { certificates?: any[] }) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="certificates" className="pt-[100px] pb-[40px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] flex-1 flex flex-col justify-center overflow-hidden min-h-screen">
      
      {/* Header section */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[80px] gap-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2, margin: "-100px" }}
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
            A collection of professional certifications and verified credentials synced from GitHub.
          </p>
        </div>

        <div className="flex justify-end w-full md:w-auto">
          <a 
            href="https://github.com/ZAndrie/portfolio-contents/tree/main/certificates" 
            target="_blank" 
            rel="noreferrer"
            className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-[10px]"
          >
            VIEW REPOSITORY <span className="text-[var(--color-primary)] text-lg leading-none font-light">→</span>
          </a>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]"
        layout
      >
        <AnimatePresence mode="popLayout">
          {certificates.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-center py-20 px-8 bg-white/60 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[var(--color-light-bg)] flex items-center justify-center text-[var(--color-primary)] text-xl mb-5 border border-[var(--color-border)]">
                ✦
              </div>
              <h3 className="text-xl md:text-2xl font-serif text-[var(--color-text-dark)] mb-3">
                Certifications &amp; Credentials
              </h3>
              <p className="text-[14px] text-[var(--color-text-light)] max-w-lg font-light leading-relaxed mb-6">
                Official certificates and professional credentials are currently being updated and cataloged. You can explore verified records and repositories directly on GitHub.
              </p>
              <a
                href="https://github.com/ZAndrie/portfolio-contents/tree/main/certificates"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 bg-[var(--color-primary)] text-white text-[11px] font-bold uppercase tracking-[2px] rounded-full hover:bg-[var(--color-text-dark)] transition-all shadow-sm hover:shadow"
              >
                View Verified Credentials ↗
              </a>
            </div>
          ) : certificates.map((item, index) => {
            const imageSrc = imageErrors[item.id] ? "/download/Development.jpg" : item.imageUrl;
            const isExternal = imageSrc?.startsWith("http");

            return (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer flex flex-col justify-between"
              >
                <div>
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
                          src={imageSrc}
                          alt={item.title}
                          fill
                          unoptimized={isExternal}
                          onError={() => handleImageError(item.id)}
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
                </div>

                {item.repoUrl && (
                  <div className="mt-4 pt-2 border-t border-[var(--color-border)]/50">
                    <a 
                      href={item.repoUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[10px] uppercase font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                    >
                      View on GitHub ↗
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
