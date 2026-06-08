"use client";

import React, { useState, useEffect } from "react";
import { Plus, Globe, Link as LinkIcon, Search, Copy, CheckCircle } from "lucide-react";
import { mockDb } from "@/lib/supabase";
import themesData from "@/data/themes.json";

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    groom: "", bride: "", short: "", 
    parentsGroom: "", parentsBride: "",
    themeId: themesData[0].id,
    dateStr: "",
    akadDate: "", akadTime: "",
    resepsiDate: "", resepsiTime: "", resepsiVenue: "", resepsiAddress: ""
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
    const url = `${window.location.origin}/undangan/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2000);
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
      dateStr: formData.dateStr,
      akad: { date: formData.akadDate, time: formData.akadTime },
      resepsi: { date: formData.resepsiDate, time: formData.resepsiTime, venue: formData.resepsiVenue, address: formData.resepsiAddress }
    };

    await mockDb.addClient(newClient);
    await loadClients();
    setIsAdding(false);
    
    // Reset
    setFormData({
      groom: "", bride: "", short: "", parentsGroom: "", parentsBride: "",
      themeId: themesData[0].id, dateStr: "", akadDate: "", akadTime: "",
      resepsiDate: "", resepsiTime: "", resepsiVenue: "", resepsiAddress: ""
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
                  <label className="block text-xs font-bold text-slate-400 mb-1">Tanggal Utama (Teks Besar)</label>
                  <input required name="dateStr" value={formData.dateStr} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-white/10 focus:ring-2 focus:ring-gold/50 text-sm bg-navy-darker text-white placeholder-slate-500" placeholder="Contoh: 22 DESEMBER 2026" />
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
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-transparent">
          <h3 className="font-bold text-white flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gold" />
            <span>Klien Aktif</span>
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Cari klien..." className="pl-9 pr-4 py-2 rounded-lg border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 w-64 bg-navy-darker text-white placeholder-slate-500" />
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
                  <th className="px-6 py-4 font-bold border-b border-white/10">Tema</th>
                  <th className="px-6 py-4 font-bold border-b border-white/10 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-slate-400 bg-black/20 px-2 py-1 rounded inline-block">{client.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{client.short}</div>
                      <div className="text-xs text-slate-400">{client.dateStr}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold/10 text-gold border border-gold/20">
                        {client.themeId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleCopyLink(client.id)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/10 transition-colors text-xs font-semibold"
                      >
                        {copiedId === client.id ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === client.id ? 'Tersalin!' : 'Salin Link'}</span>
                      </button>
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
