"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import themesData from "@/data/themes.json";
import { 
  MapPin, Calendar, Clock, Heart, Music, ChevronDown, User, Gift, 
  CreditCard, Send, Camera, Home, Users, Image as ImageIcon, Copy, CheckCircle
} from "lucide-react";

export default function ThemeDemoPage() {
  const params = useParams();
  const router = useRouter();
  const themeId = params.themeId;
  
  const [theme, setTheme] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const audioRef = useRef(null);

  // Live Countdown State (Including Seconds!)
  const [timeLeft, setTimeLeft] = useState({
    days: 14, hours: 8, minutes: 45, seconds: 0
  });

  useEffect(() => {
    const foundTheme = themesData.find((t) => t.id === themeId);
    if (foundTheme) setTheme(foundTheme);

    // Ticking Timer Logic
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [themeId]);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log(e));
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("123456789012");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!theme) return <div className="min-h-screen bg-navy-dark flex flex-col items-center justify-center text-white"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" /><p className="animate-pulse text-xs tracking-widest font-bold">MENGHUBUNGKAN TEMA...</p></div>;

  // --- V2 COLOR MAPPING STRATEGY ---
  const themeStyles = {
    "--color-bg": theme.colors[0],       // Main Background
    "--color-surface": theme.colors[1],  // Cards / Secondary Bg
    "--color-accent": theme.colors[2],   // Gold / Primary pop
    "--color-text": theme.colors[3],     // Text color (contrasting)
  };

  // --- FRAMER MOTION VARIANTS ---
  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, type: "spring", bounce: 0.3 } }
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden font-sans scroll-smooth" style={themeStyles}>
      {/* Background layer */}
      <div className="fixed inset-0 z-[-1]" style={{ backgroundColor: 'var(--color-bg)' }} />
      
      {/* Dynamic CSS Utilities */}
      <style jsx global>{`
        .theme-text { color: var(--color-text); }
        .theme-bg-surface { background-color: var(--color-surface); }
        .theme-bg-accent { background-color: var(--color-accent); }
        .theme-text-accent { color: var(--color-accent); }
        .theme-border-accent { border-color: var(--color-accent); }
      `}</style>

      {/* --- COVER SCREEN (SLIDE UP) --- */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center shadow-2xl" 
            style={{ backgroundColor: 'var(--color-bg)' }}
          >
            <div className="absolute top-0 left-0 w-full h-64 opacity-30" style={{ background: `linear-gradient(to bottom, var(--color-accent), transparent)` }} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="z-10 text-center px-6 flex flex-col items-center w-full max-w-sm"
            >
              <span className="text-xs font-bold uppercase tracking-[0.4em] theme-text-accent mb-6 border border-[var(--color-accent)] px-5 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                {theme.name}
              </span>
              <p className="theme-text text-sm tracking-[0.2em] uppercase mb-4">Pernikahan</p>
              <h1 className="font-heading text-6xl sm:text-7xl mb-8 theme-text drop-shadow-sm">
                R & J
              </h1>
              <p className="theme-text text-sm mb-16 italic opacity-80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              
              <div className="p-4 px-8 border-b border-[var(--color-accent)] mb-16 w-full relative">
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 theme-bg-accent" />
                <p className="theme-text font-bold text-xl tracking-wider">Tamu Kehormatan</p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenInvitation}
                className="flex items-center space-x-3 px-10 py-4 rounded-full theme-bg-accent shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
              >
                <Heart className="w-5 h-5 animate-pulse" style={{ color: 'var(--color-bg)' }} />
                <span className="font-bold tracking-widest uppercase text-sm" style={{ color: 'var(--color-bg)' }}>Buka Undangan</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- INVITATION CONTENT --- */}
      <main className="w-full max-w-[480px] mx-auto min-h-screen relative shadow-2xl pb-24" style={{ backgroundColor: 'var(--color-bg)' }}>
        
        {/* Hidden Audio */}
        <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" loop preload="auto" />

        {/* Floating Audio Control */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: isOpen ? 1 : 0 }} transition={{ delay: 1.5 }}
          className="fixed top-6 right-6 z-40"
        >
          <button onClick={toggleAudio} className="w-10 h-10 rounded-full theme-bg-surface flex items-center justify-center shadow-lg border theme-border-accent">
            <Music className={`w-4 h-4 theme-text-accent ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
          </button>
        </motion.div>

        {/* Hero Section */}
        <section id="home" className="min-h-[90vh] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 flex flex-col items-center mt-20">
            <p className="theme-text text-xs tracking-[0.3em] uppercase mb-4 font-semibold">The Wedding Of</p>
            <h2 className="font-heading text-7xl sm:text-8xl mb-8 theme-text" style={{ textShadow: '2px 4px 10px rgba(0,0,0,0.1)' }}>R & J</h2>
            
            <p className="theme-text text-sm leading-relaxed max-w-[280px] mx-auto mb-16 italic opacity-80">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri..."
            </p>
            
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="flex flex-col items-center space-y-4">
              <div className="w-px h-24 theme-bg-accent opacity-50" />
              <ChevronDown className="w-6 h-6 theme-text-accent" />
            </motion.div>
          </motion.div>
        </section>

        {/* Live Countdown Section (Including SECONDS) */}
        <section className="py-16 px-6 theme-bg-surface text-center relative shadow-inner">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp}>
            <h3 className="font-heading text-2xl mb-8 tracking-widest uppercase theme-text-accent">Menuju Hari Bahagia</h3>
            
            <div className="flex items-center justify-center gap-2 sm:gap-4 relative z-10">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center justify-center w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-xl border theme-border-accent bg-[var(--color-bg)] shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
                  <span className="font-heading text-2xl sm:text-3xl font-bold theme-text">{String(value).padStart(2, '0')}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest theme-text-accent opacity-80">
                    {unit === 'days' ? 'Hari' : unit === 'hours' ? 'Jam' : unit === 'minutes' ? 'Menit' : 'Detik'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Mempelai Section (Arch Photos) */}
        <section id="couple" className="py-24 px-8 text-center relative border-t border-[var(--color-text)]/5">
          <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-heading text-5xl theme-text mb-16">
            Mempelai
          </motion.h3>
          
          <div className="flex flex-col items-center space-y-16">
            {/* Groom */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col items-center">
              <div className="w-48 h-64 rounded-t-full p-2 mb-6 border-2 theme-border-accent shadow-2xl relative">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop" alt="Groom" className="w-full h-full object-cover rounded-t-full" />
              </div>
              <h4 className="font-heading text-3xl theme-text font-bold mb-2">Romeo Montague</h4>
              <p className="theme-text text-sm opacity-80 font-medium tracking-wide">Putra pertama dari<br/>Kel. Bapak X & Ibu Y</p>
            </motion.div>

            <motion.span initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-heading text-6xl theme-text-accent opacity-60">&</motion.span>

            {/* Bride */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col items-center">
              <div className="w-48 h-64 rounded-t-full p-2 mb-6 border-2 theme-border-accent shadow-2xl relative">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" alt="Bride" className="w-full h-full object-cover rounded-t-full" />
              </div>
              <h4 className="font-heading text-3xl theme-text font-bold mb-2">Juliet Capulet</h4>
              <p className="theme-text text-sm opacity-80 font-medium tracking-wide">Putri pertama dari<br/>Kel. Bapak A & Ibu B</p>
            </motion.div>
          </div>
        </section>

        {/* Event Section */}
        <section id="event" className="py-24 px-6 relative border-t border-[var(--color-text)]/5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h3 className="font-heading text-5xl theme-text mb-3">Rangkaian Acara</h3>
            <p className="theme-text text-sm opacity-75">Dengan memohon rahmat Allah SWT</p>
          </motion.div>

          <div className="space-y-8 relative z-10">
            {/* Akad Card */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-[2.5rem] p-10 text-center shadow-xl theme-bg-surface border border-[var(--color-accent)]/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full theme-bg-accent" />
              <h4 className="font-heading text-3xl theme-text-accent font-bold mb-8 uppercase tracking-widest">Akad Nikah</h4>
              <div className="flex flex-col items-center space-y-4 mb-10 theme-text">
                <div className="flex items-center space-x-3 w-full justify-center">
                  <Calendar className="w-5 h-5 theme-text-accent" />
                  <span className="text-base font-semibold tracking-wide">Minggu, 19 Juli 2026</span>
                </div>
                <div className="flex items-center space-x-3 w-full justify-center">
                  <Clock className="w-5 h-5 theme-text-accent" />
                  <span className="text-base font-semibold tracking-wide">08:00 WIB - Selesai</span>
                </div>
              </div>
              <button className="px-8 py-4 rounded-full theme-bg-accent text-[var(--color-bg)] text-xs font-bold uppercase tracking-widest w-full hover:opacity-90 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                Simpan ke Kalender
              </button>
            </motion.div>

            {/* Resepsi Card */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-[2.5rem] p-10 text-center shadow-xl theme-bg-surface border border-[var(--color-accent)]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full theme-text" style={{ backgroundColor: 'var(--color-text)' }} />
              <h4 className="font-heading text-3xl theme-text font-bold mb-8 uppercase tracking-widest">Resepsi</h4>
              <div className="flex flex-col items-center space-y-4 mb-8 theme-text">
                <div className="flex items-center space-x-3 w-full justify-center">
                  <Calendar className="w-5 h-5 theme-text-accent" />
                  <span className="text-base font-semibold tracking-wide">Minggu, 19 Juli 2026</span>
                </div>
                <div className="flex items-center space-x-3 w-full justify-center">
                  <Clock className="w-5 h-5 theme-text-accent" />
                  <span className="text-base font-semibold tracking-wide">11:00 WIB - Selesai</span>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2 mb-10 theme-text p-6 border border-[var(--color-accent)]/20 rounded-3xl">
                <MapPin className="w-8 h-8 theme-text-accent mb-3" />
                <span className="text-lg font-extrabold uppercase tracking-wide">Ballroom Hotel Harmoni</span>
                <span className="text-sm opacity-80 mt-1">Jl. Raya Pasundan No. 123, Jawa Barat</span>
              </div>
              <button className="px-8 py-4 rounded-full theme-text theme-bg-surface border border-[var(--color-text)] text-xs font-bold uppercase tracking-widest w-full hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] transition-colors">
                Buka Google Maps
              </button>
            </motion.div>
          </div>
        </section>

        {/* Digital Envelope (Amplop Digital) */}
        <section className="py-24 px-6 relative border-t border-[var(--color-text)]/5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h3 className="font-heading text-4xl theme-text mb-3">Tanda Kasih</h3>
            <p className="theme-text text-sm opacity-75">Bagi keluarga & sahabat yang ingin memberikan hadiah</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-[2rem] p-8 text-center shadow-lg theme-bg-surface border border-[var(--color-accent)]/20 relative">
            <Gift className="w-12 h-12 theme-text-accent mx-auto mb-8" />
            <div className="bg-[var(--color-bg)] p-6 rounded-3xl border border-[var(--color-accent)]/10">
              <CreditCard className="w-8 h-8 theme-text mx-auto mb-4" />
              <p className="font-heading text-2xl theme-text tracking-widest">1234 5678 9012</p>
              <p className="text-sm theme-text opacity-80 mt-2 font-medium">Bank BCA a.n Romeo Montague</p>
              
              <button onClick={handleCopy} className="mt-6 px-8 py-3 rounded-full theme-bg-accent text-[var(--color-bg)] text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 mx-auto hover:opacity-90 transition-opacity">
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Berhasil Disalin!" : "Salin Rekening"}</span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* Gallery Masonry */}
        <section id="gallery" className="py-24 px-6 border-t border-[var(--color-text)]/5" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h3 className="font-heading text-5xl theme-text mb-3">Galeri</h3>
            <p className="theme-text text-sm opacity-75">Momen bahagia kami</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="columns-2 gap-4 space-y-4">
            <div className="w-full h-56 rounded-3xl overflow-hidden shadow-lg border border-[var(--color-text)]/10"><img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop" alt="Prewed 1" className="w-full h-full object-cover" /></div>
            <div className="w-full h-72 rounded-3xl overflow-hidden shadow-lg border border-[var(--color-text)]/10"><img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop" alt="Prewed 2" className="w-full h-full object-cover" /></div>
            <div className="w-full h-64 rounded-3xl overflow-hidden shadow-lg border border-[var(--color-text)]/10"><img src="https://images.unsplash.com/photo-1583939000340-c69c1d683778?q=80&w=800&auto=format&fit=crop" alt="Prewed 3" className="w-full h-full object-cover" /></div>
            <div className="w-full h-48 rounded-3xl overflow-hidden shadow-lg border border-[var(--color-text)]/10"><img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop" alt="Prewed 4" className="w-full h-full object-cover" /></div>
          </motion.div>
        </section>

        {/* RSVP Form */}
        <section id="rsvp" className="py-24 px-6 border-t border-[var(--color-text)]/5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h3 className="font-heading text-5xl theme-text mb-3">RSVP</h3>
            <p className="theme-text text-sm opacity-75">Kehadiran & Buku Tamu</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="theme-bg-surface p-8 rounded-[2.5rem] shadow-xl border border-[var(--color-text)]/10">
            <form className="space-y-6">
              <div>
                <input type="text" placeholder="Nama Lengkap" className="w-full px-6 py-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-accent)]/20 theme-text text-sm focus:outline-none focus:border-[var(--color-accent)]" />
              </div>
              <div>
                <select className="w-full px-6 py-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-accent)]/20 theme-text text-sm focus:outline-none focus:border-[var(--color-accent)] appearance-none">
                  <option value="">Konfirmasi Kehadiran</option>
                  <option value="hadir">Hadir</option>
                  <option value="tidak">Tidak Hadir</option>
                </select>
              </div>
              <div>
                <textarea rows="4" placeholder="Tuliskan ucapan dan doa restu..." className="w-full px-6 py-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-accent)]/20 theme-text text-sm focus:outline-none focus:border-[var(--color-accent)] resize-none" />
              </div>
              <button type="button" className="w-full py-4 rounded-2xl theme-bg-accent text-[var(--color-bg)] font-bold tracking-widest uppercase text-xs hover:opacity-90 flex items-center justify-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Kirim Ucapan</span>
              </button>
            </form>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-24 text-center theme-bg-surface theme-text relative border-t-[16px] theme-border-accent">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-sm mb-6 opacity-90 px-8 italic max-w-[300px] mx-auto leading-relaxed">
            "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu berkenan hadir."
          </motion.p>
          <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-heading text-6xl mt-12 mb-16 theme-text-accent">
            R & J
          </motion.h3>
          <button 
            onClick={() => router.push('/undangan')}
            className="relative z-10 mb-16 px-10 py-4 rounded-full border-2 border-[var(--color-text)]/20 text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] transition-colors"
          >
            Tutup Demo
          </button>
          <p className="text-[9px] opacity-40 uppercase tracking-[0.3em] font-bold">Powered by JD Music Entertainment</p>
        </footer>

        {/* Floating Bottom Navigation Tab Bar */}
        <motion.div 
          initial={{ y: 100 }} animate={{ y: isOpen ? 0 : 100 }} transition={{ delay: 1 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[var(--color-surface)]/90 backdrop-blur-md px-6 py-3 rounded-full border border-[var(--color-text)]/10 shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex items-center space-x-6"
        >
          <a href="#home" onClick={() => setActiveTab('home')} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'home' ? 'theme-text-accent scale-110' : 'theme-text opacity-50 hover:opacity-100'}`}>
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[8px] uppercase tracking-widest font-bold">Home</span>
          </a>
          <a href="#couple" onClick={() => setActiveTab('couple')} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'couple' ? 'theme-text-accent scale-110' : 'theme-text opacity-50 hover:opacity-100'}`}>
            <Users className="w-5 h-5 mb-1" />
            <span className="text-[8px] uppercase tracking-widest font-bold">Couple</span>
          </a>
          <a href="#event" onClick={() => setActiveTab('event')} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'event' ? 'theme-text-accent scale-110' : 'theme-text opacity-50 hover:opacity-100'}`}>
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-[8px] uppercase tracking-widest font-bold">Event</span>
          </a>
          <a href="#gallery" onClick={() => setActiveTab('gallery')} className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'gallery' ? 'theme-text-accent scale-110' : 'theme-text opacity-50 hover:opacity-100'}`}>
            <ImageIcon className="w-5 h-5 mb-1" />
            <span className="text-[8px] uppercase tracking-widest font-bold">Gallery</span>
          </a>
        </motion.div>

      </main>
    </div>
  );
}
