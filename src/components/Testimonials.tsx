"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "CEO, TechStart",
      text: "Z Andrie is an incredible designer. He understood our vision perfectly and delivered a website that exceeded our expectations.",
      image: "/download/testimonial/person3.jpg",
    },
    {
      name: "Michael Chen",
      role: "Creative Director",
      text: "Professional, creative, and detail-oriented. The whole process was smooth from start to finish.",
      image: "/download/testimonial/person1.jpg",
    },
    {
      name: "Emily Davis",
      role: "Product Manager",
      text: "Our new website not only looks amazing but also performs exceptionally well. Highly recommended!",
      image: "/download/testimonial/person2.jpg",
    },
  ];

  return (
    <section id="testimonials" className="pt-[100px] pb-[40px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] border-t border-[var(--color-border)] flex-1 flex flex-col justify-center overflow-hidden">
      
      {/* Header */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[80px] gap-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
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
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-[var(--color-light-bg)] border border-[var(--color-border)] p-[40px] flex flex-col justify-between"
          >
            <div>
              <div className="text-[60px] font-serif text-[var(--color-primary)] opacity-40 leading-none h-[40px] mb-[10px]">
                “
              </div>
              <p className="text-[14px] leading-[1.8] text-[var(--color-text-dark)] mb-[40px]">
                {testimonial.text}
              </p>
            </div>
            
            <div className="flex items-center gap-[15px]">
              <div className="w-[45px] h-[45px] rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={45}
                  height={45}
                  className="w-full h-full object-cover grayscale"
                />
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
        ))}
      </div>
    </section>
  );
}
