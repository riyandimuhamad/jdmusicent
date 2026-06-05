"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, User, Phone, MapPin, FileText, CheckCircle, Gift, Sparkles, Send } from "lucide-react";
import packagesData from "@/data/packages.json";
import themesData from "@/data/themes.json";
import { formatIDR, cn } from "@/lib/utils";

const getThemeTier = (price) => {
  if (price >= 350000) return 'Luxury';
  if (price >= 250000) return 'Eksklusif';
  return 'Premium';
};

function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Load selected package from URL query param
  const initialPackageId = searchParams.get("package") || "";

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    date: "",
    venue: "",
    notes: ""
  });

  const [selectedPackageId, setSelectedPackageId] = useState(initialPackageId);
  const [isAddonChecked, setIsAddonChecked] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState(themesData[0].id);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [activeThemeCategory, setActiveThemeCategory] = useState("Semua");

  // Derived Values
  const selectedPackage = packagesData.find((p) => p.id === selectedPackageId) || null;
  const selectedTheme = themesData.find((t) => t.id === selectedThemeId) || themesData[0];

  const packagePrice = selectedPackage ? selectedPackage.price : 0;
  
  // Rule: Addon has standard discount when bundled, or is free if Premium package
  const isPremiumPackage = selectedPackage?.id === "premium" || selectedPackage?.id === "grand-band-prestige"; // Adapting if ID is different
  const addonPrice = isPremiumPackage 
    ? 0 
    : (isAddonChecked ? selectedTheme.priceAddon : 0);

  const totalPrice = packagePrice + addonPrice;
  const originalTotalPrice = (selectedPackage ? selectedPackage.originalPrice : 0) + (isAddonChecked ? selectedTheme.priceStandalone : 0);
  const totalSavings = originalTotalPrice > totalPrice ? originalTotalPrice - totalPrice : 0;

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nama lengkap wajib diisi.";
    
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "Nomor WhatsApp wajib diisi.";
    } else {
      const waRegex = /^(08|62|\+62)[0-9]{8,13}$/;
      if (!waRegex.test(formData.whatsapp.replace(/\s+/g, ""))) {
        newErrors.whatsapp = "Format nomor WhatsApp tidak valid (Gunakan 08xx/62xx).";
      }
    }

    if (!formData.date) {
      newErrors.date = "Tanggal acara wajib dipilih.";
    } else {
      const eventDate = new Date(formData.date);
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 14); // Rule H+14 (PRD 4.4)
      
      if (eventDate < minDate) {
        newErrors.date = "Pemesanan harus dilakukan minimal H-14 dari hari ini.";
      }
    }

    if (!formData.venue.trim()) newErrors.venue = "Nama & alamat venue wajib diisi.";
    if (!selectedPackageId) newErrors.package = "Silakan pilih Paket Musik terlebih dahulu.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Format Date (DD/MM/YYYY)
    const dateObj = new Date(formData.date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // WhatsApp Message Builder
    const whatsappNumber = process.env.NEXT_PUBLIC_ADMIN_WA || "6285147746761"; 
    
    const message = `Halo Admin JD Music! Saya ingin menanyakan ketersediaan jadwal untuk acara pernikahan saya:

*DETAIL ACARA*
Nama Pemesan : ${formData.name}
No. WhatsApp : ${formData.whatsapp}
Tgl. Acara   : ${formattedDate}
Lokasi/Venue : ${formData.venue}

*PAKET YANG DIPILIH*
Paket Musik  : ${selectedPackage?.name}
Add-on Undgn : ${isPremiumPackage ? "Undangan Digital (GRATIS/BUNDLE)" : (isAddonChecked ? "Undangan Digital" : "Tidak Ada")}
Tema Undangan: ${isPremiumPackage || isAddonChecked ? selectedTheme.name : "-"}
Total Harga  : ${formatIDR(totalPrice)}

*Catatan Khusus*: 
${formData.notes.trim() || "-"}

Apakah jadwal di tanggal tersebut masih tersedia? Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Simpan URL dan buka modal (menghindari popup blocker)
    setWaUrl(whatsappUrl);

    setIsSubmitting(false);
    setShowSuccessModal(true);
  };

  return (
    <>
      <div className="min-h-screen pt-28 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Background Radial Glow */}
      <div className="absolute top-[15%] left-1/4 w-[500px] h-[500px] rounded-full bg-radial-gradient-glow opacity-25 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1 text-gold text-xs font-semibold tracking-[0.2em] uppercase">
            <Calendar className="w-3.5 h-3.5" />
            <span>Form Booking Online</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
            Amankan Tanggal <br />
            <span className="bg-gradient-to-r from-gold via-gold-champagne to-electric bg-clip-text text-transparent text-glow-gold">
              Acara Anda
            </span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Silakan lengkapi form berikut untuk mendaftarkan jadwal acara pernikahan Anda. Kami akan langsung mengonfirmasi ketersediaan slot via WhatsApp.
          </p>
        </div>

        {/* Booking Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Form Fields */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8 glass-card p-6 sm:p-8 rounded-3xl border border-white/5 shadow-xl">
            
            {/* Section 1: Client Bio details */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-base sm:text-lg text-white border-b border-white/5 pb-2">
                1. Informasi Kontak
              </h3>
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center space-x-2">
                  <User className="w-4 h-4 text-gold" />
                  <span>Nama Lengkap *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Anisa Rahmawati"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors",
                    errors.name ? "border-red-500/50" : "border-white/10"
                  )}
                />
                {errors.name && <p className="text-xs text-red-400 pl-1">{errors.name}</p>}
              </div>

              {/* WhatsApp */}
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gold" />
                  <span>Nomor WhatsApp Aktif *</span>
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="Contoh: 081234567890"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors",
                    errors.whatsapp ? "border-red-500/50" : "border-white/10"
                  )}
                />
                {errors.whatsapp && <p className="text-xs text-red-400 pl-1">{errors.whatsapp}</p>}
              </div>
            </div>

            {/* Section 2: Event details */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-base sm:text-lg text-white border-b border-white/5 pb-2">
                2. Detail Acara Pernikahan
              </h3>

              {/* Datepicker with H+14 restriction */}
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gold" />
                  <span>Tanggal Acara * (Minimal H-14)</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white focus:outline-none focus:border-gold transition-colors scheme-dark",
                    errors.date ? "border-red-500/50" : "border-white/10"
                  )}
                />
                {errors.date && <p className="text-xs text-red-400 pl-1">{errors.date}</p>}
              </div>

              {/* Venue details */}
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span>Nama & Alamat Venue Acara *</span>
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
            </div>

            {/* Section 3: Package Select & Add-on Bundling */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-base sm:text-lg text-white border-b border-white/5 pb-2">
                3. Layanan & Bundling Undangan Digital
              </h3>

              {/* Music Package Selector */}
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-300">Pilih Paket Musik Utama</label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => {
                    setSelectedPackageId(e.target.value);
                    if (errors.package) setErrors((prev) => ({ ...prev, package: null }));
                  }}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl bg-navy-light border text-sm text-white focus:outline-none focus:border-gold transition-colors",
                    errors.package ? "border-red-500/50" : "border-white/10"
                  )}
                >
                  <option value="" disabled>-- Pilih Paket Musik Utama Anda --</option>
                  {packagesData.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {formatIDR(p.price)}
                    </option>
                  ))}
                </select>
                {errors.package && <p className="text-xs text-red-400 pl-1 mt-1">{errors.package}</p>}
              </div>

              {/* Checkbox selector addon */}
              <div className="pt-2">
                {isPremiumPackage ? (
                  // Premium Package free bundle info
                  <div className="flex items-start space-x-3 p-4 rounded-xl bg-gold/10 border border-gold/30">
                    <Gift className="w-5 h-5 text-gold flex-shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gold">FREE Premium Bundling Undangan Digital!</h4>
                      <p className="text-xs text-slate-300 leading-normal mt-0.5">
                        Paket Premium sudah termasuk lisensi Undangan Digital Premium dengan request kustom tema bebas secara gratis (Hemat Rp 350.000).
                      </p>
                    </div>
                  </div>
                ) : (
                  // Standard addon checkbox
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={isAddonChecked}
                        onChange={(e) => setIsAddonChecked(e.target.checked)}
                        className="w-4.5 h-4.5 rounded border-white/20 accent-gold"
                      />
                      <div className="flex-grow select-none">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-white">Tambahkan Undangan Digital</span>
                            <span className="text-[9px] font-extrabold uppercase bg-gold/15 text-gold px-1.5 py-0.5 rounded tracking-wider whitespace-nowrap">Bundling Promo</span>
                          </div>
                          <span className="text-xs font-bold text-gold whitespace-nowrap">
                            {isAddonChecked ? `+ ${formatIDR(selectedTheme.priceAddon)}` : "Mulai dari + Rp 105.000"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-normal">
                          {isAddonChecked ? (
                            <>Dapatkan Harga Spesial Bundling. Anda berhemat <span className="text-white font-semibold">{formatIDR(selectedTheme.priceStandalone - selectedTheme.priceAddon)}</span> untuk tema <span className="text-gold font-semibold">{selectedTheme.name}</span>.</>
                          ) : (
                            "Centang untuk memilih desain. Dapatkan harga spesial khusus pemesanan beserta paket musik."
                          )}
                        </p>
                      </div>
                    </label>

                    {/* Show theme selector if checked */}
                    {isAddonChecked && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 animate-fade-in">
                        <div className="flex flex-col space-y-3">
                          <label className="text-xs sm:text-sm font-semibold text-slate-300">Pilih Desain Tema Undangan</label>
                          <div className="flex flex-wrap gap-2">
                            {["Semua", "Premium", "Eksklusif", "Luxury"].map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={(e) => { e.preventDefault(); setActiveThemeCategory(cat); }}
                                className={cn(
                                  "px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all",
                                  activeThemeCategory === cat
                                    ? "bg-gold text-navy-dark"
                                    : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                                )}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          {themesData.filter(theme => activeThemeCategory === "Semua" || getThemeTier(theme.priceStandalone) === activeThemeCategory).map((theme) => (
                            <div
                              key={theme.id}
                              onClick={() => setSelectedThemeId(theme.id)}
                              className={cn(
                                "relative flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
                                selectedThemeId === theme.id
                                  ? "ring-2 ring-gold shadow-[0_0_15px_rgba(212,175,55,0.2)] bg-navy-darker"
                                  : "bg-white/[0.01] hover:bg-white/[0.03] hover:-translate-y-1"
                              )}
                            >
                              {/* Image Cover */}
                              <div className="relative w-full aspect-[4/5] bg-navy-darker overflow-hidden">
                                <Image 
                                  src={theme.previewUrl || "/logo-3d.png"} 
                                  alt={theme.name} 
                                  fill 
                                  className="object-cover transition-transform duration-500 hover:scale-105"
                                />
                                {/* Gradient Overlay for bottom text */}
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-darker via-navy-darker/40 to-transparent opacity-90" />
                                
                                {/* Content inside image at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 flex flex-col z-10">
                                  <div className="flex justify-between items-end mb-1">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-gold">
                                      {theme.vibe.split(',')[0]}
                                    </span>
                                    {selectedThemeId === theme.id && <CheckCircle className="w-3.5 h-3.5 text-gold" />}
                                  </div>
                                  <h4 className="font-heading font-extrabold text-sm sm:text-base text-white leading-tight">
                                    {theme.name}
                                  </h4>
                                  <div className="mt-1 flex items-center justify-between text-[10px] font-semibold">
                                    <span className="text-gold">{formatIDR(theme.priceAddon)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Notes */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-base sm:text-lg text-white border-b border-white/5 pb-2">
                4. Catatan Khusus & Request Lagu
              </h3>
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gold" />
                  <span>Catatan Tambahan (Opsional)</span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Sebutkan 3-5 daftar lagu wajib khusus, kebutuhan MC tambahan, rider teknis khusus, dll."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>
            </div>

          </form>

          {/* Right Column: Sticky Glass Order Review Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-[90px] space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gold/20 shadow-2xl relative overflow-hidden glow-gold">
              
              {/* Internal Decorative Radial Glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-radial-gradient-glow opacity-25 pointer-events-none" />

              <h3 className="font-heading font-extrabold text-lg text-white mb-6 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-gold animate-pulse" />
                <span>Ringkasan Booking (Review)</span>
              </h3>

              {/* Price Details Breakdown */}
              <div className="space-y-4 text-xs sm:text-sm border-b border-white/5 pb-6">
                
                {!selectedPackageId ? (
                  <div className="p-4 rounded-xl bg-gold/10 border border-gold/20 text-center">
                    <p className="text-gold font-bold">Paket Belum Dipilih</p>
                    <p className="text-slate-400 text-xs mt-1">Silakan pilih Paket Musik Utama pada formulir di sebelah kiri untuk melihat rincian harga.</p>
                  </div>
                ) : (
                  <>
                    {/* Main Music Package Price */}
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Paket Utama ({selectedPackage.name}):</span>
                      <span className="font-semibold text-white">{formatIDR(packagePrice)}</span>
                    </div>

                    {/* Invitation Add-on Price */}
                    {(isAddonChecked || isPremiumPackage) && (
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">
                          Add-on Undangan ({selectedTheme.name}):
                        </span>
                        <span className="font-semibold text-white">
                          {isPremiumPackage ? "GRATIS" : formatIDR(addonPrice)}
                        </span>
                      </div>
                    )}

                    {/* Savings / Discount */}
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-emerald-400 font-medium bg-emerald-500/10 p-3 rounded-xl">
                        <span>Total Hemat Anda:</span>
                        <span>- {formatIDR(totalSavings)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Real-time total cost display */}
              <div className="py-6 flex justify-between items-baseline">
                <span className="font-heading font-bold text-sm text-slate-300">Total Harga:</span>
                <div className="text-right space-y-1">
                  <div className="font-heading font-black text-2xl sm:text-3xl text-gold">
                    {!selectedPackageId ? "-" : formatIDR(totalPrice)}
                  </div>
                  <span className="text-[10px] text-slate-500 block">Sudah termasuk pajak & kru</span>
                </div>
              </div>

              {/* Submit CTA WhatsApp button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-3 py-4 rounded-2xl font-bold text-navy-dark bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-600 hover:to-gold active:scale-[0.98] transition-all duration-300 shadow-lg shadow-gold/15"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? "Memproses..." : "Kirim Booking via WhatsApp"}</span>
              </button>

              <p className="text-[11px] text-slate-500 text-center mt-4">
                Dengan menekan tombol di atas, Anda akan dialihkan ke WhatsApp Admin JD Music untuk verifikasi jadwal.
              </p>
            </div>
          </div>

        </div>

      </div>

      </div>

      {/* Success Modal Confirmation */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Blur Backdrop */}
          <div onClick={() => setShowSuccessModal(false)} className="absolute inset-0 bg-navy-dark/90 backdrop-blur-md" />
          
          {/* Modal Container */}
          <div className="relative glass-card border border-gold/30 rounded-3xl p-8 max-w-md text-center space-y-6 shadow-2xl z-10 glow-gold animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-gold" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-xl text-white">Satu Langkah Lagi!</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Formulir Anda telah direkap. Sistem kami sedang membuka aplikasi WhatsApp Anda.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gold/10 border border-gold/20 text-xs text-slate-300 space-y-3 text-left">
              <p className="text-gold font-bold text-center">⚠️ PERHATIAN</p>
              <p>Sistem <strong>belum</strong> mengirimkan pesanan secara otomatis. Silakan klik tombol hijau di bawah ini untuk membuka WhatsApp.</p>
              <p>Mohon tekan tombol <strong>KIRIM (Send)</strong> di aplikasi WhatsApp Anda agar pesan tersebut masuk ke Admin JD Music.</p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setTimeout(() => {
                    setShowSuccessModal(false);
                    // Reset form optional if needed, but staying on page is fine
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

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Memuat Halaman Form Booking...</div>}>
      <BookingFormContent />
    </Suspense>
  );
}
