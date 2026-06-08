"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Heart, FileText, MapPin, Phone, User, Calendar, Send, CheckCircle, Info, Eye, X, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import themesData from "@/data/themes.json";
import { mockDb } from "@/lib/supabase";
import { formatIDR, cn } from "@/lib/utils";

export default function UndanganPage() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeTier, setActiveTier] = useState("Semua");
  const [previewThemeId, setPreviewThemeId] = useState(null);
  const [settings, setSettings] = useState(null);

  React.useEffect(() => {
    async function loadSettings() {
      const data = await mockDb.getSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  const categoryMap = {
    "Lokal": "Nusantara Heritage",
    "Nasional": "Modern Elegance",
    "Internasional": "Global Signature"
  };

  const getThemeTier = (price) => {
    if (price <= 115000) return 'Premium';
    if (price === 140000) return 'Eksklusif';
    return 'Luxury';
  };

  const getOriginalPrice = (theme, defaultPrice) => {
    const tier = getThemeTier(defaultPrice).toLowerCase();
    if (settings && settings.invitations[tier]) {
      return settings.invitations[tier].basePrice;
    }
    if (defaultPrice <= 115000) return 150000; // ~23% discount
    if (defaultPrice === 140000) return 200000; // ~30% discount
    return 265000; // ~30% discount
  };

  const getDiscountPercentage = (theme, currentPrice) => {
    const original = getOriginalPrice(theme, currentPrice);
    if (original <= currentPrice) return 0;
    return Math.round(((original - currentPrice) / original) * 100);
  };

  const getDynamicPrice = (theme) => {
    const tier = getThemeTier(theme.priceStandalone).toLowerCase();
    if (settings && settings.invitations[tier]) {
      return settings.invitations[tier].basePrice - settings.invitations[tier].discount;
    }
    return theme.priceStandalone;
  };

  const getThemeTitleColor = (id) => {
    switch (id) {
      // LOKAL
      case "lokal-sunda-priangan": return "#A7F3D0"; // Sage Green Light
      case "lokal-sunda-cirebonan": return "#FCA5A5"; // Megamendung Red accent
      case "lokal-sunda-banten": return "#FDE047"; // Sultanate Gold/Yellow
      case "lokal-sunda-pasundan": return "#FDBA74"; // Earthy Tan
      case "lokal-javanese-heritage": return "#FCD34D"; // Classic Gold
      case "lokal-jawa-keraton": return "#86EFAC"; // Keraton Green
      case "lokal-balinese-agung": return "#FEF08A"; // Bright Bali Yellow
      case "lokal-minang-gadang": return "#F87171"; // Gadang Red
      case "lokal-batak-ulos": return "#FB923C"; // Ulos Orange/Red
      case "lokal-bugis-mappacci": return "#6EE7B7"; // Emerald Green
      case "lokal-dayak-borneo": return "#FDE047"; // Dayak Yellow
      case "lokal-palembang-sriwijaya": return "#FDA4AF"; // Songket Pink/Red
      case "lokal-betawi-pesisir": return "#F9A8D4"; // Betawi Pink
      case "lokal-maluku-mutiara": return "#7DD3FC"; // Ocean Blue
      case "lokal-ntt-tenun": return "#FB7185"; // Sunset Rose/Orange
      case "lokal-papua-asmat": return "#F59E0B"; // Earthy Amber

      // NASIONAL
      case "nasional-modern-minimalist": return "#F3F4F6"; // White/Gray
      case "nasional-rustic-warmth": return "#FDE047"; // Warm Sand
      case "nasional-monochrome-elegance": return "#FFFFFF"; // Pure White
      case "nasional-blush-peony": return "#F9A8D4"; // Soft Pink
      case "nasional-royal-navy-gold": return "#93C5FD"; // Navy/Blue
      case "nasional-emerald-botanical": return "#6EE7B7"; // Botanical Green
      case "nasional-terracotta-sunset": return "#FB923C"; // Terracotta
      case "nasional-sapphire-starlight": return "#A5B4FC"; // Sapphire Blue
      case "nasional-ivory-pearl": return "#FEF3C7"; // Ivory
      case "nasional-rose-gold": return "#FDA4AF"; // Rose Gold
      case "nasional-classic-marble": return "#E2E8F0"; // Marble Gray
      case "nasional-champagne": return "#FDE047"; // Champagne

      // INTERNASIONAL
      case "int-victorian-classic": return "#FBCFE8"; // Victorian Pink
      case "int-oriental-mandarin": return "#FCA5A5"; // Mandarin Red
      case "int-mediterranean": return "#7DD3FC"; // Mediterranean Blue
      case "int-hollywood-glam": return "#FCD34D"; // Glam Gold
      case "int-french-chateau": return "#BAE6FD"; // Dusty Blue
      case "int-japanese-zen": return "#FECDD3"; // Sakura Pink
      case "int-boho-moroccan": return "#FBBF24"; // Moroccan Amber
      case "int-scandinavian": return "#E5E7EB"; // Scandi Gray
      case "int-indian-royalty": return "#F0ABFC"; // Fuchsia/Purple
      case "int-korean-pastel": return "#FED7AA"; // Peach
      case "int-autumn-new-york": return "#FB923C"; // Autumn Orange
      case "int-tuscan-vineyard": return "#A3E635"; // Olive Green

      default: return "#D4AF37"; // Default Gold
    }
  };

  return (
    <>
      <div className="min-h-screen pt-28 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Background Radial Glow */}
        <div className="absolute top-[10%] right-1/4 w-[500px] h-[500px] rounded-full bg-radial-gradient-glow opacity-25 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">

          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-1 text-gold text-xs font-semibold tracking-[0.2em] uppercase">
              <Heart className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span>Undangan Digital Standalone</span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
              Desain Undangan Digital <br />
              <span className="bg-gradient-to-r from-gold via-gold-champagne to-electric bg-clip-text text-transparent text-glow-gold">
                Eksklusif & Mewah
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Pilih tema undangan digital berkelas untuk membagikan kebahagiaan Anda secara instan kepada keluarga dan sahabat dekat. Dilengkapi musik latar romantis, galeri foto, RSVP, dan peta navigasi terintegrasi.
            </p>
          </div>

          {/* Categories Tab Navigation */}
          <div className="flex flex-col items-center space-y-4 pt-4">
            {/* Baris 1: Filter Budaya (INDUK - Statis) */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["Semua", "Lokal", "Nasional", "Internasional"].map((cat) => {
                // Menghitung total absolut di database (Statis)
                const count = cat === "Semua" ? themesData.length : themesData.filter(t => t.category === cat).length;
                const displayCat = cat === "Semua" ? "Semua" : categoryMap[cat];

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold tracking-wide transition-all duration-300 flex items-center space-x-1.5 border",
                      activeCategory === cat
                        ? "bg-gradient-to-r from-gold to-yellow-500 text-navy-dark border-transparent shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    )}
                  >
                    <span>{displayCat}</span>
                    <span className={cn("px-2 py-0.5 rounded-xl text-[10px]", activeCategory === cat ? "bg-navy-dark/20 text-navy-dark" : "bg-white/10 text-slate-400")}>{count}</span>
                  </button>
                )
              })}
            </div>

            {/* Baris 2: Filter Kasta (ANAK - Dinamis terhadap Budaya) */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {["Semua", "Premium", "Eksklusif", "Luxury"].map((tier) => {
                // Menghitung distribusi kasta berdasarkan Budaya yang sedang aktif
                const count = themesData.filter(t =>
                  (activeCategory === "Semua" || t.category === activeCategory) &&
                  (tier === "Semua" || getThemeTier(getDynamicPrice(t)) === tier)
                ).length;

                return (
                  <button
                    key={tier}
                    onClick={() => setActiveTier(tier)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold tracking-wide transition-all duration-300 flex items-center space-x-1.5 border",
                      activeTier === tier
                        ? "bg-gradient-to-r from-gold to-yellow-500 text-navy-dark border-transparent shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    )}
                  >
                    <span>{tier}</span>
                    <span className={cn("px-2 py-0.5 rounded-xl text-[10px]", activeTier === tier ? "bg-navy-dark/20 text-navy-dark" : "bg-white/10 text-slate-400")}>{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Theme List Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 pt-4">
            {themesData.filter(theme => {
              const matchCategory = activeCategory === "Semua" || theme.category === activeCategory;
              const matchTier = activeTier === "Semua" || getThemeTier(getDynamicPrice(theme)) === activeTier;
              return matchCategory && matchTier;
            }).map((theme) => {
              return (
                <div
                  key={theme.id}
                  className="group relative flex flex-col rounded-2xl overflow-hidden bg-navy-darker/50 border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-gold/30"
                >
                  {/* Diagonal Ribbon Badge (Top Left Slanted) */}
                  {activeTier === "Semua" && (
                    <div className="absolute top-5 -left-10 w-40 -rotate-45 z-30 pointer-events-none">
                      <div className={cn(
                        "w-full text-center py-1.5 shadow-lg text-[9px] font-black uppercase tracking-widest",
                        getThemeTier(getDynamicPrice(theme)) === 'Luxury' ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]" :
                          getThemeTier(getDynamicPrice(theme)) === 'Eksklusif' ? "bg-gradient-to-r from-gold to-yellow-600 text-navy-dark shadow-[0_0_15px_rgba(212,175,55,0.4)]" :
                            "bg-emerald-600 text-white shadow-[0_0_15px_rgba(5,150,105,0.4)]"
                      )}>
                        {getThemeTier(getDynamicPrice(theme))}
                      </div>
                    </div>
                  )}

                  {/* Image Cover (Mockup Style in Dark Mode) */}
                  <div
                    className="relative w-full aspect-[4/5] flex items-center justify-center px-6 pt-8 pb-4 bg-gradient-to-b from-white/5 to-transparent cursor-pointer group/img"
                    onClick={() => setPreviewThemeId(theme.id)}
                  >
                    <div className="relative w-full h-full bg-navy-dark rounded-xl shadow-xl overflow-hidden border border-white/10 group-hover/img:border-gold/50 transition-colors duration-500">
                      {/* Dynamic CSS Mockup (Sangat Ringan, Muncul Otomatis!) */}
                      <div 
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 border-8 transition-transform duration-700 group-hover/img:scale-105"
                        style={{ 
                          backgroundColor: theme.colors[0], 
                          borderColor: theme.colors[1] || 'rgba(255,255,255,0.1)' 
                        }}
                      >
                        {/* Ornament Mockup */}
                        <div 
                          className="w-20 h-20 rounded-full border-[3px] border-dashed mb-6 opacity-60 flex items-center justify-center"
                          style={{ borderColor: theme.colors[2] }}
                        >
                           <div className="w-10 h-10 rounded-full opacity-40" style={{ backgroundColor: theme.colors[2] }} />
                        </div>
                        
                        {/* Text Mockup */}
                        <div className="w-3/4 h-3 rounded-full mb-3 opacity-80" style={{ backgroundColor: theme.colors[3] }} />
                        <div className="w-1/2 h-2 rounded-full mb-8 opacity-50" style={{ backgroundColor: theme.colors[3] }} />
                        
                        {/* Button Mockup */}
                        <div className="w-full max-w-[140px] h-8 rounded-full opacity-90 shadow-md" style={{ backgroundColor: theme.colors[2] }} />
                        
                        {/* Subtle Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay" />
                      </div>

                      {/* Hover Play Button Overlay (HANYA DI DALAM GAMBAR) */}
                      <div className="absolute inset-0 z-20 bg-navy-dark/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 bg-gold/90 backdrop-blur-sm rounded-full flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                          <svg className="w-5 h-5 text-navy-dark" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info & Title Section (Centered Below Image) */}
                  <div className="w-full flex items-center justify-center px-4 pt-2 pb-5 bg-transparent relative z-20">
                    <h4
                      className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-widest truncate text-center w-full drop-shadow-md"
                      style={{ color: getThemeTitleColor(theme.id) }}
                    >
                      {theme.name}
                    </h4>
                  </div>

                  {/* Split Buttons Container */}
                  <div className="flex bg-navy-darker relative z-10 border-t border-white/10">
                    <button
                      onClick={() => setPreviewThemeId(theme.id)}
                      className="flex-1 py-4 flex items-center justify-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                    <div className="w-px bg-white/10" />
                    <button
                      onClick={() => router.push(`/undangan/booking?themeId=${theme.id}`)}
                      className="flex-1 py-4 flex items-center justify-center space-x-1.5 text-xs font-bold text-gold hover:bg-gold/10 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Pilih</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>



        </div>

      </div>

      {/* Preview Modal */}
      {previewThemeId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] min-h-[500px] md:min-h-[600px] bg-navy-dark border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setPreviewThemeId(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Live Iframe Preview */}
            <div className="relative w-full md:w-1/2 h-[60vh] md:h-auto bg-navy-darker border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
              {(() => {
                const pTheme = themesData.find(t => t.id === previewThemeId);
                // Menambahkan query param ?coverOnly=true agar theme hanya merender halaman cover (sangat ringan)
                return (
                  <iframe 
                    src={`/demo/${pTheme?.id}?coverOnly=true`} 
                    className="w-full h-full border-0 absolute inset-0 pointer-events-none"
                    title={pTheme?.name || "Live Theme Preview"}
                  />
                );
              })()}
            </div>

            {/* Right: Content */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-navy-darker/50">
              {(() => {
                const pTheme = themesData.find(t => t.id === previewThemeId);
                if (!pTheme) return null;

                return (
                  <>
                    <div className="space-y-6">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1 block">
                          Kesan: {pTheme.vibe}
                        </span>
                        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                          {pTheme.name}
                        </h3>
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed">
                        {pTheme.description}
                      </p>

                      <div className="space-y-2">
                        <span className="text-xs text-slate-500 font-medium">Palet Warna Utama:</span>
                        <div className="flex items-center space-x-3 pt-1">
                          {pTheme.colors.map((c, i) => (
                            <div
                              key={i}
                              style={{ backgroundColor: c }}
                              className="w-8 h-8 rounded-full border-2 border-white/10 shadow-inner"
                              title={c}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="py-4 border-y border-white/5 flex flex-col space-y-1">
                        <span className="text-xs text-slate-400 font-medium">Harga Standalone:</span>
                        <div className="flex flex-col space-y-0.5 pt-1">
                          {getDiscountPercentage(pTheme, getDynamicPrice(pTheme)) > 0 && (
                            <span className="text-sm font-bold text-slate-400 line-through decoration-red-500 decoration-2 mb-1">
                              {formatIDR(getOriginalPrice(pTheme, pTheme.priceStandalone))}
                            </span>
                          )}
                          <div className="flex items-end space-x-3">
                            <span className="font-heading font-black text-3xl text-gold drop-shadow-md leading-none">
                              {formatIDR(getDynamicPrice(pTheme))}
                            </span>
                            {getDiscountPercentage(pTheme, getDynamicPrice(pTheme)) > 0 && (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-red-500 text-white mb-0.5 shadow-sm">
                                Diskon {getDiscountPercentage(pTheme, getDynamicPrice(pTheme))}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4">
                      <button
                        onClick={() => router.push(`/undangan/booking?themeId=${pTheme.id}`)}
                        className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl text-sm font-bold text-navy-dark bg-white hover:bg-slate-200 transition-all active:scale-[0.98]"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Pilih Tema Ini</span>
                      </button>

                      <button
                        onClick={() => window.open(`/demo/${pTheme.id}`, '_blank')}
                        className="w-full mt-3 flex items-center justify-center space-x-2 py-3 rounded-xl border border-white/20 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
                      >
                        <span>Pratinjau Live Demo</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}


    </>
  );
}
