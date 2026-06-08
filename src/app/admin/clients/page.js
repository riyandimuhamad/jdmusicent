"use client";

import React, { useState, useEffect } from "react";
import { Plus, Globe, Link as LinkIcon, Search, Copy, CheckCircle, RefreshCw } from "lucide-react";
import { mockDb } from "@/lib/supabase";
import themesData from "@/data/themes.json";
import { cn } from "@/lib/utils";

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedPortalId, setCopiedPortalId] = useState(null);
  const [copiedPinId, setCopiedPinId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    groom: "", bride: "", short: "", 
    parentsGroom: "", parentsBride: "",
    themeId: themesData[0].id,
    eventDateISO: "", // Store the actual YYYY-MM-DD
    akadDate: "", akadTime: "",
    resepsiDate: "", resepsiTime: "", resepsiVenue: "", resepsiAddress: "",
    bgmTitle: "", bgmUrl: "", bgmStart: "",
    bank: "", account: "", accountName: "",
    galleryItems: [{ type: 'url', src: '' }]
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    const data = await mockDb.getClients();
    setClients(data);
    setLoading(false);
  };

  const handleCopyLink = (slug) => {
    const link = `${window.location.origin}/invite-wedding/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyPortalLink = (slug) => {
    const link = `${window.location.origin}/client-portal/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedPortalId(slug);
    setTimeout(() => setCopiedPortalId(null), 2000);
  };

  const handleCopyPin = (slug, pin) => {
    navigator.clipboard.writeText(pin);
    setCopiedPinId(slug);
    setTimeout(() => setCopiedPinId(null), 2000);
  };

  const handleStatusChange = async (slug, newStatus) => {
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin mengubah status klien ini menjadi ${newStatus}?`);
    if (isConfirmed) {
      await mockDb.updateClientStatus(slug, newStatus);
      await loadClients();
    }
  };

  // Gallery Handlers
  const handleGalleryTypeToggle = (index) => {
    setFormData(prev => {
      const items = [...prev.galleryItems];
      items[index].type = items[index].type === 'url' ? 'file' : 'url';
      items[index].src = '';
      return { ...prev, galleryItems: items };
    });
  };

  const handleGallerySrcChange = (index, value) => {
    setFormData(prev => {
      const items = [...prev.galleryItems];
      items[index].src = value;
      return { ...prev, galleryItems: items };
    });
  };

  const handleGalleryFileChange = (index, file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL("image/jpeg", 0.7);
        handleGallerySrcChange(index, base64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const addGalleryItem = () => {
    setFormData(prev => ({
      ...prev,
      galleryItems: [...prev.galleryItems, { type: 'url', src: '' }]
    }));
  };

  const removeGalleryItem = (index) => {
    setFormData(prev => {
      const items = [...prev.galleryItems];
      items.splice(index, 1);
      return { ...prev, galleryItems: items };
    });
  };

  const handleDeleteClient = async (slug) => {
    const isConfirmed = window.confirm(`PERINGATAN: Apakah Anda yakin ingin menghapus data klien ini secara permanen? Data yang dihapus tidak dapat dikembalikan.`);
    if (isConfirmed) {
      await mockDb.deleteClient(slug);
      await loadClients();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Auto-generate slug
    const slug = `${formData.groom.toLowerCase().split(' ')[0]}-${formData.bride.toLowerCase().split(' ')[0]}`;
    
    const newClient = {
      id: slug,
      groom: formData.groom,
      bride: formData.bride,
      short: formData.short || `${formData.groom[0]} & ${formData.bride[0]}`,
      parentsGroom: formData.parentsGroom,
      parentsBride: formData.parentsBride,
      themeId: formData.themeId,
      eventDateISO: formData.eventDateISO,
      dateStr: new Date(formData.eventDateISO).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(),
      status: 'Aktif',
      akad: { date: formData.akadDate, time: formData.akadTime },
      resepsi: { date: formData.resepsiDate, time: formData.resepsiTime, venue: formData.resepsiVenue, address: formData.resepsiAddress },
      assets: {
        gallery: formData.galleryItems.map(item => item.src).filter(Boolean),
        bgmTitle: formData.bgmTitle,
        bgmUrl: formData.bgmUrl,
        bgmStart: formData.bgmStart
      },
      gift: {
        bank: formData.bank,
        account: formData.account,
        name: formData.accountName
      }
    };

    await mockDb.addClient(newClient);
    await loadClients();
    setIsAdding(false);
    
    // Reset
    setFormData({
      groom: "", bride: "", short: "", parentsGroom: "", parentsBride: "",
      themeId: themesData[0].id, eventDateISO: "", akadDate: "", akadTime: "",
      resepsiDate: "", resepsiTime: "", resepsiVenue: "", resepsiAddress: "",
      bgmTitle: "", bgmUrl: "", bgmStart: "", bank: "", account: "", accountName: "",
      galleryItems: [{ type: 'url', src: '' }]
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredClients = clients.filter(c => {
    if (statusFilter === 'Semua') return true;
    return (c.status || 'Aktif') === statusFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-0 sm:pr-16">
        <div>
          <h1 className="text-3xl font-heading font-black text-white tracking-tight">Manajemen Klien Undangan Online</h1>
          <p className="text-slate-400 mt-1 text-sm">Kelola pesanan klien undangan digital dan buat URL undangan unik secara otomatis.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center space-x-2 border border-white/10"
        >
          {isAdding ? <span className="px-2">Batal</span> : <><Plus className="w-4 h-4" /><span>Tambah Klien</span></>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-sm mb-8 animate-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">Form Klien Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Mempelai */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-300 text-sm">A. Data Mempelai</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Nama Pria</label>
                  <input required name="groom" value={formData.groom} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-white/10 focus:ring-2 focus:ring-gold/50 text-sm bg-navy-darker text-white placeholder-slate-500" placeholder="Contoh: Dilan Saputra" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Nama Wanita</label>
                  <input required name="bride" value={formData.bride} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-white/10 focus:ring-2 focus:ring-gold/50 text-sm bg-navy-darker text-white placeholder-slate-500" placeholder="Contoh: Milea Adnan" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Inisial (Singkat)</label>
                    <input name="short" value={formData.short} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-white/10 focus:ring-2 focus:ring-gold/50 text-sm bg-navy-darker text-white placeholder-slate-500" placeholder="D & M" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Tema Desain</label>
                    <select name="themeId" value={formData.themeId} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-white/10 focus:ring-2 focus:ring-gold/50 text-sm bg-navy-darker text-white">
                      {themesData.map(t => <option key={t.id} value={t.id}>{t.id}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Acara */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-300 text-sm">B. Data Acara</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Tanggal Utama Acara</label>
                  <input required type="date" name="eventDateISO" value={formData.eventDateISO} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-white/10 focus:ring-2 focus:ring-gold/50 text-sm bg-navy-darker text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Tanggal Akad</label>
                    <input name="akadDate" value={formData.akadDate} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-white/10 text-sm bg-navy-darker text-white placeholder-slate-500" placeholder="Sabtu, 22 Desember" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Waktu Akad</label>
                    <input name="akadTime" value={formData.akadTime} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-white/10 text-sm bg-navy-darker text-white placeholder-slate-500" placeholder="08:00 WIB" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Lokasi Resepsi</label>
                  <input name="resepsiVenue" value={formData.resepsiVenue} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-white/10 text-sm bg-navy-darker text-white placeholder-slate-500" placeholder="Gedung Sate" />
                </div>
              </div>

              {/* Aset & Media */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-300 text-sm border-b border-white/5 pb-2">C. Aset & Media (Opsional)</h3>
                
                {/* BGM */}
                <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <h4 className="font-bold text-xs text-gold uppercase tracking-wider">Musik Latar (BGM)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Judul Lagu</label>
                      <input name="bgmTitle" value={formData.bgmTitle} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-white/10 text-xs bg-navy-darker text-white placeholder-slate-500" placeholder="Contoh: A Thousand Years" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">URL Tautan Lagu</label>
                      <input name="bgmUrl" value={formData.bgmUrl} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-white/10 text-xs bg-navy-darker text-white placeholder-slate-500" placeholder="https://..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Mulai dari Detik Ke-</label>
                    <input name="bgmStart" value={formData.bgmStart} onChange={handleChange} className="w-full md:w-1/2 px-3 py-2 rounded-lg border border-white/10 text-xs bg-navy-darker text-white placeholder-slate-500" placeholder="Contoh: 01:15" />
                  </div>
                </div>

                {/* Gallery */}
                <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <h4 className="font-bold text-xs text-gold uppercase tracking-wider">Foto Galeri Pre-Wedding</h4>
                  <p className="text-[10px] text-slate-400 mb-2">Tambahkan foto menggunakan URL atau unggah file langsung (Otomatis dikompresi agar ringan).</p>
                  
                  <div className="space-y-3">
                    {formData.galleryItems.map((item, index) => (
                      <div key={index} className="p-3 rounded-lg border border-white/5 bg-black/20 space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-slate-300">Foto {index + 1}</label>
                          <div className="flex space-x-2">
                            <button type="button" onClick={() => handleGalleryTypeToggle(index)} className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-slate-300 transition-colors">
                              Ubah Tipe: {item.type === 'url' ? 'URL Link' : 'File Lokal'}
                            </button>
                            {formData.galleryItems.length > 1 && (
                              <button type="button" onClick={() => removeGalleryItem(index)} className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded hover:bg-red-500/20 transition-colors">
                                Hapus
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {item.type === 'url' ? (
                          <input 
                            type="text" 
                            value={item.src} 
                            onChange={(e) => handleGallerySrcChange(index, e.target.value)} 
                            placeholder="https://..." 
                            className="w-full px-3 py-2 rounded-lg border border-white/10 text-xs bg-navy-darker text-white placeholder-slate-500" 
                          />
                        ) : (
                          <div className="space-y-2">
                            <input 
                              type="file" 
                              accept="image/png, image/jpeg" 
                              onChange={(e) => handleGalleryFileChange(index, e.target.files[0])} 
                              className="block w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20" 
                            />
                            {item.src && <div className="text-[10px] text-green-400 flex items-center space-x-1"><CheckCircle className="w-3 h-3" /><span>Gambar tersimpan (dikompresi)</span></div>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button 
                    type="button" 
                    onClick={addGalleryItem} 
                    className="w-full py-2.5 mt-2 border border-dashed border-white/20 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Foto Lainnya</span>
                  </button>
                </div>
              </div>

              {/* Angpao / Gift */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-300 text-sm">D. Angpao / Gift (Opsional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Nama Bank / e-Wallet</label>
                    <input name="bank" value={formData.bank} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-white/10 text-sm bg-navy-darker text-white placeholder-slate-500" placeholder="BCA / GoPay" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Nomor Rekening</label>
                    <input name="account" value={formData.account} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-white/10 text-sm bg-navy-darker text-white placeholder-slate-500" placeholder="1234567890" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Atas Nama</label>
                  <input name="accountName" value={formData.accountName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-white/10 text-sm bg-navy-darker text-white placeholder-slate-500" placeholder="Dilan Saputra" />
                </div>
              </div>

            </div>
            
            <div className="border-t border-white/10 pt-6 flex justify-end">
              <button type="submit" className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-600 hover:to-gold text-navy-dark px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all">
                Buat Undangan Sekarang
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Klien */}
      <div className="bg-white/5 rounded-3xl border border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-transparent gap-4">
          <h3 className="font-bold text-white flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gold" />
            <span>Daftar Semua Klien</span>
          </h3>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 bg-navy-darker text-white w-full sm:w-auto"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
              <option value="Diarsipkan">Diarsipkan</option>
            </select>
            <div className="relative w-full sm:w-auto flex items-center space-x-2">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Cari klien..." className="pl-9 pr-4 py-2 rounded-lg border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 w-full sm:w-64 bg-navy-darker text-white placeholder-slate-500" />
              </div>
              <button 
                onClick={loadClients}
                className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin text-gold")} />
              </button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-slate-500 animate-pulse">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-300 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold border-b border-white/10">ID / Slug</th>
                  <th className="px-6 py-4 font-bold border-b border-white/10">Nama Mempelai</th>
                  <th className="px-6 py-4 font-bold border-b border-white/10">PIN Portal</th>
                  <th className="px-6 py-4 font-bold border-b border-white/10">Status</th>
                  <th className="px-6 py-4 font-bold border-b border-white/10 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-slate-400 bg-black/20 px-2 py-1 rounded inline-block">{client.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{client.short}</div>
                      <div className="text-xs text-slate-400">{client.dateStr}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="font-mono text-sm tracking-widest text-gold bg-gold/10 px-3 py-1.5 rounded-lg inline-block font-bold">
                          {client.pin || '------'}
                        </div>
                        <button 
                          onClick={() => handleCopyPin(client.id, client.pin)}
                          className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                          title="Salin PIN"
                        >
                          {copiedPinId === client.id ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        client.status === 'Diarsipkan' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' : 
                        client.status === 'Nonaktif' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                        {client.status || 'Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleCopyLink(client.id)}
                          disabled={client.status === 'Diarsipkan' || client.status === 'Nonaktif'}
                          className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs font-semibold ${client.status === 'Diarsipkan' || client.status === 'Nonaktif' ? 'border-white/5 text-slate-500 cursor-not-allowed' : 'border-white/10 text-slate-300 hover:bg-white/10 transition-colors'}`}
                          title={client.status === 'Diarsipkan' || client.status === 'Nonaktif' ? 'Undangan dinonaktifkan/diarsipkan' : 'Salin Link Undangan Publik'}
                        >
                          {copiedId === client.id ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === client.id ? 'Tersalin!' : 'Undangan'}</span>
                        </button>
                        <button 
                          onClick={() => handleCopyPortalLink(client.id)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gold/20 text-gold hover:bg-gold/10 transition-colors text-xs font-semibold"
                          title="Salin Link Akses Portal Klien"
                        >
                          {copiedPortalId === client.id ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Globe className="w-3.5 h-3.5" />}
                          <span>{copiedPortalId === client.id ? 'Tersalin!' : 'Portal'}</span>
                        </button>
                        <select
                          value={client.status || 'Aktif'}
                          onChange={(e) => handleStatusChange(client.id, e.target.value)}
                          className="px-2 py-1.5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold/50 bg-navy-darker text-white text-xs font-semibold"
                        >
                          <option value="Aktif">Aktif</option>
                          <option value="Nonaktif">Nonaktif</option>
                          <option value="Diarsipkan">Arsipkan</option>
                        </select>
                        <button 
                          onClick={() => handleDeleteClient(client.id)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-xs font-semibold"
                          title="Hapus Klien Permanen"
                        >
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
