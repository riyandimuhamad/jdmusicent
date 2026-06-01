"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Music, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear() || 2026;

  if (pathname.startsWith('/demo')) return null;

  return (
    <footer className="bg-navy-dark border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Column 1: Brand Profile */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-md shadow-md shadow-gold/20 group-hover:scale-105 transition-all duration-300 overflow-hidden bg-gold">
                <Image 
                  src="/logo-3d.png" 
                  alt="JD Music Logo" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-heading font-extrabold text-sm sm:text-base tracking-wide bg-gradient-to-r from-white via-slate-100 to-gold bg-clip-text text-transparent group-hover:opacity-90 transition-opacity leading-none pb-1">
                  JD Music
                </span>
                <span className="text-[10px] sm:text-[11px] tracking-widest text-silver-dark font-medium leading-none">
                  Entertainment
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed pt-2">
              Penyedia layanan live band pernikahan dan hiburan musik premium terbaik. Kami menghadirkan aransemen megah dan harmoni tak terlupakan untuk hari bahagia Anda.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4 pt-2">
              <a
                href="https://instagram.com/jdmusic_ent"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-gold hover:border-gold/30 hover:scale-105 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-gold hover:border-gold/30 hover:scale-105 transition-all duration-300"
                aria-label="Youtube"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
                  <polygon points="10 15 15 12 10 9"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Layanan Utama
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricelist" className="text-sm text-slate-400 hover:text-gold transition-colors">
                  Acoustic Package
                </Link>
              </li>
              <li>
                <Link href="/pricelist" className="text-sm text-slate-400 hover:text-gold transition-colors">
                  Full Band Package
                </Link>
              </li>
              <li>
                <Link href="/pricelist" className="text-sm text-slate-400 hover:text-gold transition-colors">
                  Premium Concert Band
                </Link>
              </li>
              <li>
                <Link href="/undangan" className="text-sm text-slate-400 hover:text-gold transition-colors">
                  Undangan Digital Bundling
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Tautan Cepat
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate-400 hover:text-gold transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/pricelist" className="text-sm text-slate-400 hover:text-gold transition-colors">
                  Daftar Harga & Paket
                </Link>
              </li>
              <li>
                <Link href="/undangan" className="text-sm text-slate-400 hover:text-gold transition-colors">
                  Template Undangan
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-sm text-slate-400 hover:text-gold transition-colors">
                  Booking Sekarang
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Hubungi Kami
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Bandung, Jawa Barat, Indonesia</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WA || "6285147746761"}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                  +62 851-4774-6761
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:info@jdmusic.ent" className="hover:text-gold transition-colors">
                  info@jdmusic.ent
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-400">
                <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Setiap Hari: 09.00 - 21.00 WIB</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} JD Music Entertainment. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-slate-500">
            <Link href="/" className="hover:text-gold transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/" className="hover:text-gold transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
