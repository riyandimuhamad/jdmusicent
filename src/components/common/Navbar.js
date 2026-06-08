"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Paket & Pricelist", href: "/pricelist" },
    { name: "Undangan Digital", href: "/undangan" },
    { name: "Booking Acara", href: "/booking" },
  ];

  if (pathname.startsWith('/demo') || pathname.startsWith('/admin') || pathname.startsWith('/invite-wedding') || pathname.startsWith('/client-portal')) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-navy-dark/95 backdrop-blur-xl py-2 shadow-lg shadow-navy-dark/40 border-b border-white/5"
          : "bg-transparent py-3"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors relative py-2",
                    active
                      ? "text-gold font-semibold"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold to-yellow-500 rounded-full shadow-md shadow-gold/50" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Action Button */}
          <div className="hidden md:block">
            <Link
              href="/booking"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-navy-dark bg-gradient-to-r from-gold to-gold-champagne hover:from-yellow-500 hover:to-gold shadow-md shadow-gold/15 hover:shadow-gold/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Pesan Sekarang</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-[60px] z-40 transition-all duration-300 ease-in-out border-b border-white/5 shadow-2xl",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="glass-nav px-4 pt-4 pb-6 space-y-3">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "block px-4 py-3 rounded-xl text-base font-medium transition-all",
                  active
                    ? "text-gold bg-white/5 border-l-4 border-gold pl-3"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                )}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-white/5">
            <Link
              href="/booking"
              className="flex items-center justify-center space-x-2 w-full py-3.5 px-4 rounded-xl text-base font-semibold text-navy-dark bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-600 hover:to-gold shadow-lg shadow-gold/10"
            >
              <Calendar className="w-5 h-5" />
              <span>Pesan Sekarang</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
