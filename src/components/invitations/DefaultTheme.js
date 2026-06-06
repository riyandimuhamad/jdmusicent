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
import EksklusifCover from "./covers/EksklusifCover";
import LuxuryCover from "./covers/LuxuryCover";
import { DynamicOrnament } from "./shared/DynamicOrnaments";

export default function DefaultTheme({ injectedClientData }) {
  const params = useParams();
  const router = useRouter();
  
  // Dynamic Resolvers
  const themeId = injectedClientData?.themeId || params.themeId;
  const clientSlug = injectedClientData?.id || params.themeId || "demo"; // fallback
  
  // Dummy data mapping
  const cGroom = injectedClientData?.groom || "Romeo Montague";
  const cBride = injectedClientData?.bride || "Juliet Capulet";
  const cShort = injectedClientData?.short || "R & J";
  const cParentsGroom = injectedClientData?.parentsGroom || "Kel. Bapak X & Ibu Y";
  const cParentsBride = injectedClientData?.parentsBride || "Kel. Bapak A & Ibu B";
  const cDateStr = injectedClientData?.dateStr || "18 JUNI 2026";
  
  const cAkadDate = injectedClientData?.akad?.date || "Minggu, 18 Juni 2026";
  const cAkadTime = injectedClientData?.akad?.time || "08:00 WIB - Selesai";
  const cResepsiDate = injectedClientData?.resepsi?.date || "Minggu, 18 Juni 2026";
  const cResepsiTime = injectedClientData?.resepsi?.time || "11:00 WIB - Selesai";
  const cResepsiVenue = injectedClientData?.resepsi?.venue || "Ballroom Hotel Harmoni";
  const cResepsiAddress = injectedClientData?.resepsi?.address || "Jl. Raya Pasundan No. 123, Jawa Barat";

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

    // Load Wishes specific to this client
    mockDb.getGuests(clientSlug).then(data => setWishes(data));

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
  }, [themeId, clientSlug]);

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
    await mockDb.addGuest(clientSlug, rsvpForm);
    const updatedWishes = await mockDb.getGuests(clientSlug);
    setWishes(updatedWishes);
    setRsvpForm({ name: "", status: "", message: "" });
    setIsSubmittingRsvp(false);
  };

  if (!theme) return <div className="min-h-screen bg-navy-dark flex flex-col items-center justify-center text-white"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" /><p className="animate-pulse text-xs tracking-widest font-bold">MENGHUBUNGKAN TEMA...</p></div>;

  const themeStyles = {
    "--color-bg": theme.colors[0],       
    "--color-surface": theme.colors[1],  
    "--color-accent": theme.colors[2],   
    "--color-text": theme.colors[3],     
  };

  const fadeUp = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 1.5, type: "spring", bounce: 0.2 } } };
  const fadeLeft = { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0, transition: { duration: 1.5, type: "spring", bounce: 0.2 } } };
  const fadeRight = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0, transition: { duration: 1.5, type: "spring", bounce: 0.2 } } };
  const scaleIn = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 1.5, type: "spring", bounce: 0.2 } } };

  // Separate initials for envelope cover (e.g., "R & A" -> "R", "A")
  const initialsArray = cShort.split(" & ");
  const heroInitialLeft = initialsArray[0] || "R";
  const heroInitialRight = initialsArray[1] || "J";

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden font-sans scroll-smooth" style={themeStyles}>
      <div className="fixed inset-0 z-[-1]" style={{ backgroundColor: 'var(--color-bg)' }} />
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Pinyon+Script&family=Cinzel:wght@400;700&family=Great+Vibes&family=Lora:ital,wght@0,400;0,700;1,400&family=Dancing+Script&display=swap');
        .theme-text { color: var(--color-text); }
        .theme-bg-surface { background-color: var(--color-surface); }
        .theme-bg-accent { background-color: var(--color-accent); }
        .theme-text-accent { color: var(--color-accent); }
        .theme-border-accent { border-color: var(--color-accent); }
        .font-heading { font-family: ${theme?.typography?.heading === 'serif' ? "'Playfair Display', serif" : theme?.typography?.heading === 'cinzel' ? "'Cinzel', serif" : "'Lora', serif"}; }
        .font-script { font-family: ${theme?.typography?.script === 'cursive' ? "'Pinyon Script', cursive" : theme?.typography?.script === 'greatvibes' ? "'Great Vibes', cursive" : "'Dancing Script', cursive"}; }
        .theme-pattern-bg {
          background-image: url('https://www.transparenttextures.com/patterns/cream-paper.png');
          background-repeat: repeat; opacity: 0.25; mix-blend-mode: multiply;
        }
        .premium-frame {
          position: absolute; inset: 16px; border: 1px solid var(--color-accent); border-radius: 24px; pointer-events: none; z-index: 10; opacity: 0.5;
        }
        .premium-frame::before {
          content: ''; position: absolute; inset: 6px; border: 1px solid var(--color-accent); border-radius: 18px; opacity: 0.3;
        }
        .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <AnimatePresence>
        {!isOpen && theme?.coverStyle === 'arch' && (
          <motion.div key="arch" exit={{ opacity: 0 }} transition={{ duration: 1 }} className="fixed inset-0 z-50">
            <EksklusifCover theme={theme} guestName={guestNameParam} onOpen={handleOpenInvitation} isCoverOnly={isCoverOnly} overrideShort={cShort} />
          </motion.div>
        )}
        
        {!isOpen && theme?.coverStyle === 'envelope' && (
          <motion.div key="envelope" exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 1 }} className="fixed inset-0 z-50">
            <LuxuryCover theme={theme} guestName={guestNameParam} onOpen={handleOpenInvitation} isCoverOnly={isCoverOnly} overrideShort={cShort} />
          </motion.div>
        )}

        {!isOpen && !theme?.coverStyle && (
          <motion.div 
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center shadow-2xl overflow-hidden" 
            style={{ backgroundColor: 'var(--color-bg)' }}
          >
            <div className="absolute inset-0 theme-pattern-bg z-0" />
            <div className="premium-frame" />
            <DynamicOrnament themeId={themeId} type="corner" className="absolute top-4 right-4 w-48 h-48 opacity-80 z-10" />
            <DynamicOrnament themeId={themeId} type="corner" className="absolute bottom-4 left-4 w-48 h-48 opacity-80 z-10" style={{ transform: 'rotate(180deg)' }} />

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} className="z-10 text-center px-6 flex flex-col items-center w-full max-w-sm">
              <DynamicOrnament themeId={themeId} type="hero" className="w-24 h-12 mb-4" />
              <p className="theme-text text-xs tracking-[0.3em] uppercase mb-1 opacity-80 font-semibold">You Are Invited</p>
              <p className="theme-text text-xs tracking-[0.2em] uppercase mb-6 opacity-80">To The Wedding Of</p>
              
              <div className="flex flex-col items-center justify-center mb-6">
                <h1 className="font-script text-7xl sm:text-8xl theme-text drop-shadow-sm leading-none">{heroInitialLeft}</h1>
                <span className="font-heading text-4xl theme-text-accent my-2">&</span>
                <h1 className="font-script text-7xl sm:text-8xl theme-text drop-shadow-sm leading-none">{heroInitialRight}</h1>
              </div>

              <div className="theme-border-accent border-y py-2 px-8 mb-10">
                <p className="theme-text font-bold text-sm tracking-widest uppercase">{cDateStr}</p>
              </div>

              <div className="flex flex-col items-center space-y-1 mb-6">
                <p className="theme-text text-xs italic opacity-80">Kepada Yth.</p>
                <p className="theme-text text-xs font-semibold uppercase tracking-wider">Bapak/Ibu/Saudara/i</p>
              </div>
              
              <div className="mb-12 w-full relative text-center">
                <p className="theme-text font-bold text-xl tracking-wider capitalize">{guestNameParam.replace(/-/g, ' ')}</p>
                <p className="theme-text text-xs italic opacity-80 mt-1">di Tempat</p>
              </div>

              <motion.button onClick={handleOpenInvitation} className="flex items-center space-x-3 px-10 py-4 rounded-full theme-bg-accent shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                <Heart className="w-5 h-5 animate-pulse" style={{ color: 'var(--color-bg)' }} />
                <span className="font-bold tracking-widest uppercase text-sm" style={{ color: 'var(--color-bg)' }}>Buka Undangan</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isCoverOnly && (
      <main className={`w-full max-w-[480px] mx-auto relative shadow-2xl pb-24 transition-all duration-1000 ${!isOpen ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 min-h-screen'}`} style={{ backgroundColor: 'var(--color-bg)' }}>
        <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" loop preload="auto" />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: isOpen ? 1 : 0 }} transition={{ delay: 1.5 }} className="fixed top-6 right-6 z-40">
          <button onClick={toggleAudio} className="w-10 h-10 rounded-full theme-bg-surface flex items-center justify-center shadow-lg border theme-border-accent">
            <Music className={`w-4 h-4 theme-text-accent ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
          </button>
        </motion.div>

        {/* Hero Section */}
        <section id="home" className="min-h-[90vh] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 theme-pattern-bg z-0" />
          <div className="premium-frame" />
          <DynamicOrnament themeId={themeId} type="corner" className="absolute top-4 left-4 w-64 h-64 opacity-80 z-10" style={{ transform: 'scaleX(-1)' }} />
          <DynamicOrnament themeId={themeId} type="corner" className="absolute bottom-4 right-4 w-64 h-64 opacity-80 z-10" style={{ transform: 'scaleX(-1) rotate(180deg)' }} />
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 flex flex-col items-center mt-10">
            <DynamicOrnament themeId={themeId} type="hero" className="w-32 h-16 mb-6" />
            <p className="theme-text text-[10px] tracking-[0.4em] uppercase mb-4 font-bold opacity-80">The Wedding Of</p>
            <h2 className="font-script text-8xl sm:text-9xl mb-10 theme-text-accent leading-none" style={{ textShadow: '2px 4px 15px rgba(0,0,0,0.15)' }}>{cShort}</h2>
            <div className="w-12 h-[1px] theme-bg-accent mb-10 opacity-50" />
            <p className="theme-text text-sm leading-relaxed max-w-[280px] mx-auto mb-16 italic opacity-90 font-serif">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri..."
            </p>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="flex flex-col items-center space-y-4">
              <div className="w-px h-24 theme-bg-accent opacity-50" />
              <ChevronDown className="w-6 h-6 theme-text-accent" />
            </motion.div>
          </motion.div>
        </section>

        {/* Quotes Section */}
        <section id="quotes" className="py-24 px-8 text-center relative border-t border-[var(--color-text)]/5 flex flex-col items-center justify-center min-h-[50vh] overflow-hidden">
          <div className="absolute inset-0 theme-pattern-bg z-0" />
          <div className="premium-frame" />
          <Quote className="w-12 h-12 theme-text-accent opacity-20 absolute top-10 left-10 z-10" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10">
            <h3 className="font-heading text-4xl theme-text mb-8">Ayat Suci</h3>
            <p className="theme-text text-sm sm:text-base leading-relaxed max-w-[320px] mx-auto italic font-serif">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri..."
            </p>
            <p className="theme-text-accent mt-6 font-bold tracking-widest text-xs uppercase">(QS. Ar-Rum: 21)</p>
          </motion.div>
          <Quote className="w-12 h-12 theme-text-accent opacity-20 absolute bottom-10 right-10 rotate-180" />
        </section>

        <section className="py-16 px-6 theme-bg-surface text-center relative shadow-inner overflow-hidden">
          <div className="absolute inset-0 theme-pattern-bg opacity-50 z-0" />
          <div className="premium-frame" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp} className="relative z-10">
            <h3 className="font-heading text-2xl mb-8 tracking-widest uppercase theme-text-accent">Menuju Hari Bahagia</h3>
            <div className="flex items-center justify-center gap-2 sm:gap-4 relative z-10">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center justify-center w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-xl border theme-border-accent bg-[var(--color-bg)]">
                  <span className="font-heading text-2xl sm:text-3xl font-bold theme-text">{String(value).padStart(2, '0')}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest theme-text-accent opacity-80">
                    {unit === 'days' ? 'Hari' : unit === 'hours' ? 'Jam' : unit === 'minutes' ? 'Menit' : 'Detik'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Mempelai Section */}
        <section id="couple" className="py-24 px-8 text-center relative border-y-[12px] theme-border-accent overflow-hidden theme-bg-surface">
          <div className="absolute inset-0 theme-pattern-bg z-0 opacity-40" />
          <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-heading text-5xl theme-text mb-16 relative z-10">Mempelai</motion.h3>
          <div className="flex flex-col items-center space-y-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeRight} className="flex flex-col items-center z-10">
              <div className="w-48 h-64 rounded-t-full p-2 mb-6 border-2 theme-border-accent shadow-2xl bg-[var(--color-bg)]">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop" alt="Groom" className="w-full h-full object-cover rounded-t-full" />
              </div>
              <h4 className="font-heading text-3xl theme-text font-bold mb-2">{cGroom}</h4>
              <p className="theme-text text-sm opacity-80 font-medium tracking-wide">Putra dari<br/>{cParentsGroom}</p>
            </motion.div>
            <motion.span initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="font-heading text-6xl theme-text-accent opacity-60 z-10">&</motion.span>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft} className="flex flex-col items-center z-10">
              <div className="w-48 h-64 rounded-t-full p-2 mb-6 border-2 theme-border-accent shadow-2xl bg-[var(--color-bg)]">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" alt="Bride" className="w-full h-full object-cover rounded-t-full" />
              </div>
              <h4 className="font-heading text-3xl theme-text font-bold mb-2">{cBride}</h4>
              <p className="theme-text text-sm opacity-80 font-medium tracking-wide">Putri dari<br/>{cParentsBride}</p>
            </motion.div>
          </div>
        </section>

        {/* Event Section */}
        <section id="event" className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 theme-pattern-bg z-0" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16 relative z-10">
            <h3 className="font-heading text-5xl theme-text mb-3">Rangkaian Acara</h3>
          </motion.div>
          <div className="space-y-16 relative z-10 w-full max-w-sm mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeRight} className="text-center relative">
              <DynamicOrnament themeId={themeId} type="separator" className="w-24 h-32 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
              <h4 className="font-heading text-4xl theme-text-accent font-bold mb-6 uppercase tracking-widest">Akad Nikah</h4>
              <div className="flex flex-col items-center space-y-4 mb-8 theme-text">
                <div className="flex items-center space-x-3"><Calendar className="w-5 h-5 theme-text-accent" /><span className="text-base font-semibold">{cAkadDate}</span></div>
                <div className="flex items-center space-x-3"><Clock className="w-5 h-5 theme-text-accent" /><span className="text-base font-semibold">{cAkadTime}</span></div>
              </div>
            </motion.div>
            <div className="w-24 h-px theme-bg-accent mx-auto opacity-30" />
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft} className="text-center relative">
              <DynamicOrnament themeId={themeId} type="separator" className="w-24 h-32 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
              <h4 className="font-heading text-4xl theme-text font-bold mb-6 uppercase tracking-widest">Resepsi</h4>
              <div className="flex flex-col items-center space-y-4 mb-8 theme-text">
                <div className="flex items-center space-x-3"><Calendar className="w-5 h-5 theme-text-accent" /><span className="text-base font-semibold">{cResepsiDate}</span></div>
                <div className="flex items-center space-x-3"><Clock className="w-5 h-5 theme-text-accent" /><span className="text-base font-semibold">{cResepsiTime}</span></div>
              </div>
              <div className="flex flex-col items-center space-y-2 mb-8 theme-text">
                <MapPin className="w-6 h-6 theme-text-accent mb-2" />
                <span className="text-lg font-bold uppercase tracking-wide">{cResepsiVenue}</span>
                <span className="text-sm opacity-80 mt-1">{cResepsiAddress}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gift Section */}
        <section id="gift" className="py-24 px-6 relative border-y-[12px] theme-border-accent overflow-hidden theme-bg-surface">
          <div className="absolute inset-0 theme-pattern-bg z-0 opacity-40" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12 relative z-10">
            <h3 className="font-heading text-4xl theme-text mb-3">Tanda Kasih</h3>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="p-8 text-center relative z-10 max-w-sm mx-auto">
            <Gift className="w-10 h-10 theme-text-accent mx-auto mb-8 relative z-10" />
            <div className="relative z-10">
              <CreditCard className="w-6 h-6 theme-text mx-auto mb-4 opacity-50" />
              <p className="font-heading text-3xl theme-text tracking-widest mb-2">1234 5678 9012</p>
              <p className="text-sm theme-text opacity-80 font-medium">Bank BCA a.n {cGroom}</p>
            </div>
          </motion.div>
        </section>

        {/* RSVP Form */}
        <section id="rsvp" className="py-24 px-6 border-t-[16px] theme-border-accent overflow-hidden relative theme-bg-surface">
          <div className="absolute inset-0 theme-pattern-bg z-0" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12 relative z-10">
            <h3 className="font-heading text-5xl theme-text mb-3">RSVP</h3>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="p-8 mb-12 relative z-10 max-w-sm mx-auto">
            <form onSubmit={handleRsvpSubmit} className="space-y-6">
              <input type="text" value={rsvpForm.name} onChange={(e) => setRsvpForm(prev => ({...prev, name: e.target.value}))} placeholder="Nama Lengkap" className="w-full px-6 py-4 rounded-full bg-transparent border border-[var(--color-accent)] theme-text text-sm focus:outline-none" />
              <select value={rsvpForm.status} onChange={(e) => setRsvpForm(prev => ({...prev, status: e.target.value}))} className="w-full px-6 py-4 rounded-full bg-transparent border border-[var(--color-accent)] theme-text text-sm focus:outline-none appearance-none">
                <option value="">Konfirmasi Kehadiran</option><option value="hadir">Hadir</option><option value="tidak">Tidak Hadir</option>
              </select>
              <textarea rows="4" value={rsvpForm.message} onChange={(e) => setRsvpForm(prev => ({...prev, message: e.target.value}))} placeholder="Tuliskan ucapan..." className="w-full px-6 py-4 rounded-3xl bg-transparent border border-[var(--color-accent)] theme-text text-sm focus:outline-none resize-none" />
              <button type="submit" disabled={isSubmittingRsvp} className="w-full py-4 rounded-full theme-bg-accent text-[var(--color-bg)] font-bold tracking-widest uppercase text-xs">
                {isSubmittingRsvp ? "Mengirim..." : "Kirim Ucapan"}
              </button>
            </form>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-0 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar relative z-10 w-full max-w-md mx-auto text-left">
            {wishes.map((wish) => (
              <div key={wish.id} className="py-5 border-b border-[var(--color-accent)]/20 last:border-0">
                <h5 className="font-bold theme-text text-sm mb-1">{wish.name}</h5>
                <p className="text-xs theme-text opacity-90 leading-relaxed">{wish.message}</p>
              </div>
            ))}
          </motion.div>
        </section>

        <footer className="py-24 text-center theme-bg-surface theme-text relative overflow-hidden">
          <div className="absolute inset-0 theme-pattern-bg z-0" />
          <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-script text-7xl mt-12 mb-16 theme-text-accent">{cShort}</motion.h3>
          {!injectedClientData && (
            <button onClick={() => router.push('/undangan/booking')} className="relative z-10 mb-16 px-10 py-4 rounded-full border-2 border-[var(--color-text)]/20 text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] transition-colors">
              Pesan Tema Ini
            </button>
          )}
        </footer>

        <motion.div initial={{ y: 100 }} animate={{ y: isOpen ? 0 : 100 }} transition={{ delay: 1 }} className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[var(--color-surface)]/95 backdrop-blur-md px-2 py-2 rounded-full border border-[var(--color-text)]/10 shadow-[0_10px_40px_rgba(0,0,0,0.15)] w-[90%] max-w-[400px] overflow-hidden">
          <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar-hide px-2">
            <a href="#home" onClick={() => setActiveTab('home')} className={`flex-shrink-0 flex flex-col items-center p-2 min-w-[56px] transition-colors ${activeTab === 'home' ? 'theme-text-accent scale-110' : 'theme-text opacity-50 hover:opacity-100'}`}><Home className="w-5 h-5 mb-1" /></a>
            <a href="#rsvp" onClick={() => setActiveTab('rsvp')} className={`flex-shrink-0 flex flex-col items-center p-2 min-w-[56px] transition-colors ${activeTab === 'rsvp' ? 'theme-text-accent scale-110' : 'theme-text opacity-50 hover:opacity-100'}`}><Send className="w-5 h-5 mb-1" /></a>
          </div>
        </motion.div>
      </main>
      )}
    </div>
  );
}
