"use client";

import React from "react";
import { Info, ArrowRight, Sparkles } from "lucide-react";
import { cn, formatIDR } from "@/lib/utils";

export default function PackageCard({ pkg, onShowDetails, onBook }) {
  return (
    <div
      className={cn(
        "bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/5 flex flex-col overflow-hidden transition-all duration-500 ease-out hover:shadow-black/40 hover:-translate-y-1 relative h-full",
        pkg.isPopular ? "border-white/10" : ""
      )}
    >
      {/* Elegant Popular Highlight Badge */}
      {pkg.isPopular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-gold-warm/80 to-gold/60 backdrop-blur-sm text-white px-5 py-1.5 rounded-bl-xl font-medium text-[10px] uppercase tracking-[0.2em] shadow-sm z-20 flex items-center space-x-1.5">
          <Sparkles className="w-3 h-3" />
          <span>Rekomendasi</span>
        </div>
      )}

      {/* Content Area with Generous Padding */}
      <div className="flex-1 p-6 md:p-8 flex flex-col relative z-10">
        
        {/* Package Header & Natural Price */}
        <div className="mb-5 border-b border-white/5 pb-5">
          <h3 className="font-serif font-semibold text-2xl md:text-3xl text-slate-100 tracking-wide uppercase mb-2">
            {pkg.name}
          </h3>
          <div className="flex flex-col mb-3">
            {pkg.originalPrice && pkg.originalPrice > pkg.price && (
              <div className="flex items-center space-x-2 mb-1">
                <div className="relative inline-block text-sm font-bold text-slate-400">
                  <span className="px-1">{formatIDR(pkg.originalPrice)}</span>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-[1.7px] bg-red-500 -rotate-6 absolute rounded-full"></div>
                    <div className="w-full h-[1.7px] bg-red-500 rotate-6 absolute rounded-full"></div>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/20 uppercase tracking-wider">
                  Diskon {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}%
                </span>
              </div>
            )}
            <div className="flex items-baseline space-x-2">
              <span className="font-heading font-medium text-xl text-gold-warm">
                {formatIDR(pkg.price)}
              </span>
              <span className="text-xs text-slate-500 font-light tracking-wide uppercase">
                / Acara
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-400 font-light leading-relaxed">
            {pkg.tagline}
          </p>
        </div>

        {/* Details Section */}
        <div className="space-y-5 flex-1">
          {/* Personnel */}
          <div>
            <h4 className="font-medium text-slate-500 text-[10px] tracking-[0.15em] uppercase mb-1.5">
              Personel
            </h4>
            <p className="text-slate-300 font-light leading-relaxed text-sm md:text-base">
              {pkg.members}
            </p>
          </div>

          {/* Included Features */}
          <div>
            <h4 className="font-medium text-slate-500 text-[10px] tracking-[0.15em] uppercase mb-1.5">
              Include
            </h4>
            <ul className="list-none space-y-2 text-slate-300 font-light text-sm md:text-base">
              {pkg.features.map((feat, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-gold-warm mr-3 mt-1 text-[10px]">✦</span>
                  <span className="leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Refined CTA Buttons */}
        <div className="mt-6 pt-5 border-t border-white/5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onBook(pkg)}
            className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg font-bold text-navy-dark bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-600 hover:to-gold transition-all duration-300 shadow-lg shadow-gold/15"
          >
            <span>Pilih Paket</span>
            <ArrowRight className="w-4 h-4 opacity-80" />
          </button>
          
          <button
            onClick={() => onShowDetails(pkg)}
            className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg font-medium text-slate-300 bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
          >
            <Info className="w-4 h-4 opacity-70" />
            <span>Detail Lengkap</span>
          </button>
        </div>
      </div>
      
    </div>
  );
}
