"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import themesData from "@/data/themes.json";
import { 
  MapPin, Calendar, Clock, Heart, Music, ChevronDown, User, Gift, 
  CreditCard, Send, Camera, Home, Users, Image as ImageIcon, Copy, CheckCircle, Quote
} from "lucide-react";
import { mockDb } from "@/lib/supabase";

export default function DefaultTheme() {
  const params = useParams();
  const router = useRouter();
  const themeId = params.themeId;
  const searchParams = useSearchParams();
  const guestNameParam = searchParams.get("to") || "Tamu Kehormatan";
  const isCoverOnly = searchParams.get("coverOnly") === "true";
  
  const [theme, setTheme] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const audioRef = useRef(null);

  // RSVP States
  const [rsvpForm, setRsvpForm] = useState({ name: guestNameParam !== "Tamu Kehormatan" ? guestNameParam.replace(/-/g, ' ') : "", status: "", message: "" });
  const [wishes, setWishes] = useState([]);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);

  // Live Countdown State (Including Seconds!)
  const [timeLeft, setTimeLeft] = useState({
    days: 14, hours: 8, minutes: 45, seconds: 0
  });

  useEffect(() => {
    const foundTheme = themesData.find((t) => t.id === themeId);
    if (foundTheme) setTheme(foundTheme);

    // Load Wishes
    mockDb.getGuests().then(data => setWishes(data));

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

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!rsvpForm.name || !rsvpForm.status || !rsvpForm.message) {
      alert("Mohon lengkapi semua field!");
      return;
    }
    setIsSubmittingRsvp(true);
    await mockDb.addGuest(rsvpForm);
    const updatedWishes = await mockDb.getGuests();
    setWishes(updatedWishes);
    setRsvpForm({ name: "", status: "", message: "" });
    setIsSubmittingRsvp(false);
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
    visible: { opacity: 1, y: 0, transition: { duration: 1.5, type: "spring", bounce: 0.2 } }
  };
  const fadeLeft = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 1.5, type: "spring", bounce: 0.2 } }
  };
  const fadeRight = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 1.5, type: "spring", bounce: 0.2 } }
  };
  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.5, type: "spring", bounce: 0.2 } }
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

        .custom-scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
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
              <p className="theme-text text-xs tracking-[0.3em] uppercase mb-1 opacity-80 font-semibold">You Are Invited</p>
              <p className="theme-text text-xs tracking-[0.2em] uppercase mb-6 opacity-80">To The Wedding Of</p>
              
              <div className="flex flex-col items-center justify-center mb-6">
                <h1 className="font-heading text-6xl sm:text-7xl theme-text drop-shadow-sm leading-none">R</h1>
                <span className="font-heading text-3xl theme-text-accent my-2">&</span>
                <h1 className="font-heading text-6xl sm:text-7xl theme-text drop-shadow-sm leading-none">A</h1>
              </div>

              <div className="theme-border-accent border-y py-2 px-8 mb-10">
                <p className="theme-text font-bold text-sm tracking-widest uppercase">
                  18 JUNI 2026
                </p>
              </div>

              <div className="flex flex-col items-center space-y-1 mb-6">
                <p className="theme-text text-xs italic opacity-80">Kepada Yth.</p>
                <p className="theme-text text-xs font-semibold uppercase tracking-wider">Bapak/Ibu/Saudara/i</p>
              </div>
              
              <div className="mb-12 w-full relative text-center">
                <p className="theme-text font-bold text-xl tracking-wider capitalize">{guestNameParam.replace(/-/g, ' ')}</p>
                <p className="theme-text text-xs italic opacity-80 mt-1">di Tempat</p>
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
      {!isCoverOnly && (
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

        {/* Dedicated Quotes Section */}
        <section id="quotes" className="py-24 px-8 text-center relative border-t border-[var(--color-text)]/5 flex flex-col items-center justify-center min-h-[50vh]">
          <Quote className="w-12 h-12 theme-text-accent opacity-20 absolute top-10 left-10" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10">
            <h3 className="font-heading text-4xl theme-text mb-8">Ayat Suci & Kutipan</h3>
            <p className="theme-text text-sm sm:text-base leading-relaxed max-w-[320px] mx-auto italic font-serif">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
            </p>
            <p className="theme-text-accent mt-6 font-bold tracking-widest text-xs uppercase">
              (QS. Ar-Rum: 21)
            </p>
          </motion.div>
          <Quote className="w-12 h-12 theme-text-accent opacity-20 absolute bottom-10 right-10 rotate-180" />
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

            <div className="mt-10 relative z-10 flex justify-center">
              <a 
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+R+dan+A&dates=20260618T010000Z/20260618T100000Z&details=Acara+Pernikahan+R+dan+A.+Kami+tunggu+kehadiran+Anda!&location=Indonesia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-8 py-3 rounded-full border border-[var(--color-accent)] theme-text-accent text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Simpan ke Kalender</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Mempelai Section */}
        <section id="couple" className="py-24 px-8 text-center relative border-y-[12px] theme-border-accent overflow-hidden theme-bg-surface">
          <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-heading text-5xl theme-text mb-16">
            Mempelai
          </motion.h3>
          
          <div className="flex flex-col items-center space-y-16">
            {/* Groom */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeRight} className="flex flex-col items-center">
              <div className="w-48 h-64 rounded-t-full p-2 mb-6 border-2 theme-border-accent shadow-2xl relative">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop" alt="Groom" className="w-full h-full object-cover rounded-t-full" />
              </div>
              <h4 className="font-heading text-3xl theme-text font-bold mb-2">Romeo Montague</h4>
              <p className="theme-text text-sm opacity-80 font-medium tracking-wide">Putra pertama dari<br/>Kel. Bapak X & Ibu Y</p>
            </motion.div>

            <motion.span initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="font-heading text-6xl theme-text-accent opacity-60">&</motion.span>

            {/* Bride */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft} className="flex flex-col items-center">
              <div className="w-48 h-64 rounded-t-full p-2 mb-6 border-2 theme-border-accent shadow-2xl relative">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" alt="Bride" className="w-full h-full object-cover rounded-t-full" />
              </div>
              <h4 className="font-heading text-3xl theme-text font-bold mb-2">Juliet Capulet</h4>
              <p className="theme-text text-sm opacity-80 font-medium tracking-wide">Putri pertama dari<br/>Kel. Bapak A & Ibu B</p>
            </motion.div>
          </div>
        </section>

        {/* Event Section */}
        <section id="event" className="py-24 px-6 relative overflow-hidden">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h3 className="font-heading text-5xl theme-text mb-3">Rangkaian Acara</h3>
            <p className="theme-text text-sm opacity-75">Dengan memohon rahmat Allah SWT</p>
          </motion.div>

          <div className="space-y-8 relative z-10">
            {/* Akad Card */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeRight} className="rounded-[2.5rem] p-10 text-center shadow-xl theme-bg-surface border border-[var(--color-accent)]/20 relative overflow-hidden">
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
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft} className="rounded-[2.5rem] p-10 text-center shadow-xl theme-bg-surface border border-[var(--color-accent)]/20 relative overflow-hidden">
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
        <section id="gift" className="py-24 px-6 relative border-t-[12px] border-b-[12px] theme-border-accent theme-bg-surface">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h3 className="font-heading text-4xl theme-text mb-3">Tanda Kasih</h3>
            <p className="theme-text text-sm opacity-75">Bagi keluarga & sahabat yang ingin memberikan hadiah</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="rounded-[2rem] p-8 text-center shadow-lg theme-bg-surface border border-[var(--color-accent)]/20 relative">
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
        <section id="gallery" className="py-24 px-6 overflow-hidden relative">
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
        <section id="rsvp" className="py-24 px-6 border-t-[16px] theme-border-accent theme-bg-surface">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h3 className="font-heading text-5xl theme-text mb-3">RSVP</h3>
            <p className="theme-text text-sm opacity-75">Kehadiran & Buku Tamu</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="p-8 mb-12 max-w-sm mx-auto">
            <form onSubmit={handleRsvpSubmit} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  value={rsvpForm.name}
                  onChange={(e) => setRsvpForm(prev => ({...prev, name: e.target.value}))}
                  placeholder="Nama Lengkap" 
                  className="w-full px-6 py-4 rounded-full bg-transparent border border-[var(--color-accent)] theme-text text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] placeholder:opacity-50" 
                />
              </div>
              <div>
                <select 
                  value={rsvpForm.status}
                  onChange={(e) => setRsvpForm(prev => ({...prev, status: e.target.value}))}
                  className="w-full px-6 py-4 rounded-full bg-transparent border border-[var(--color-accent)] theme-text text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] appearance-none"
                >
                  <option value="">Konfirmasi Kehadiran</option>
                  <option value="hadir">Hadir</option>
                  <option value="tidak">Tidak Hadir</option>
                </select>
              </div>
              <div>
                <textarea 
                  rows="4" 
                  value={rsvpForm.message}
                  onChange={(e) => setRsvpForm(prev => ({...prev, message: e.target.value}))}
                  placeholder="Tuliskan ucapan dan doa restu..." 
                  className="w-full px-6 py-4 rounded-3xl bg-transparent border border-[var(--color-accent)] theme-text text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-none placeholder:opacity-50" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmittingRsvp}
                className="w-full py-4 rounded-full theme-bg-accent text-[var(--color-bg)] font-bold tracking-widest uppercase text-xs hover:opacity-90 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingRsvp ? "Mengirim..." : "Kirim Ucapan"}</span>
              </button>
            </form>
          </motion.div>

          {/* Wishes List (Simple Vertical) */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-0 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar w-full max-w-md mx-auto text-left">
            {wishes.map((wish) => (
              <div key={wish.id} className="py-5 border-b border-[var(--color-accent)]/20 last:border-0">
                <h5 className="font-bold theme-text text-sm mb-1">{wish.name}</h5>
                <p className="text-xs theme-text opacity-90 leading-relaxed">{wish.message}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-24 text-center theme-bg-surface theme-text relative">
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
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[var(--color-surface)]/95 backdrop-blur-md px-2 py-2 rounded-full border border-[var(--color-text)]/10 shadow-[0_10px_40px_rgba(0,0,0,0.15)] w-[90%] max-w-[400px] overflow-hidden"
        >
          <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar-hide px-2">
            <a href="#home" onClick={() => setActiveTab('home')} className={`flex-shrink-0 flex flex-col items-center p-2 min-w-[56px] transition-colors ${activeTab === 'home' ? 'theme-text-accent scale-110' : 'theme-text opacity-50 hover:opacity-100'}`}>
              <Home className="w-5 h-5 mb-1" />
              <span className="text-[8px] uppercase tracking-widest font-bold">Home</span>
            </a>
            <a href="#quotes" onClick={() => setActiveTab('quotes')} className={`flex-shrink-0 flex flex-col items-center p-2 min-w-[56px] transition-colors ${activeTab === 'quotes' ? 'theme-text-accent scale-110' : 'theme-text opacity-50 hover:opacity-100'}`}>
              <Quote className="w-5 h-5 mb-1" />
              <span className="text-[8px] uppercase tracking-widest font-bold">Quotes</span>
            </a>
            <a href="#couple" onClick={() => setActiveTab('couple')} className={`flex-shrink-0 flex flex-col items-center p-2 min-w-[56px] transition-colors ${activeTab === 'couple' ? 'theme-text-accent scale-110' : 'theme-text opacity-50 hover:opacity-100'}`}>
              <Users className="w-5 h-5 mb-1" />
              <span className="text-[8px] uppercase tracking-widest font-bold">Couple</span>
            </a>
            <a href="#event" onClick={() => setActiveTab('event')} className={`flex-shrink-0 flex flex-col items-center p-2 min-w-[56px] transition-colors ${activeTab === 'event' ? 'theme-text-accent scale-110' : 'theme-text opacity-50 hover:opacity-100'}`}>
              <Calendar className="w-5 h-5 mb-1" />
              <span className="text-[8px] uppercase tracking-widest font-bold">Event</span>
            </a>
            <a href="#gallery" onClick={() => setActiveTab('gallery')} className={`flex-shrink-0 flex flex-col items-center p-2 min-w-[56px] transition-colors ${activeTab === 'gallery' ? 'theme-text-accent scale-110' : 'theme-text opacity-50 hover:opacity-100'}`}>
              <ImageIcon className="w-5 h-5 mb-1" />
              <span className="text-[8px] uppercase tracking-widest font-bold">Gallery</span>
            </a>
            <a href="#gift" onClick={() => setActiveTab('gift')} className={`flex-shrink-0 flex flex-col items-center p-2 min-w-[56px] transition-colors ${activeTab === 'gift' ? 'theme-text-accent scale-110' : 'theme-text opacity-50 hover:opacity-100'}`}>
              <Gift className="w-5 h-5 mb-1" />
              <span className="text-[8px] uppercase tracking-widest font-bold">Gift</span>
            </a>
            <a href="#rsvp" onClick={() => setActiveTab('rsvp')} className={`flex-shrink-0 flex flex-col items-center p-2 min-w-[56px] transition-colors ${activeTab === 'rsvp' ? 'theme-text-accent scale-110' : 'theme-text opacity-50 hover:opacity-100'}`}>
              <Send className="w-5 h-5 mb-1" />
              <span className="text-[8px] uppercase tracking-widest font-bold">RSVP</span>
            </a>
          </div>
        </motion.div>

      </main>
      )}
    </div>
  );
}
