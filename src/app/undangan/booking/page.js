"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Phone, User, Calendar, Send, CheckCircle, Clock, MapPin } from "lucide-react";
import themesData from "@/data/themes.json";
import { formatIDR, cn } from "@/lib/utils";
import { mockDb } from "@/lib/supabase";

const getOriginalPrice = (price) => {
  if (price <= 115000) return 150000;
  if (price === 140000) return 200000;
  return 265000;
};

const getDiscountPercentage = (price) => {
  const original = getOriginalPrice(price);
  return Math.round(((original - price) / original) * 100);
};

function BookingUndanganContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialThemeId = searchParams.get("themeId");
  
  const [selectedThemeId, setSelectedThemeId] = useState(initialThemeId || themesData[0].id);

  // Form States
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
    notes: "",
    bgmTitle: "",
    bgmUrl: "",
    bgmStart: "",
    driveLink: "",
    sendViaWa: false,
    bankName: "",
    bankAccount: "",
    bankAccountName: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [waUrl, setWaUrl] = useState("");

  const selectedTheme = themesData.find((t) => t.id === selectedThemeId) || themesData[0];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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

*ASET & MEDIA*
Lagu BGM       : ${formData.bgmTitle || "-"}
Link BGM       : ${formData.bgmUrl || "-"}
Mulai di Detik : ${formData.bgmStart || "-"}
Foto Prewedding: ${formData.sendViaWa ? "Akan dikirim manual via WA" : (formData.driveLink || "-")}

*ANGPAO / GIFT*
Bank/E-Wallet  : ${formData.bankName || "-"}
No. Rekening   : ${formData.bankAccount || "-"}
Atas Nama      : ${formData.bankAccountName || "-"}

*Catatan Khusus*: 
${formData.notes.trim() || "-"}

Total Harga    : ${formatIDR(selectedTheme.priceStandalone)}

