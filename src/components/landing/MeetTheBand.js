"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Music, Mic2, Star } from "lucide-react";

export default function MeetTheBand() {
  const members = [
    {
      name: "Julian Dewantara",
      role: "Founder & Lead Keyboardist",
      desc: "Lulusan Konservatori Musik Klasik dengan pengalaman 10+ tahun memimpin aransemen panggung. Julian adalah arsitek nada di balik harmoni megah JD Music.",
      specialty: "Piano & Music Director",
      icon: <Music className="w-5 h-5 text-gold" />
    },
    {
      name: "Giselle Amanda",
      role: "Lead Female Vocalist",
      desc: "Penyanyi bersuara Soprano hangat dan berkarakter romantis. Giselle berspesialisasi dalam lagu-lagu pop ballad nasional dan jazz standards.",
      specialty: "Soprano & Acoustic Jazz",
      icon: <Mic2 className="w-5 h-5 text-gold" />
    },
    {
      name: "Ronaldo Sirait",
      role: "Lead Male Vocalist",
      desc: "Memiliki warna vokal baritone yang berat, hangat, dan bertenaga. Ronaldo sangat piawai membawakan lagu-lagu slow rock romantis serta pop kekinian.",
      specialty: "Baritone & Pop Soul",
      icon: <Mic2 className="w-5 h-5 text-gold" />
    },
    {
      name: "Fikri Pratama",
      role: "Saxophonist & Flutist",
      desc: "Musisi tiup dengan tiupan saxophone yang sangat mendalam dan romantis. Kehadirannya selalu sukses memberikan nuansa mewah khas intimate party.",
      specialty: "Saxophone & Flute",
      icon: <Music className="w-5 h-5 text-gold" />
    },
    {
      name: "Rian Hidayat",
      role: "Lead Guitarist",
      desc: "Menguasai permainan gitar akustik yang lembut hingga solo melodi gitar elektrik yang dinamis untuk menghidupkan suasana dansa para tamu.",
      specialty: "Acoustic & Electric Guitar",
      icon: <Music className="w-5 h-5 text-gold" />
    },
    {
      name: "Denny Wijaya",
      role: "Bassist & Sound Engineer",
      desc: "Menjaga ritme panggung tetap kokoh sekaligus memastikan seluruh output tata suara sound system terdengar jernih dan nyaman di telinga para tamu.",
      specialty: "Bass & Audio Engineering",
      icon: <Music className="w-5 h-5 text-gold" />
    }
  ];

  return (
    <section id="team" className="relative section-padding overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-radial-organic-glow opacity-30 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with generous whitespace */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center space-x-1 text-gold text-xs font-semibold tracking-[0.25em] uppercase">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>Meet The Band</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white leading-tight">
            Musisi Profesional <br className="hidden sm:inline" />
            Di Balik Hari Bahagia Anda
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Keaslian dan dedikasi musik tanpa *playback*. Kenali lebih dekat para musisi profesional JD Music Entertainment yang akan tampil langsung menghibur tamu pernikahan Anda.
          </p>
        </div>

        {/* Members Grid with luxurious padding */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="soft-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                
                {/* Header details */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                      {member.name}
                    </h3>
                    <span className="text-[10px] sm:text-xs font-semibold text-gold tracking-wider uppercase block">
                      {member.role}
                    </span>
                  </div>
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/10">
                    {member.icon}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {member.desc}
                </p>
              </div>

              {/* Footer Specialty */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                  Spesialisasi
                </span>
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                  <span>{member.specialty}</span>
                </span>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
