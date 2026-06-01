"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Heart, FileText, MapPin, Phone, User, Calendar, Send, CheckCircle, Info, Eye, X, Clock } from "lucide-react";
import themesData from "@/data/themes.json";
import { formatIDR, cn } from "@/lib/utils";

export default function UndanganPage() {
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  
  // Invitation Details Form
  const [formData, setFormData] = useState({
    clientName: "",
    clientWhatsapp: "",
    groomName: "",
    groomNameShort: "",
    brideName: "",
    brideNameShort: "",
    akadDate: "",
    akadTime: "",
    resepsiDate: "",
    resepsiTime: "",
    venue: "",
    mapsLink: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [previewThemeId, setPreviewThemeId] = useState(null);

  const selectedTheme = themesData.find((t) => t.id === selectedThemeId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName.trim()) newErrors.clientName = "Nama lengkap Anda wajib diisi.";
    
    if (!formData.clientWhatsapp.trim()) {
      newErrors.clientWhatsapp = "Nomor WhatsApp wajib diisi.";
    } else {
      const waRegex = /^(08|62|\+62)[0-9]{8,13}$/;
      if (!waRegex.test(formData.clientWhatsapp.replace(/\s+/g, ""))) {
        newErrors.clientWhatsapp = "Format nomor WhatsApp tidak valid.";
      }
    }

    if (!formData.groomName.trim()) newErrors.groomName = "Nama lengkap mempelai pria wajib diisi.";
    if (!formData.brideName.trim()) newErrors.brideName = "Nama lengkap mempelai wanita wajib diisi.";
    
    if (!formData.akadDate) newErrors.akadDate = "Tanggal akad nikah wajib diisi.";
    if (!formData.resepsiDate) newErrors.resepsiDate = "Tanggal resepsi pernikahan wajib diisi.";
    if (!formData.venue.trim()) newErrors.venue = "Nama & alamat venue wajib diisi.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const formatDate = (dateString) => {
      if (!dateString) return "";
      return dateString.split("-").reverse().join("/");
    };

    const adminWhatsapp = process.env.NEXT_PUBLIC_ADMIN_WA || "6285147746761"; 

    const message = `Halo Admin JD Music! Saya ingin memesan pembuatan Undangan Digital:

*DETAIL PEMESANAN*
Nama Klien : ${formData.clientName}
WhatsApp   : ${formData.clientWhatsapp}
Tema Pilihan: ${selectedTheme.name}

*DATA PERNIKAHAN*
Mempelai Pria  : ${formData.groomName} (${formData.groomNameShort || "-"})
Mempelai Wanita: ${formData.brideName} (${formData.brideNameShort || "-"})
Tanggal Akad   : ${formatDate(formData.akadDate)} @ ${formData.akadTime || "09.00 - Selesai"}
Tanggal Resepsi: ${formatDate(formData.resepsiDate)} @ ${formData.resepsiTime || "11.00 - Selesai"}
Lokasi/Venue   : ${formData.venue}
Link Gmaps     : ${formData.mapsLink || "-"}

*Catatan Khusus*: 
${formData.notes.trim() || "-"}

Total Harga    : ${formatIDR(selectedTheme.priceStandalone)}

Tolong bantu proses undangan saya ya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsapp}?text=${encodedMessage}`;

    // Simpan URL dan buka modal (menghindari popup blocker)
    setWaUrl(whatsappUrl);

    setIsSubmitting(false);
    setShowSuccessModal(true);
  };

  return (
    <>
      <div className="min-h-screen pt-28 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Background Radial Glow */}
      <div className="absolute top-[10%] right-1/4 w-[500px] h-[500px] rounded-full bg-radial-gradient-glow opacity-25 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1 text-gold text-xs font-semibold tracking-[0.2em] uppercase">
            <Heart className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span>Undangan Digital Standalone</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
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
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-8">
          {["Semua", "Lokal", "Nasional", "Internasional"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300",
                activeCategory === cat
                  ? "bg-gradient-to-r from-gold to-yellow-500 text-navy-dark shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Theme List Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {themesData.filter(theme => activeCategory === "Semua" || theme.category === activeCategory).map((theme) => {
            const isSelected = selectedThemeId === theme.id;
            return (
              <div
                key={theme.id}
                className={cn(
                  "group relative flex flex-col rounded-2xl overflow-hidden bg-white/[0.01] transition-all duration-300",
                  isSelected 
                    ? "ring-2 ring-gold shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
                    : "hover:bg-white/[0.02] hover:-translate-y-1"
                )}
              >
                {/* Image Cover */}
                <div className="relative w-full aspect-[4/5] bg-navy-darker overflow-hidden">
                  <Image 
                    src={theme.previewUrl || "/logo-3d.png"} 
                    alt={theme.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient Overlay for bottom text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-darker via-navy-darker/20 to-transparent opacity-90" />
                  
                  {/* Title & Badge inside image at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1.5">
                      {theme.vibe.split(',')[0]}
                    </span>
                    <h3 className="font-heading font-extrabold text-lg text-white leading-tight">
                      {theme.name}
                    </h3>
                  </div>
                </div>

                {/* Split Buttons Container */}
                <div className="flex bg-navy-darker/50 border-t border-white/5 relative z-10">
                  <button
                    onClick={() => setPreviewThemeId(theme.id)}
                    className="flex-1 py-3.5 flex items-center justify-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <div className="w-px bg-white/5" />
                  <button
                    onClick={() => {
                      setSelectedThemeId(theme.id);
                      setTimeout(() => {
                        document.getElementById("invitation-form")?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className={cn(
                      "flex-1 py-3.5 flex items-center justify-center space-x-1.5 text-xs font-bold transition-colors",
                      isSelected
                        ? "text-navy-dark bg-gold"
                        : "text-gold hover:bg-gold/10"
                    )}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isSelected ? "Terpilih" : "Pilih"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Personalization Form */}
        {selectedThemeId && (
          <div id="invitation-form" className="max-w-4xl mx-auto glass-card p-6 sm:p-10 rounded-3xl border border-gold/20 shadow-2xl relative overflow-hidden glow-gold animate-fade-in">
            <div className="absolute top-0 left-0 w-48 h-48 bg-radial-gradient-glow opacity-25 pointer-events-none" />

            <div className="text-center mb-8 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gold">Langkah Kedua</span>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                Personalisasi Undangan - Tema {selectedTheme.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Silakan isi data pengantin dan detail akad/resepsi di bawah. Admin akan langsung menyusun rancangan undangan digital Anda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Section 1: Client info */}
              <div className="space-y-4">
                <h4 className="font-heading font-bold text-sm sm:text-base text-white border-b border-white/5 pb-2">
                  1. Data Kontak Pemesan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                      <User className="w-4 h-4 text-gold" />
                      <span>Nama Pemesan *</span>
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      placeholder="Nama Lengkap Anda"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors",
                        errors.clientName ? "border-red-500/50" : "border-white/10"
                      )}
                    />
                    {errors.clientName && <p className="text-xs text-red-400 pl-1">{errors.clientName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                      <Phone className="w-4 h-4 text-gold" />
                      <span>Nomor WhatsApp Aktif *</span>
                    </label>
                    <input
                      type="text"
                      name="clientWhatsapp"
                      value={formData.clientWhatsapp}
                      onChange={handleInputChange}
                      placeholder="Contoh: 081234567890"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors",
                        errors.clientWhatsapp ? "border-red-500/50" : "border-white/10"
                      )}
                    />
                    {errors.clientWhatsapp && <p className="text-xs text-red-400 pl-1">{errors.clientWhatsapp}</p>}
                  </div>
                </div>
              </div>

              {/* Form Section 2: Couple info */}
              <div className="space-y-4">
                <h4 className="font-heading font-bold text-sm sm:text-base text-white border-b border-white/5 pb-2">
                  2. Nama Mempelai Pengantin
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Groom */}
                  <div className="space-y-3 p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                    <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <span>Mempelai Pria</span>
                    </h5>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Nama Lengkap *</label>
                      <input
                        type="text"
                        name="groomName"
                        value={formData.groomName}
                        onChange={handleInputChange}
                        placeholder="Contoh: Adam Alamsyah, S.T."
                        className={cn(
                          "w-full px-4 py-2.5 rounded-lg bg-white/5 border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors",
                          errors.groomName ? "border-red-500/50" : "border-white/10"
                        )}
                      />
                      {errors.groomName && <p className="text-xs text-red-400 pl-1">{errors.groomName}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Nama Panggilan (Short)</label>
                      <input
                        type="text"
                        name="groomNameShort"
                        value={formData.groomNameShort}
                        onChange={handleInputChange}
                        placeholder="Contoh: Adam"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  {/* Bride */}
                  <div className="space-y-3 p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                    <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                      <span>Mempelai Wanita</span>
                    </h5>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Nama Lengkap *</label>
                      <input
                        type="text"
                        name="brideName"
                        value={formData.brideName}
                        onChange={handleInputChange}
                        placeholder="Contoh: Revi Amalia, S.Ak."
                        className={cn(
                          "w-full px-4 py-2.5 rounded-lg bg-white/5 border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors",
                          errors.brideName ? "border-red-500/50" : "border-white/10"
                        )}
                      />
                      {errors.brideName && <p className="text-xs text-red-400 pl-1">{errors.brideName}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Nama Panggilan (Short)</label>
                      <input
                        type="text"
                        name="brideNameShort"
                        value={formData.brideNameShort}
                        onChange={handleInputChange}
                        placeholder="Contoh: Revi"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section 3: Event details */}
              <div className="space-y-4">
                <h4 className="font-heading font-bold text-sm sm:text-base text-white border-b border-white/5 pb-2">
                  3. Detail Pelaksanaan Acara
                </h4>
                
                {/* Akad nikah details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                  <div className="space-y-1 sm:col-span-2">
                    <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-gold">A. Akad Nikah</h5>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Tanggal Akad *</span>
                    </label>
                    <input
                      type="date"
                      name="akadDate"
                      value={formData.akadDate}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-lg bg-white/5 border text-xs text-white focus:outline-none focus:border-gold scheme-dark",
                        errors.akadDate ? "border-red-500/50" : "border-white/10"
                      )}
                    />
                    {errors.akadDate && <p className="text-xs text-red-400 pl-1">{errors.akadDate}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Waktu / Jam Akad *</span>
                    </label>
                    <input
                      type="text"
                      name="akadTime"
                      value={formData.akadTime}
                      onChange={handleInputChange}
                      placeholder="Contoh: 08.00 - 10.00 WIB"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Resepsi details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                  <div className="space-y-1 sm:col-span-2">
                    <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-gold">B. Resepsi Pernikahan</h5>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Tanggal Resepsi *</span>
                    </label>
                    <input
                      type="date"
                      name="resepsiDate"
                      value={formData.resepsiDate}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-lg bg-white/5 border text-xs text-white focus:outline-none focus:border-gold scheme-dark",
                        errors.resepsiDate ? "border-red-500/50" : "border-white/10"
                      )}
                    />
                    {errors.resepsiDate && <p className="text-xs text-red-400 pl-1">{errors.resepsiDate}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Waktu / Jam Resepsi *</span>
                    </label>
                    <input
                      type="text"
                      name="resepsiTime"
                      value={formData.resepsiTime}
                      onChange={handleInputChange}
                      placeholder="Contoh: 11.00 - 14.00 WIB"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Location & Map details */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-gold" />
                      <span>Nama & Alamat Lengkap Venue *</span>
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      placeholder="Contoh: Sheraton Hotel, Lt. 2 Ballroom, Bandung"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors",
                        errors.venue ? "border-red-500/50" : "border-white/10"
                      )}
                    />
                    {errors.venue && <p className="text-xs text-red-400 pl-1">{errors.venue}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Link Google Maps Lokasi (Opsional)</label>
                    <input
                      type="text"
                      name="mapsLink"
                      value={formData.mapsLink}
                      onChange={handleInputChange}
                      placeholder="https://maps.google.com/?q=Sheraton..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Form Section 4: Notes */}
              <div className="space-y-4">
                <h4 className="font-heading font-bold text-sm sm:text-base text-white border-b border-white/5 pb-2">
                  4. Catatan & Keterangan Tambahan
                </h4>
                <div className="space-y-1">
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Contoh: request warna tema pastel, tambah menu RSVP checklist kehadiran, link video prewedding, dll."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Summary & Submit */}
              <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs text-slate-400 font-medium">Total Harga Standalone:</span>
                  <div className="font-heading font-black text-2xl text-gold">
                    {formatIDR(selectedTheme.priceStandalone)}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-bold text-navy-dark bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-600 hover:to-gold active:scale-[0.98] transition-all duration-300 shadow-lg shadow-gold/15"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? "Memproses..." : "Kirim Form Undangan via WhatsApp"}</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

      </div>

      {/* Preview Modal */}
      {previewThemeId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-navy-dark border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setPreviewThemeId(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Image Full */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-black border-b md:border-b-0 md:border-r border-white/10">
              {(() => {
                const pTheme = themesData.find(t => t.id === previewThemeId);
                return (
                  <Image 
                    src={pTheme?.previewUrl || "/logo-3d.png"} 
                    alt={pTheme?.name || "Preview"} 
                    fill 
                    className="object-cover"
                  />
                );
              })()}
            </div>

            {/* Right: Content */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-navy-darker/50">
              {(() => {
                const pTheme = themesData.find(t => t.id === previewThemeId);
                if (!pTheme) return null;
                const isSelected = selectedThemeId === pTheme.id;
                
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
                        <span className="font-heading font-extrabold text-2xl text-gold">
                          {formatIDR(pTheme.priceStandalone)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 pt-4">
                      <button
                        onClick={() => {
                          setSelectedThemeId(pTheme.id);
                          setPreviewThemeId(null);
                          setTimeout(() => {
                            document.getElementById("invitation-form")?.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }}
                        className={cn(
                          "w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98]",
                          isSelected
                            ? "text-navy-dark bg-gradient-to-r from-gold to-yellow-500 shadow-lg shadow-gold/20"
                            : "text-navy-dark bg-white hover:bg-slate-200"
                        )}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{isSelected ? "Tema Ini Sedang Terpilih" : "Pilih Tema Ini"}</span>
                      </button>

                      <button
                        onClick={() => window.open(`/demo/${pTheme.id}`, '_blank')}
                        className="w-full mt-3 flex items-center justify-center space-x-2 py-3 rounded-xl border border-white/20 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
                      >
                        <span>Lihat Demo Lengkap (Sistem Tema)</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal Confirmation */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setShowSuccessModal(false)} className="absolute inset-0 bg-navy-dark/90 backdrop-blur-md" />
          
          <div className="relative glass-card border border-gold/30 rounded-3xl p-8 max-w-md text-center space-y-6 shadow-2xl z-10 glow-gold animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-gold" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-xl text-white">Satu Langkah Lagi!</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Rincian data pengantin Anda telah direkap. Sistem kami sedang membuka aplikasi WhatsApp Anda.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gold/10 border border-gold/20 text-xs text-slate-300 space-y-3 text-left">
              <p className="text-gold font-bold text-center">⚠️ PERHATIAN</p>
              <p>Sistem <strong>belum</strong> mengirimkan data secara otomatis. Silakan klik tombol hijau di bawah ini untuk membuka WhatsApp.</p>
              <p>Mohon tekan tombol <strong>KIRIM (Send)</strong> di aplikasi WhatsApp Anda agar pesan tersebut masuk ke Admin JD Music untuk segera diproses.</p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setTimeout(() => {
                    setShowSuccessModal(false);
                  }, 1000);
                }}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
              >
                <span>Buka WhatsApp Sekarang</span>
              </a>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/");
                }}
                className="w-full py-3.5 rounded-xl font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                Batal (Kembali ke Beranda)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