Tolong bantu proses undangan saya ya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsapp}?text=${encodedMessage}`;

    // Save to Admin Clients
    const slug = `${formData.groomName.toLowerCase().split(' ')[0]}-${formData.brideName.toLowerCase().split(' ')[0]}`;
    const clientData = {
      id: slug,
      groom: formData.groomName,
      bride: formData.brideName,
      short: formData.groomNameShort + " & " + formData.brideNameShort,
      parentsGroom: "",
      parentsBride: "",
      themeId: selectedThemeId,
      eventDateISO: formData.akadDate || formData.resepsiDate,
      dateStr: new Date(formData.akadDate || formData.resepsiDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(),
      status: 'Nonaktif',
      akad: { date: formData.akadDate, time: formData.akadTime },
      resepsi: { date: formData.resepsiDate, time: formData.resepsiTime, venue: formData.venue, address: formData.mapsLink },
      assets: {
        gallery: [],
        bgmTitle: formData.bgmTitle,
        bgmUrl: formData.bgmUrl,
        bgmStart: formData.bgmStart
      },
      gift: {
        bank: formData.bankName,
        account: formData.bankAccount,
        name: formData.bankAccountName
      }
    };
    
    await mockDb.addClient(clientData);

    setWaUrl(whatsappUrl);
    setIsSubmitting(false);
    setShowSuccessModal(true);
    
    // Attempt to open WhatsApp automatically
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 500);
  };

  return (
    <>
      <div className="min-h-screen pt-28 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="absolute top-[10%] right-1/4 w-[500px] h-[500px] rounded-full bg-radial-gradient-glow opacity-25 pointer-events-none z-0" />

        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span>Form Pendaftaran</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-white">
            Personalisasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-500">Undangan</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Silakan lengkapi data diri dan detail acara pernikahan Anda. Kami akan segera menyusun rancangan undangan digital untuk Anda.
          </p>
        </div>

        {/* Selected Theme Preview */}
        <div className="p-4 sm:p-6 rounded-3xl bg-navy-darker/80 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center gap-6">
          <div 
            className="relative w-full sm:w-32 aspect-[3/4] rounded-xl overflow-hidden border-4 shrink-0 flex flex-col items-center justify-center p-2"
            style={{ 
              backgroundColor: selectedTheme.colors[0], 
              borderColor: selectedTheme.colors[1] || 'rgba(255,255,255,0.1)' 
            }}
          >
            {/* Ornament Mockup */}
            <div 
              className="w-8 h-8 rounded-full border-2 border-dashed mb-3 opacity-60 flex items-center justify-center"
              style={{ borderColor: selectedTheme.colors[2] }}
            >
               <div className="w-4 h-4 rounded-full opacity-40" style={{ backgroundColor: selectedTheme.colors[2] }} />
            </div>
            
            {/* Text Mockup */}
            <div className="w-3/4 h-1.5 rounded-full mb-1.5 opacity-80" style={{ backgroundColor: selectedTheme.colors[3] }} />
            <div className="w-1/2 h-1 rounded-full mb-4 opacity-50" style={{ backgroundColor: selectedTheme.colors[3] }} />
            
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay" />
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              <CheckCircle className="w-3 h-3 text-gold" />
              <span>Tema Terpilih</span>
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-white">
              {selectedTheme.name}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2 max-w-md mx-auto sm:mx-0">
              {selectedTheme.description}
            </p>
            <button
              onClick={() => router.push('/undangan')}
              className="text-xs text-gold hover:text-yellow-400 underline underline-offset-2 pt-2 transition-colors"
            >
              Ganti Tema
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-navy-dark border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-10">
            {/* Section 1 */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm sm:text-base text-white border-b border-white/5 pb-2">
                1. Data Pemesan (Klien)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-gold" />
                    <span>Nama Lengkap Anda *</span>
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

            {/* Section 2 */}
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

            {/* Section 3 */}
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

              {/* Location details */}
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

            {/* Section 4: Aset & Media */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm sm:text-base text-white border-b border-white/5 pb-2">
                4. Aset & Media (Opsional)
              </h4>
              <div className="grid grid-cols-1 gap-6 p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                <div className="space-y-3">
                  <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-gold border-b border-white/5 pb-2">Musik Latar (BGM)</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Judul Lagu</label>
                      <input type="text" name="bgmTitle" value={formData.bgmTitle} onChange={handleInputChange} placeholder="Contoh: A Thousand Years - Christina Perri" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Tautan Lagu (YouTube/Spotify)</label>
                      <input type="text" name="bgmUrl" value={formData.bgmUrl} onChange={handleInputChange} placeholder="https://..." className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Mulai dari Menit/Detik ke-</label>
                    <input type="text" name="bgmStart" value={formData.bgmStart} onChange={handleInputChange} placeholder="Contoh: 01:15" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold" />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-gold border-b border-white/5 pb-2">Foto Pre-wedding / Galeri</h5>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Tautan Folder Foto (Google Drive/Dropbox)</label>
                    <input type="text" name="driveLink" value={formData.driveLink} onChange={handleInputChange} disabled={formData.sendViaWa} placeholder="https://drive.google.com/..." className={cn("w-full px-4 py-2.5 rounded-lg border text-xs text-white focus:outline-none focus:border-gold transition-colors", formData.sendViaWa ? "bg-white/5 border-white/5 text-slate-600 opacity-50 cursor-not-allowed" : "bg-white/5 border-white/10")} />
                  </div>
                  <label className="flex items-center space-x-2 mt-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-4 h-4 rounded border border-white/20 bg-black/20 group-hover:border-gold transition-colors">
                      <input type="checkbox" name="sendViaWa" checked={formData.sendViaWa} onChange={handleInputChange} className="absolute opacity-0 cursor-pointer w-full h-full" />
                      {formData.sendViaWa && <CheckCircle className="w-3 h-3 text-gold" />}
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Saya akan mengirimkan foto secara manual via Chat WA</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 5: Angpao */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm sm:text-base text-white border-b border-white/5 pb-2">
                5. Angpao / Gift (Opsional)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Nama Bank / E-Wallet</label>
                  <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="Contoh: BCA / GoPay" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Nomor Rekening</label>
                  <input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleInputChange} placeholder="Contoh: 1234567890" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-400">Atas Nama</label>
                  <input type="text" name="bankAccountName" value={formData.bankAccountName} onChange={handleInputChange} placeholder="Contoh: Dilan Saputra" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold" />
                </div>
              </div>
            </div>

            {/* Section 6: Notes */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm sm:text-base text-white border-b border-white/5 pb-2">
                6. Catatan & Keterangan Tambahan
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
                <div className="flex flex-col items-center sm:items-start space-y-0.5 pt-1">
                  <span className="text-sm font-bold text-slate-400 line-through decoration-red-500 decoration-2 mb-1">
                    {formatIDR(getOriginalPrice(selectedTheme.priceStandalone))}
                  </span>
                  <div className="flex items-end space-x-3">
                    <span className="font-heading font-black text-3xl text-gold drop-shadow-md leading-none">
                      {formatIDR(selectedTheme.priceStandalone)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-red-500 text-white mb-0.5 shadow-sm">
                      Diskon {getDiscountPercentage(selectedTheme.priceStandalone)}%
                    </span>
                  </div>
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

      </div>

      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-navy-dark border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl scale-in-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <div>
              <h3 className="font-heading font-black text-2xl text-white mb-2">Pendaftaran Berhasil!</h3>
              <p className="text-sm text-slate-400">
                Data Anda telah masuk ke sistem kami. Klik tombol di bawah ini untuk mengirimkan detail form langsung ke WhatsApp Admin JD Music Entertainment.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowSuccessModal(false)}
                className="w-full flex items-center justify-center py-4 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
              >
                Buka WhatsApp Sekarang
              </a>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full flex items-center justify-center py-3 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function BookingUndanganPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy-darker flex items-center justify-center"><div className="text-gold">Loading...</div></div>}>
      <BookingUndanganContent />
    </Suspense>
  );
}
