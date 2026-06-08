"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mockDb } from "@/lib/supabase";
import { Users, UserCheck, UserX, Copy, CheckCircle, Link as LinkIcon, Edit, Save, Plus, Trash2, Calendar, MapPin, Music, Heart } from "lucide-react";

export default function ClientPortal() {
  const params = useParams();
  const clientSlug = params.clientSlug;

  const [clientData, setClientData] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Link Generator State
  const [guestName, setGuestName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  // Form State
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'form'
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const cData = await mockDb.getClient(clientSlug);
      if (cData) {
        setClientData(cData);
        // Map nested DB schema to flat form state
        setFormData({
          groom: cData.groom || '', bride: cData.bride || '', short: cData.short || '',
          parentsGroom: cData.parentsGroom || '', parentsBride: cData.parentsBride || '',
          akadDate: cData.akad?.date || '', akadTime: cData.akad?.time || '',
          resepsiDate: cData.resepsi?.date || '', resepsiTime: cData.resepsi?.time || '',
          resepsiVenue: cData.resepsi?.venue || '', resepsiAddress: cData.resepsi?.address || '', mapUrl: cData.resepsi?.mapUrl || '',
          bgmTitle: cData.assets?.bgmTitle || '', bgmUrl: cData.assets?.bgmUrl || '', bgmStart: cData.assets?.bgmStart || '',
          bank: cData.gift?.bank || '', account: cData.gift?.account || '', accountName: cData.gift?.name || '',
          galleryItems: cData.assets?.gallery?.length > 0 ? cData.assets.gallery.map(url => ({ type: 'url', src: url })) : []
        });
        const gData = await mockDb.getGuests(clientSlug);
        setGuests(gData);
      }
      setLoading(false);
    }
    loadData();

    // Check existing session
    const authData = localStorage.getItem(`portal_auth_${clientSlug}`);
    if (authData === 'true') {
      setIsAuthenticated(true);
    }
  }, [clientSlug]);

  // Auto-refresh guests data periodically (Polling for real-time feel)
  useEffect(() => {
    if (!isAuthenticated || !clientSlug) return;

    const fetchGuestsPeriodically = async () => {
      const gData = await mockDb.getGuests(clientSlug);
      // Only update state if length or content changes to avoid unnecessary re-renders
      // (For simple mockDb, direct set is fine too, but this is safer)
      setGuests(gData);
    };

    const interval = setInterval(fetchGuestsPeriodically, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, clientSlug]);

  const handleGenerateLink = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    // Replace spaces with + for the URL query param
    const formattedName = guestName.trim().replace(/\s+/g, '+');
    const link = `${window.location.origin}/invite-wedding/${clientSlug}?to=${formattedName}`;
    setGeneratedLink(link);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (clientData.pin && pinInput.trim() === String(clientData.pin).trim()) {
      setLoginSuccess(true);
      setError("");
      setTimeout(() => {
        localStorage.setItem(`portal_auth_${clientSlug}`, 'true');
        setIsAuthenticated(true);
      }, 1500);
    } else {
      setError("PIN yang Anda masukkan salah.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(`portal_auth_${clientSlug}`);
    setIsAuthenticated(false);
    setPinInput("");
    setLoginSuccess(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveData = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Convert flat form back to nested DB schema
    const nestedData = {
      groom: formData.groom, bride: formData.bride, short: formData.short,
      parentsGroom: formData.parentsGroom, parentsBride: formData.parentsBride,
      akad: { date: formData.akadDate, time: formData.akadTime },
      resepsi: { date: formData.resepsiDate, time: formData.resepsiTime, venue: formData.resepsiVenue, address: formData.resepsiAddress, mapUrl: formData.mapUrl },
      assets: {
        gallery: (formData.galleryItems || []).map(item => item.src).filter(Boolean),
        bgmTitle: formData.bgmTitle, bgmUrl: formData.bgmUrl, bgmStart: formData.bgmStart
      },
      gift: { bank: formData.bank, account: formData.account, name: formData.accountName }
    };

    await mockDb.updateClientData(clientSlug, nestedData);
    const updatedData = await mockDb.getClient(clientSlug);
    setClientData(updatedData);
    setIsSaving(false);
    alert("Data berhasil disimpan! Undangan Anda sudah terupdate otomatis.");
  };

  // Gallery handlers
  const handleGallerySrcChange = (index, value) => {
    setFormData(prev => {
      const items = [...(prev.galleryItems || [])];
      items[index] = { ...items[index], src: value };
      return { ...prev, galleryItems: items };
    });
  };

  const addGalleryItem = () => {
    setFormData(prev => ({
      ...prev,
      galleryItems: [...(prev.galleryItems || []), { type: 'url', src: '' }]
    }));
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar! Maksimal 2MB.");
      return;
    }

    try {
      setUploadingIndex(index);
      const fileExt = file.name.split('.').pop();
      // Generate a unique, web-safe filename
      const fileName = `${clientSlug}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const publicUrl = await mockDb.uploadFile(file, fileName);
      
      setFormData(prev => {
        const items = [...(prev.galleryItems || [])];
        items[index] = { ...items[index], src: publicUrl };
        return { ...prev, galleryItems: items };
      });
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah foto. Pastikan ukuran file di bawah 2MB dan formatnya berupa gambar (JPG/PNG).");
    } finally {
      setUploadingIndex(null);
    }
  };

  const removeGalleryItem = (index) => {
    setFormData(prev => {
      const items = [...(prev.galleryItems || [])];
      items.splice(index, 1);
      return { ...prev, galleryItems: items };
    });
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-slate-400">Memuat Portal Klien...</div>;

  if (!clientData || clientData.status === 'Nonaktif') {
    return (
      <div className="text-center py-20 space-y-4">
        <h1 className="font-heading text-3xl text-gold font-black">404</h1>
        <div className="text-red-400 font-bold">Klien tidak ditemukan atau portal dinonaktifkan.</div>
      </div>
    );
  }

  if (clientData.status === 'Diarsipkan') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="bg-red-500/10 p-8 rounded-3xl border border-red-500/20 shadow-lg max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="font-heading font-black text-2xl text-white mb-2">Akses Ditangguhkan</h1>
          <p className="text-red-300 text-sm mb-6 leading-relaxed">Mohon maaf, akses ke portal ini sedang ditangguhkan. Silakan hubungi admin untuk menyelesaikan kelengkapan administrasi Anda.</p>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors font-bold text-sm">
            Hubungi Admin
          </a>
        </div>
      </div>
    );
  }

  const attendingCount = guests.filter(g => g.status === 'hadir').length;
  const absentCount = guests.filter(g => g.status === 'tidak').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <UserCheck className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-black text-2xl text-white mb-2">Portal Klien Terkunci</h1>
          <p className="text-slate-400 text-sm mb-8">Silakan masukkan PIN keamanan 6-digit yang diberikan oleh Admin untuk mengakses data Anda.</p>

          {loginSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center animate-in zoom-in duration-300">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-white font-bold text-lg">Akses Disetujui!</p>
              <p className="text-slate-400 text-sm mt-1 animate-pulse">Membuka Portal Klien...</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">PIN Portal Klien</label>
                <input
                  type="password"
                  maxLength="6"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-white text-center text-2xl tracking-[0.5em] pl-[calc(1rem+0.5em)] focus:outline-none focus:ring-2 focus:ring-gold/50"
                  required
                />
              </div>
              {error && <p className="text-red-400 text-xs text-center font-bold">{error}</p>}
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-yellow-500 text-navy-dark font-bold tracking-wide text-sm hover:from-yellow-600 hover:to-gold transition-all shadow-md mt-4">
                Akses Portal
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-heading font-black text-3xl text-white">Dashboard Pernikahan</h1>
          <p className="text-slate-400 mt-1">Selamat datang, {clientData.short}. Kelola tamu dan lengkapi data undangan Anda.</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-xs font-bold whitespace-nowrap">
          Keluar (Logout)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-black/20 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <Users className="w-4 h-4" />
          <span>Buku Tamu</span>
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'form' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <Edit className="w-4 h-4" />
          <span>Edit Data Undangan</span>
        </button>
      </div>

      {activeTab === "dashboard" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-sm flex items-center space-x-4">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Total Respon RSVP</p>
                <p className="font-heading text-3xl text-white font-bold">{guests.length}</p>
              </div>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-sm flex items-center space-x-4">
              <div className="w-14 h-14 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Tamu Hadir</p>
                <p className="font-heading text-3xl text-white font-bold">{attendingCount}</p>
              </div>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-sm flex items-center space-x-4">
              <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center">
                <UserX className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Tamu Tidak Hadir</p>
                <p className="font-heading text-3xl text-white font-bold">{absentCount}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Generate Link Panel */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-3xl border border-white/10 shadow-sm h-fit lg:col-span-1">
              <h2 className="font-bold text-lg text-white mb-4 flex items-center space-x-2">
                <LinkIcon className="w-5 h-5 text-gold" />
                <span>Buat Link Undangan</span>
              </h2>
              <p className="text-xs text-slate-400 mb-6">Masukkan nama tamu yang ingin Anda undang untuk mendapatkan link khusus.</p>

              <form onSubmit={handleGenerateLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Nama Tamu</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-gold text-navy-dark font-bold tracking-wide text-sm hover:bg-yellow-400 transition-colors">
                  Generate Link
                </button>
              </form>

              {generatedLink && (
                <div className="mt-6 p-4 bg-black/30 rounded-xl border border-gold/30 animate-in fade-in">
                  <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2">Link Berhasil Dibuat:</p>
                  <div className="break-all text-xs text-slate-300 font-mono mb-3 p-2 bg-black/50 rounded border border-white/5">
                    {generatedLink}
                  </div>
                  <button
                    onClick={copyLink}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Link'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* RSVP Table */}
            <div className="bg-white/5 rounded-3xl border border-white/10 shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/10">
                <h2 className="font-bold text-white">Daftar Kehadiran (RSVP)</h2>
              </div>
              <div className="flex-1 overflow-x-auto custom-scrollbar">
                {guests.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-slate-300 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-bold border-b border-white/10 w-1/4">Nama Tamu</th>
                        <th className="px-6 py-4 font-bold border-b border-white/10 w-1/6">Status</th>
                        <th className="px-6 py-4 font-bold border-b border-white/10 w-1/2">Pesan & Doa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {guests.map((g) => (
                        <tr key={g.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-semibold text-white text-sm">{g.name}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${g.status === 'hadir' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                              {g.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-300 leading-relaxed italic">
                            "{g.message}"
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-slate-500">
                    <Users className="w-12 h-12 mx-auto opacity-20 mb-4" />
                    <p>Belum ada tamu yang mengisi RSVP.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleSaveData} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-start space-x-3 text-blue-400">
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <strong className="block mb-1">Periksa & Revisi Data Undangan</strong>
              Formulir ini berisi data yang Anda kirimkan saat pertama kali memesan. Jika ada kesalahan input (typo), perubahan jadwal, atau ingin mengganti foto, silakan ubah pada form di bawah ini. <b>Setiap perubahan yang Anda simpan di sini akan otomatis mengubah tampilan Undangan Digital Anda secara langsung!</b>
            </div>
          </div>
          <div className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 shadow-sm space-y-8">

            {/* Section 1: Mempelai */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
                <Heart className="w-5 h-5 text-gold" />
                <h2 className="font-bold text-xl text-white">Data Mempelai</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Nama Lengkap Mempelai Pria</label>
                  <input type="text" name="groom" value={formData.groom || ''} onChange={handleFormChange} required className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Nama Lengkap Mempelai Wanita</label>
                  <input type="text" name="bride" value={formData.bride || ''} onChange={handleFormChange} required className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Nama Orang Tua (Pria)</label>
                  <input type="text" name="parentsGroom" value={formData.parentsGroom || ''} onChange={handleFormChange} placeholder="Putra dari Bpk... & Ibu..." required className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Nama Orang Tua (Wanita)</label>
                  <input type="text" name="parentsBride" value={formData.parentsBride || ''} onChange={handleFormChange} placeholder="Putri dari Bpk... & Ibu..." required className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
            </div>

            {/* Section 2: Jadwal Acara */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
                <Calendar className="w-5 h-5 text-gold" />
                <h2 className="font-bold text-xl text-white">Waktu Pelaksanaan</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/10 p-4 rounded-2xl border border-white/5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Tanggal Akad</label>
                  <input type="date" name="akadDate" value={formData.akadDate || ''} onChange={handleFormChange} className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Jam Akad</label>
                  <input type="text" name="akadTime" value={formData.akadTime || ''} onChange={handleFormChange} placeholder="08:00 - Selesai" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/10 p-4 rounded-2xl border border-white/5 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Tanggal Resepsi</label>
                  <input type="date" name="resepsiDate" value={formData.resepsiDate || ''} onChange={handleFormChange} className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Jam Resepsi</label>
                  <input type="text" name="resepsiTime" value={formData.resepsiTime || ''} onChange={handleFormChange} placeholder="11:00 - 14:00 WIB" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
            </div>

            {/* Section 3: Lokasi */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
                <MapPin className="w-5 h-5 text-gold" />
                <h2 className="font-bold text-xl text-white">Lokasi Acara (Venue)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Nama Gedung / Venue</label>
                  <input type="text" name="resepsiVenue" value={formData.resepsiVenue || ''} onChange={handleFormChange} placeholder="Contoh: Hotel Grand Sahid Jaya" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Link Google Maps (URL Map)</label>
                  <input type="text" name="mapUrl" value={formData.mapUrl || ''} onChange={handleFormChange} placeholder="https://goo.gl/maps/..." className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Alamat Lengkap</label>
                  <textarea name="resepsiAddress" value={formData.resepsiAddress || ''} onChange={handleFormChange} rows="2" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold resize-none" />
                </div>
              </div>
            </div>

            {/* Section 4: Galeri */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <h2 className="font-bold text-xl text-white">Galeri Foto Pre-Wedding</h2>
                </div>
                <button type="button" onClick={addGalleryItem} className="text-xs flex items-center space-x-1 text-gold hover:text-white bg-gold/10 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Foto</span>
                </button>
              </div>
              <div className="space-y-3">
                {(!formData.galleryItems || formData.galleryItems.length === 0) ? (
                  <p className="text-sm text-slate-400 italic">Belum ada foto yang ditambahkan.</p>
                ) : (
                  formData.galleryItems.map((item, idx) => (
                    <div key={idx} className="flex space-x-3 items-center bg-black/20 p-3 rounded-xl border border-white/5">
                      {uploadingIndex === idx ? (
                        <div className="flex-1 flex items-center px-4 py-2 text-sm text-slate-400">
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin text-gold" />
                          Sedang Mengunggah...
                        </div>
                      ) : item.src ? (
                        <div className="flex-1 flex items-center space-x-3">
                          <div className="w-12 h-12 rounded border border-white/10 overflow-hidden bg-white/5 shrink-0 flex-none">
                            <img src={item.src} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                          </div>
                          <p className="text-xs text-green-400 font-medium truncate flex-1">
                            ✓ Foto berhasil diunggah
                          </p>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(idx, e.target.files[0])} 
                            className="block w-full text-sm text-slate-400
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-xs file:font-semibold
                              file:bg-gold/10 file:text-gold
                              hover:file:bg-gold/20 file:transition-colors
                              cursor-pointer"
                          />
                        </div>
                      )}
                      
                      <button type="button" onClick={() => removeGalleryItem(idx)} disabled={uploadingIndex === idx} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Section 5: Hadiah / Angpao */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                <h2 className="font-bold text-xl text-white">Buku Tamu / Hadiah Digital</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Nama Bank / E-Wallet</label>
                  <input type="text" name="bank" value={formData.bank || ''} onChange={handleFormChange} placeholder="Contoh: BCA / Gopay" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">No. Rekening / No. HP</label>
                  <input type="text" name="account" value={formData.account || ''} onChange={handleFormChange} className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Atas Nama</label>
                  <input type="text" name="accountName" value={formData.accountName || ''} onChange={handleFormChange} className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
            </div>

            {/* Section 6: Musik Latar */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
                <Music className="w-5 h-5 text-gold" />
                <h2 className="font-bold text-xl text-white">Musik Latar (Background Music)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Judul Lagu</label>
                  <input type="text" name="bgmTitle" value={formData.bgmTitle || ''} onChange={handleFormChange} placeholder="Artis - Judul" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Link Lagu (YouTube/MP3/Spotify)</label>
                  <input type="text" name="bgmUrl" value={formData.bgmUrl || ''} onChange={handleFormChange} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-8 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center space-x-2 px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-gold to-yellow-500 text-navy-dark hover:from-yellow-600 hover:to-gold transition-all shadow-lg disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan Data"}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
