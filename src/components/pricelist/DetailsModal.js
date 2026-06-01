"use client";

import React, { useEffect } from "react";
import { X, Users, Disc, Shield, MapPin, Zap, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatIDR } from "@/lib/utils";

export default function DetailsModal({ isOpen, pkg, onClose, onBook }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !pkg) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Strict Full Screen Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        />

        {/* Modal Panel content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto hide-scrollbar bg-[#0a0f1e] rounded-3xl border border-white/10 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-10 mx-4"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors focus:outline-none"
            aria-label="Tutup Detail"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="space-y-2 mb-6 pr-8">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold">
              Spesifikasi Lengkap
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              {pkg.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {pkg.tagline}
            </p>
          </div>

          {/* Modal Specs Content */}
          <div className="space-y-6 text-sm sm:text-base">
            {/* Price block */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
              <span className="text-xs sm:text-sm text-slate-400 font-medium">Harga Penawaran:</span>
              <span className="font-heading font-extrabold text-lg sm:text-2xl text-gold">
                {formatIDR(pkg.price)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Personnel detail */}
              <div className="space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center space-x-2 text-gold">
                  <Users className="w-4 h-4" />
                  <h4 className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider">Daftar Personil</h4>
                </div>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-1 pl-1">
                  {pkg.specifications.personnel.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* Instruments detail */}
              <div className="space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center space-x-2 text-gold">
                  <Disc className="w-4 h-4 animate-spin-slow" />
                  <h4 className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider">Alat Musik & Gear</h4>
                </div>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-1 pl-1">
                  {pkg.specifications.equipment.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              {/* Area Coverages */}
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300">Cakupan Wilayah</h4>
                  <p className="text-xs sm:text-sm text-slate-400">{pkg.specifications.area}</p>
                </div>
              </div>

              {/* Technical Riders (Kelistrikan) */}
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300">Rider Teknis (Daya Listrik)</h4>
                  <p className="text-xs sm:text-sm text-slate-400">{pkg.specifications.technicalRiders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer CTA */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all"
            >
              Kembali
            </button>
            <button
              onClick={() => {
                onBook(pkg);
                onClose();
              }}
              className="flex-grow flex items-center justify-center space-x-2 py-3 px-6 rounded-xl text-xs sm:text-sm font-bold text-navy-dark bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-600 hover:to-gold active:scale-[0.98] transition-all shadow-lg shadow-gold/10"
            >
              <Calendar className="w-4 h-4" />
              <span>Booking Paket Musik Ini</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
