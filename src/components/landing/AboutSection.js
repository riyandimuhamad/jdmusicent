"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Heart, Award, Sparkles } from "lucide-react";

export default function AboutSection() {
  const stats = [
    { value: "500+", label: "Pernikahan Sukses" },
    { value: "8+", label: "Tahun Pengalaman" },
    { value: "100%", label: "Tingkat Kepuasan" },
  ];

  const coreValues = [
    {
      icon: <Award className="w-5 h-5 text-gold animate-pulse" />,
      title: "Musisi Profesional & Jam Terbang Tinggi",
      description: "Seluruh personil kami merupakan alumni akademis konservatori musik dan berjam terbang tinggi mengiringi berbagai wedding internasional."
    },
    {
      icon: <Heart className="w-5 h-5 text-gold" />,
      title: "Aransemen Musik Khusus (Personal)",
      description: "Setiap pasangan memiliki lagu favorit tersendiri. Kami mengaransemen daftar lagu kesukaan Anda secara personal untuk momen dansa romantis."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-gold" />,
      title: "Audio Gears & Tata Suara Premium",
      description: "Membawa standard perlengkapan panggung profesional untuk menjamin suara instrumen terdengar jernih, empuk, dan nyaman di telinga."
    }
  ];

  return (
    <section id="about" className="relative section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section with elegant serif typography and generous spacing */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-24 space-y-4">
          <div className="inline-flex items-center space-x-1.5 text-gold text-xs font-semibold tracking-[0.25em] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tentang JD Music</span>
          </div>
          <h2 className="font-serif font-extrabold text-3xl sm:text-5xl text-white leading-tight">
            Harmoni Indah Pengiring <br className="hidden sm:inline" /> Momen Terindah Sekali Seumur Hidup
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Berdiri sejak 2017, JD Music Entertainment didirikan dengan satu komitmen sederhana: menyuguhkan pertunjukan live musik panggung pernikahan yang jujur, menyentuh kalbu, dan berkelas tinggi.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Core Values */}
          <div className="lg:col-span-7 space-y-8">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
              Prinsip Layanan Kami
            </h3>
            <div className="space-y-6">
              {coreValues.map((value, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex space-x-5 p-6 rounded-3xl soft-card"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/15">
                    {value.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                      {value.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Narrative Card & Stats */}
          <div className="lg:col-span-5 space-y-8 lg:pl-6">
            <div className="soft-card p-8 sm:p-10 rounded-3xl border border-gold/10 glow-warm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-radial-organic-glow opacity-30 pointer-events-none" />
              
              <h3 className="font-serif font-bold text-lg sm:text-xl text-white mb-4">
                Dedikasi Musisi Kami
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
                Pesta pernikahan adalah perayaan cinta. Itulah mengapa kami berkoordinasi secara aktif dengan Wedding Organizer Anda berminggu-minggu sebelum hari H. Mulai dari sinkronisasi waktu pertunjukan, pengaturan layout panggung, hingga persiapan daftar putar khusus (wedding playlist) demi memastikan pesta pernikahan berjalan sempurna dan berkesan.
              </p>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center space-y-1">
                    <div className="font-serif font-extrabold text-2xl sm:text-4xl text-gold bg-gradient-to-r from-gold to-gold-warm bg-clip-text text-transparent text-glow-warm">
                      {stat.value}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
