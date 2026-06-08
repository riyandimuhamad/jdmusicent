"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden py-24 sm:py-32 px-4">
      {/* Visual Storytelling Live Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Soft luxurious dark mask, made slightly transparent to let global aurora shine through */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/60 via-navy-dark/75 to-navy-dark/90 z-10 pointer-events-none" />
        
        {/* High-quality performance stage video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none scale-100"
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-band-performing-on-stage-under-lights-34446-large.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
      </div>



      <div className="max-w-5xl mx-auto text-center relative z-20 space-y-10 mt-8 sm:mt-12">
        {/* Subtitle Elegant Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.03] border border-gold/25 text-gold text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase"
        >
          <Sparkles className="w-4 h-4 text-gold animate-spin" />
          <span>Premium Wedding Live Band & Undangan Digital</span>
        </motion.div>

        {/* Title utilizing elegant Serif Font */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] sm:leading-none text-white max-w-4xl mx-auto"
          >
            Harmoni Cinta dalam <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-gold via-gold-champagne to-electric bg-clip-text text-transparent text-glow-warm">
              Nada Terbaik
            </span>
          </motion.h1>
        </div>

        {/* Spacious luxurious description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed px-4"
        >
          JD Music Entertainment mengawinkan keanggunan pertunjukan aransemen live musik berkelas nasional dengan kepraktisan paket bundling sistem undangan digital premium.
        </motion.p>

        {/* CTA Buttons with soft hover delay micro-interactions */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4 px-4"
        >
          <Link
            href="/pricelist"
            className="flex items-center justify-center space-x-2 w-full sm:w-auto px-10 py-4.5 rounded-2xl font-bold text-gold bg-white/5 border border-gold/50 hover:bg-gold hover:text-navy-dark hover:border-gold hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 ease-out shadow-lg shadow-gold/5 hover:shadow-gold/20 group"
          >
            <span>Eksplorasi Paket Panggung</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link
            href="/booking"
            className="flex items-center justify-center space-x-2 w-full sm:w-auto px-10 py-4.5 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 ease-out"
          >
            <Play className="w-4 h-4 text-electric fill-electric" />
            <span>Konsultasi Penjadwalan</span>
          </Link>
        </motion.div>
      </div>

      {/* Spacious bottom blend */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-dark to-transparent pointer-events-none z-10" />
    </section>
  );
}
