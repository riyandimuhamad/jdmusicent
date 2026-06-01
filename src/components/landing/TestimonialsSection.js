"use client";

import React from "react";
import { MessageSquare, Star, Quote, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Anisa & Randy",
      role: "Klien Wedding Baru",
      event: "Pernikahan di Sheraton Grand Ballroom Bandung",
      rating: 5,
      quote: "JD Music Entertainment benar-benar luar biasa! Dari pertama konsultasi hingga hari H, koordinasinya sangat lancar. Lagu request kami diaransemen dengan sangat menyentuh. Seluruh tamu memuji vokal dan kejernihan suaranya!",
      date: "Maret 2026"
    },
    {
      name: "Budi Santoso",
      role: "Wedding Planner / Owner Smile EO",
      event: "Corporate Gathering & Wedding Vendor Partners",
      rating: 5,
      quote: "Sebagai EO, saya sangat kritis memilih vendor musik karena itu nyawa acara. JD Music adalah salah satu dari sedikit vendor yang 100% tepat waktu, riders-nya tidak merepotkan, dan personilnya sangat kooperatif di lapangan. Sangat direkomendasikan!",
      date: "Januari 2026"
    },
    {
      name: "Siti & Adam",
      role: "Klien Bundling Musik + Undangan Digital",
      event: "Pernikahan Intimate di Dago Tea House",
      rating: 5,
      quote: "Paket bundling undangan digital-nya juara! Desain undangannya elegan banget (kami pakai Navy Gold) dan proses input datanya gampang sekali. Kami hemat banyak uang dan waktu dibanding beli terpisah. Band musiknya juga tampil enerjik!",
      date: "Mei 2026"
    }
  ];

  return (
    <section id="testimonials" className="relative section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section with generous spacing */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-24 space-y-4">
          <div className="inline-flex items-center space-x-1.5 text-gold text-xs font-semibold tracking-[0.25em] uppercase">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Testimoni Klien</span>
          </div>
          <h2 className="font-serif font-extrabold text-3xl sm:text-5xl text-white leading-tight">
            Kisah Bahagia & <br /> Rekomendasi Jujur Klien Kami
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Kepuasan dan senyuman di hari bahagia Anda adalah motivasi terbesar kami untuk terus berkarya menyajikan musik berkualitas.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative soft-card p-8 sm:p-10 rounded-3xl flex flex-col justify-between"
            >
              {/* Internal Quote Icon with soft overlay */}
              <div className="absolute top-6 right-6 opacity-[0.03] text-slate-300 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                <Quote className="w-20 h-20" />
              </div>

              <div className="space-y-6">
                {/* Star Ratings */}
                <div className="flex items-center space-x-1.5">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic relative z-10">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              {/* Client Profile details */}
              <div className="mt-10 pt-6 border-t border-white/5 flex flex-col space-y-1">
                <h4 className="font-serif font-bold text-base text-white">
                  {test.name}
                </h4>
                <span className="text-[10px] sm:text-xs text-gold font-medium tracking-wide uppercase">
                  {test.role}
                </span>
                <span className="text-xs text-slate-500 font-medium pt-1 leading-normal">
                  {test.event} ({test.date})
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA section under testimonials */}
        <div className="text-center mt-20 sm:mt-24">
          <p className="text-slate-400 text-sm">
            Ingin mewujudkan resepsi pernikahan impian Anda?{" "}
            <a href="/booking" className="text-gold font-bold hover:underline hover:text-gold-warm transition-colors duration-300">
              Diskusikan Jadwal Acara Anda &rarr;
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}
