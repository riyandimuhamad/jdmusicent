"use client";

import React, { useState } from "react";
import { Camera, Music, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "Semua Dokumentasi" },
    { id: "wedding", label: "Pernikahan" },
    { id: "corporate", label: "Corporate Gathering" },
    { id: "intimate", label: "Intimate Stage" }
  ];

  const galleryItems = [
    {
      id: 1,
      category: "wedding",
      title: "Sheraton Grand Ballroom",
      subtitle: "Full Concert Band & Custom Lighting System",
      color: "from-blue-900 via-slate-900 to-navy-dark"
    },
    {
      id: 2,
      category: "corporate",
      title: "Telkomsel Annual Gala",
      subtitle: "Corporate Anniversary Show - Premium Acoustics",
      color: "from-red-950 via-slate-900 to-navy-dark"
    },
    {
      id: 3,
      category: "wedding",
      title: "Botanica Garden Wedding",
      subtitle: "Romantic Outdoor Wedding - Acoustic Setup",
      color: "from-emerald-950 via-slate-900 to-navy-dark"
    },
    {
      id: 4,
      category: "intimate",
      title: "Dago Tea House Concert",
      subtitle: "Intimate Music Night - Full Orchestral Band",
      color: "from-purple-950 via-slate-900 to-navy-dark"
    },
    {
      id: 5,
      category: "corporate",
      title: "Bank Mandiri Dinners",
      subtitle: "Executive Dinner Gathering - Jazz Quartet",
      color: "from-amber-950 via-slate-900 to-navy-dark"
    },
    {
      id: 6,
      category: "wedding",
      title: "Sasono Utomo Cultural Hall",
      subtitle: "Traditional-Modern Wedding - Premium Brass Band",
      color: "from-orange-950 via-slate-900 to-navy-dark"
    }
  ];

  const filteredItems = activeCategory === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="relative section-padding overflow-hidden bg-navy-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section with generous whitespace */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center space-x-1 text-gold text-xs font-semibold tracking-[0.25em] uppercase">
            <Camera className="w-3.5 h-3.5" />
            <span>Dokumentasi Panggung</span>
          </div>
          <h2 className="font-serif font-extrabold text-3xl sm:text-5xl text-white leading-tight">
            Keindahan Nada Yang Tertangkap
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Lihat cuplikan atmosfer panggung kami saat memeriahkan hari istimewa para klien di berbagai tempat pertunjukan termewah.
          </p>
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-500 ease-out border focus:outline-none",
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-gold to-gold-warm border-gold text-navy-dark font-semibold shadow-lg shadow-gold/10"
                  : "bg-white/[0.03] border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                key={item.id}
                className="group relative h-80 rounded-[2rem] overflow-hidden soft-card border border-white/5"
              >
                {/* Visual Backdrop with 0.7s smooth transition */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-50 group-hover:scale-105 transition-transform duration-[800ms] ease-out",
                  item.color
                )} />

                {/* Ambient Soft stage light visual */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-black/90 z-10 pointer-events-none" />

                {/* Icon block */}
                <div className="absolute top-6 right-6 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10 z-20 group-hover:scale-110 group-hover:border-gold/30 transition-all duration-500">
                  <Music className="w-4 h-4 text-slate-400 group-hover:text-gold transition-colors" />
                </div>

                {/* Card Title details */}
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-navy-dark via-navy-dark/95 to-transparent pt-24 z-20">
                  <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-gold mb-1.5 block">
                    {item.category === "wedding" ? "💍 Pernikahan" : item.category === "corporate" ? "🏢 Korporasi" : "🎤 Intimate"}
                  </span>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-white leading-tight mb-2 group-hover:text-gold transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
