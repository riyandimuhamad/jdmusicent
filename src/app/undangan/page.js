"use client";

import React, { useState } from "react";
import { Sparkles, Heart, FileText, MapPin, Phone, User, Calendar, Send, CheckCircle, Info } from "lucide-react";
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

    const adminWhatsapp = "6281234567890"; // Hardcoded Admin WA (PRD 7.1)

    // Message Builder for Standalone Invitations (Flow C)
    const message = `Halo Admin JD Music! Ada pemesanan Undangan Digital:

📅 DETAIL PEMESANAN
Nama Klien : ${formData.clientName}
WhatsApp   : ${formData.clientWhatsapp}
Tema Pilihan: ${selectedTheme.name}

💍 DATA PERNIKAHAN
Mempelai Pria  : ${formData.groomName} (${formData.groomNameShort || "-"})
Mempelai Wanita: ${formData.brideName} (${formData.brideNameShort || "-"})
Tanggal Akad   : ${formatDate(formData.akadDate)} @ ${formData.akadTime || "09.00 - Selesai"}
Tanggal Resepsi: ${formatDate(formData.resepsiDate)} @ ${formData.resepsiTime || "11.00 - Selesai"}
Lokasi/Venue   : ${formData.venue}
Link Google Maps: ${formData.mapsLink || "-"}

📝 Catatan Khusus: ${formData.notes.trim() || "-"}

Total Harga    : ${formatIDR(selectedTheme.priceStandalone)}

Mohon konfirmasi pesanan saya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsapp}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    setIsSubmitting(false);
    setShowSuccessModal(true);
  };

  return (
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

        {/* Theme List Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {themesData.map((theme) => {
            const isSelected = selectedThemeId === theme.id;
            return (
              <div
                key={theme.id}
                className={cn(
                  "glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300",
                  isSelected
                    ? "border-gold/50 glow-gold scale-100 lg:scale-[1.02] z-10"
                    : "border-white/5 hover:border-white/15"
                )}
              >
                {/* Visual Canvas Backdrop representing Invitation Style Vibe */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient-glow opacity-35 pointer-events-none" />

                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white">
                      Tema: {theme.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
                      Kesan: {theme.vibe}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed min-h-[60px]">
                    {theme.description}
                  </p>

                  {/* Theme Colors Display */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 font-medium mr-1">Palet Tema:</span>
                    {theme.colors.map((c, i) => (
                      <div
                        key={i}
                        style={{ backgroundColor: c }}
                        className="w-4 h-4 rounded-full border border-white/10"
                        title={c}
                      />
                    ))}
                  </div>

                  {/* Pricing standalone */}
                  <div className="py-4 border-y border-white/5 flex items-baseline justify-between">
                    <span className="text-xs text-slate-400 font-medium">Harga Standalone:</span>
                    <span className="font-heading font-extrabold text-xl sm:text-2xl text-gold">
                      {formatIDR(theme.priceStandalone)}
                    </span>
                  </div>
                </div>

                {/* Select button */}
                <div className="mt-8 pt-4">
                  <button
                    onClick={() => {
                      setSelectedThemeId(theme.id);
                      // Scroll smoothly to form
                      setTimeout(() => {
                        document.getElementById("invitation-form")?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className={cn(
                      "w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold transition-all active:scale-[0.98]",
                      isSelected
                        ? "text-navy-dark bg-gradient-to-r from-gold to-yellow-500 font-bold"
                        : "text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10"
                    )}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{isSelected ? "Tema Terpilih" : "Pilih Tema Ini"}</span>
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
                      <span>Waktu / Jam Akad (Contoh: 09:00 WIB - Selesai)</span>
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
                      <span>Waktu / Jam Resepsi (Contoh: 11:00 WIB - Selesai)</span>
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

      {/* Success Modal Confirmation */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowSuccessModal(false)} className="absolute inset-0 bg-navy-dark/90 backdrop-blur-md" />
          
          <div className="relative glass-card border border-gold/30 rounded-3xl p-8 max-w-md text-center space-y-6 shadow-2xl z-10 glow-gold animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-gold" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-xl text-white">Form Undangan Terkirim!</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Rincian personalisasi data pengantin Anda telah berhasil digenerate dan dikirimkan ke aplikasi WhatsApp Admin. 
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-400 space-y-2">
              <p><strong>Langkah Selanjutnya:</strong></p>
              <p>Admin kami akan memeriksa dan memvalidasi kelengkapan data pengantin Anda.</p>
              <p>Dalam 1x24 jam, tautan draft live preview undangan digital tema <strong>{selectedTheme?.name}</strong> akan kami kirimkan balik ke nomor WhatsApp Anda untuk direview bersama.</p>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/");
              }}
              className="w-full py-3.5 rounded-xl font-bold text-navy-dark bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-600 hover:to-gold transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
