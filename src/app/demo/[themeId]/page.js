"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import themesData from "@/data/themes.json";
import { MapPin, Calendar, Clock, Heart, Music, ChevronDown, User, Gift, CreditCard, Send, Camera } from "lucide-react";

// --- ANIMATION WRAPPER COMPONENT ---
function FadeInSection({ children, delay = 0 }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(domRef.current);
        }
      });
    }, { threshold: 0.1 });
    
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function ThemeDemoPage() {
  const params = useParams();
  const router = useRouter();
  const themeId = params.themeId;
  
  const [theme, setTheme] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Resolve theme ID from URL
    const foundTheme = themesData.find((t) => t.id === themeId);
    if (foundTheme) {
      setTheme(foundTheme);
    }
  }, [themeId]);

  if (!theme) {
    return (
      <div className="min-h-screen bg-navy-dark flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="animate-pulse text-sm font-semibold tracking-widest text-gold">MEMUAT MESIN TEMA...</p>
      </div>
    );
  }

  // --- THEME ENGINE: DYNAMIC CSS VARIABLES ---
  // We map the color array from themes.json into reliable CSS properties
  // Colors array structure: [Primary, Background, Accent, Text]
  const themeStyles = {
    "--color-primary": theme.colors[0],
    "--color-bg": theme.colors[1],
    "--color-accent": theme.colors[2],
    "--color-text": theme.colors[3],
  };

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true);
    // Note: Audio player logic will be integrated here later
  };

  return (
    <div 
      className="min-h-screen w-full relative overflow-x-hidden transition-colors duration-500" 
      style={themeStyles}
    >
      {/* Background fill */}
      <div 
        className="fixed inset-0 z-[-1]" 
        style={{ backgroundColor: 'var(--color-bg)' }}
      />
      
      {/* Global Utility Classes specifically for this Engine */}
      <style jsx global>{`
        .theme-text { color: var(--color-text); }
        .theme-bg-primary { background-color: var(--color-primary); }
        .theme-bg-accent { background-color: var(--color-accent); }
        .theme-text-primary { color: var(--color-primary); }
        .theme-text-accent { color: var(--color-accent); }
        .theme-border-accent { border-color: var(--color-accent); }
        .theme-border-primary { border-color: var(--color-primary); }
      `}</style>

      {/* --- LAYER 1: COVER (WELCOME SCREEN) --- */}
      <div 
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] ${isOpen ? '-translate-y-full shadow-2xl' : 'translate-y-0'}`} 
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        {/* Decorative Top/Bottom (Simulating Traditional Pattern placement) */}
        <div className="absolute top-0 left-0 w-full h-32 opacity-10" style={{ backgroundColor: 'var(--color-primary)' }} />
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-10" style={{ backgroundColor: 'var(--color-primary)' }} />

        <div className="z-10 text-center px-6 flex flex-col items-center w-full max-w-sm">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] theme-text-accent mb-4 border border-[var(--color-accent)] px-4 py-1 rounded-full">
            {theme.name}
          </span>
          <p className="theme-text text-sm tracking-widest uppercase mb-4">Pernikahan</p>
          <h1 className="font-heading text-5xl sm:text-6xl theme-text-primary mb-6">
            Romeo & Juliet
          </h1>
          <p className="theme-text text-sm mb-12 italic">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          
          <div className="p-4 px-8 border-b-2 theme-border-accent mb-12 w-full">
            <p className="theme-text font-extrabold text-xl">Tamu Kehormatan</p>
          </div>

          <button 
            onClick={handleOpenInvitation}
            className="flex items-center space-x-2 px-8 py-3.5 rounded-full theme-bg-primary text-white shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:scale-105 transition-all active:scale-95"
          >
            <Heart className="w-4 h-4 fill-current animate-pulse" />
            <span className="font-semibold tracking-wide">Buka Undangan</span>
          </button>
        </div>
      </div>

      {/* --- LAYER 2: INVITATION CONTENT (MOBILE-FIRST LAYOUT) --- */}
      <main 
        className={`w-full max-w-[480px] mx-auto min-h-screen relative shadow-2xl transition-opacity duration-1000 delay-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        
        {/* Floating Audio Control */}
        <div className={`fixed bottom-6 right-6 z-40 transition-all duration-700 delay-1000 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full theme-bg-accent text-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-transform"
          >
            <Music className={`w-5 h-5 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
          </button>
        </div>

        {/* Hero Section */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 10%, transparent 70%)' }} />
          
          <div className="relative z-10 flex flex-col items-center mt-12">
            <FadeInSection>
              <p className="theme-text text-xs tracking-[0.3em] uppercase mb-4 font-semibold">The Wedding Of</p>
            </FadeInSection>
            
            <FadeInSection delay={200}>
              <h2 className="font-heading text-6xl sm:text-7xl theme-text-primary mb-6 drop-shadow-sm">R & J</h2>
            </FadeInSection>
            
            <FadeInSection delay={400}>
              <p className="theme-text text-sm leading-relaxed max-w-[280px] mx-auto mb-12 italic opacity-80">
                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri..."
              </p>
            </FadeInSection>

            <FadeInSection delay={600}>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-px h-24 theme-bg-accent opacity-40 mx-auto" />
                <ChevronDown className="w-6 h-6 theme-text-accent animate-bounce mx-auto" />
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Couple Section */}
        <section className="py-24 px-8 text-center border-t border-[var(--color-primary)]/10" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
          <FadeInSection>
            <h3 className="font-heading text-4xl theme-text-primary mb-16">Mempelai</h3>
          </FadeInSection>
          
          <div className="flex flex-col items-center space-y-16">
            {/* Groom */}
            <FadeInSection delay={100}>
              <div className="flex flex-col items-center group">
                <div className="w-40 h-40 rounded-full p-1.5 mb-6 border-2 theme-border-accent relative shadow-xl">
                  <div className="absolute inset-[-8px] border border-dashed theme-border-primary rounded-full animate-[spin_30s_linear_infinite]" />
                  <div className="w-full h-full rounded-full bg-slate-200/50 overflow-hidden flex items-center justify-center relative">
                    <User className="w-16 h-16 theme-text opacity-30" />
                  </div>
                </div>
                <h4 className="font-heading text-3xl theme-text font-bold mb-2">Romeo Montague</h4>
                <p className="theme-text text-sm opacity-80 font-medium">Putra pertama dari Kel. Bapak X & Ibu Y</p>
              </div>
            </FadeInSection>

            <FadeInSection>
              <span className="font-heading text-6xl theme-text-accent drop-shadow-md">&</span>
            </FadeInSection>

            {/* Bride */}
            <FadeInSection delay={100}>
              <div className="flex flex-col items-center group">
                <div className="w-40 h-40 rounded-full p-1.5 mb-6 border-2 theme-border-accent relative shadow-xl">
                  <div className="absolute inset-[-8px] border border-dashed theme-border-primary rounded-full animate-[spin_30s_linear_infinite_reverse]" />
                  <div className="w-full h-full rounded-full bg-slate-200/50 overflow-hidden flex items-center justify-center relative">
                    <User className="w-16 h-16 theme-text opacity-30" />
                  </div>
                </div>
                <h4 className="font-heading text-3xl theme-text font-bold mb-2">Juliet Capulet</h4>
                <p className="theme-text text-sm opacity-80 font-medium">Putri pertama dari Kel. Bapak A & Ibu B</p>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Live Countdown Section */}
        <section className="py-20 px-6 theme-bg-primary text-[var(--color-bg)] text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          <FadeInSection>
            <h3 className="font-heading text-2xl mb-8 tracking-widest uppercase">Menuju Hari Bahagia</h3>
          </FadeInSection>
          <FadeInSection delay={200}>
            <div className="flex items-center justify-center gap-3 relative z-10">
              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-bg)] text-[var(--color-primary)] shadow-xl">
                <span className="font-heading text-2xl font-bold">14</span>
                <span className="text-[10px] font-semibold uppercase">Hari</span>
              </div>
              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-bg)] text-[var(--color-primary)] shadow-xl">
                <span className="font-heading text-2xl font-bold">08</span>
                <span className="text-[10px] font-semibold uppercase">Jam</span>
              </div>
              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-bg)] text-[var(--color-primary)] shadow-xl">
                <span className="font-heading text-2xl font-bold">45</span>
                <span className="text-[10px] font-semibold uppercase">Menit</span>
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* Event Section */}
        <section className="py-24 px-6 relative">
          <FadeInSection>
            <div className="text-center mb-16">
              <h3 className="font-heading text-4xl theme-text-primary mb-3">Pelaksanaan Acara</h3>
              <p className="theme-text text-sm opacity-75">Dengan memohon rahmat Allah SWT</p>
            </div>
          </FadeInSection>

          <div className="space-y-8 relative z-10">
            {/* Akad */}
            <FadeInSection delay={100}>
              <div className="rounded-[2rem] p-8 text-center shadow-2xl bg-white/60 border border-white/60 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="absolute top-0 left-0 w-2 h-full theme-bg-primary" />
                <h4 className="font-heading text-2xl theme-text-primary font-bold mb-6 uppercase tracking-widest">Akad Nikah</h4>
                <div className="flex flex-col items-center space-y-4 mb-8 theme-text">
                  <div className="flex items-center space-x-3 bg-white/50 px-4 py-2 rounded-full w-full justify-center">
                    <Calendar className="w-4 h-4 theme-text-accent" />
                    <span className="text-sm font-semibold">Minggu, 19 Juli 2026</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/50 px-4 py-2 rounded-full w-full justify-center">
                    <Clock className="w-4 h-4 theme-text-accent" />
                    <span className="text-sm font-semibold">08:00 WIB - Selesai</span>
                  </div>
                </div>
                <button className="px-8 py-3.5 rounded-full theme-bg-primary text-[var(--color-bg)] text-xs font-bold uppercase tracking-wider w-full">
                  Simpan ke Kalender
                </button>
              </div>
            </FadeInSection>

            {/* Resepsi */}
            <FadeInSection delay={300}>
              <div className="rounded-[2rem] p-8 text-center shadow-2xl bg-white/60 border border-white/60 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="absolute top-0 right-0 w-2 h-full theme-bg-accent" />
                <h4 className="font-heading text-2xl theme-text-accent font-bold mb-6 uppercase tracking-widest">Resepsi</h4>
                <div className="flex flex-col items-center space-y-4 mb-8 theme-text">
                  <div className="flex items-center space-x-3 bg-white/50 px-4 py-2 rounded-full w-full justify-center">
                    <Calendar className="w-4 h-4 theme-text-primary" />
                    <span className="text-sm font-semibold">Minggu, 19 Juli 2026</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/50 px-4 py-2 rounded-full w-full justify-center">
                    <Clock className="w-4 h-4 theme-text-primary" />
                    <span className="text-sm font-semibold">11:00 WIB - Selesai</span>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2 mb-8 theme-text bg-white/50 p-5 rounded-2xl">
                  <MapPin className="w-6 h-6 theme-text-accent mb-2" />
                  <span className="text-base font-extrabold uppercase">Ballroom Hotel Harmoni</span>
                  <span className="text-xs opacity-75">Jl. Raya Pasundan No. 123, Jawa Barat</span>
                </div>
                <button className="px-8 py-3.5 rounded-full theme-bg-accent text-[var(--color-bg)] text-xs font-bold uppercase tracking-wider w-full">
                  Buka Google Maps
                </button>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 px-6 border-t border-[var(--color-primary)]/10" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
          <FadeInSection>
            <div className="text-center mb-12">
              <h3 className="font-heading text-4xl theme-text-primary mb-3">Galeri Cinta</h3>
              <p className="theme-text text-sm opacity-75">Momen-momen bahagia kami</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={200}>
            <div className="columns-2 gap-4 space-y-4">
              <div className="w-full h-48 bg-black/10 rounded-2xl flex items-center justify-center overflow-hidden relative">
                <Camera className="w-6 h-6 theme-text opacity-20" />
              </div>
              <div className="w-full h-64 bg-black/10 rounded-2xl flex items-center justify-center overflow-hidden relative">
                <Camera className="w-6 h-6 theme-text opacity-20" />
              </div>
              <div className="w-full h-56 bg-black/10 rounded-2xl flex items-center justify-center overflow-hidden relative">
                <Camera className="w-6 h-6 theme-text opacity-20" />
              </div>
              <div className="w-full h-40 bg-black/10 rounded-2xl flex items-center justify-center overflow-hidden relative">
                <Camera className="w-6 h-6 theme-text opacity-20" />
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* RSVP Form */}
        <section className="py-20 px-6 border-t border-[var(--color-primary)]/10" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
          <FadeInSection>
            <div className="text-center mb-12">
              <h3 className="font-heading text-4xl theme-text-primary mb-3">Kehadiran</h3>
              <p className="theme-text text-sm opacity-75">Konfirmasi kehadiran Anda</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={200}>
            <div className="bg-white/60 p-8 rounded-[2rem] shadow-xl border border-white/60">
              <form className="space-y-5">
                <div>
                  <input type="text" placeholder="Nama Lengkap" className="w-full px-5 py-3.5 rounded-xl bg-white/50 border border-white/40 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
                <div>
                  <select className="w-full px-5 py-3.5 rounded-xl bg-white/50 border border-white/40 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] appearance-none">
                    <option value="">Apakah Anda akan hadir?</option>
                    <option value="hadir">Ya, Saya akan hadir</option>
                    <option value="tidak">Maaf, Saya tidak bisa hadir</option>
                  </select>
                </div>
                <button type="button" className="w-full py-4 rounded-xl theme-bg-primary text-white font-bold tracking-widest uppercase text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Kirim Konfirmasi</span>
                </button>
              </form>
            </div>
          </FadeInSection>
        </section>

        {/* Footer */}
        <footer className="py-20 text-center theme-bg-primary text-[var(--color-bg)] relative border-t-8 theme-border-accent overflow-hidden">
          <FadeInSection>
            <p className="text-sm mb-4 opacity-90 px-8 italic max-w-[300px] mx-auto">
              "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu berkenan hadir."
            </p>
          </FadeInSection>
          <FadeInSection delay={200}>
            <h3 className="font-heading text-5xl mt-10 mb-12">R & J</h3>
          </FadeInSection>
          <button 
            onClick={() => router.push('/undangan')}
            className="relative z-10 mb-12 px-8 py-3 rounded-full border-2 border-white/30 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            Kembali ke Katalog
          </button>
          <p className="text-[10px] opacity-60 uppercase tracking-widest">Powered by JD Music Entertainment</p>
        </footer>
      </main>
    </div>
  );
}
