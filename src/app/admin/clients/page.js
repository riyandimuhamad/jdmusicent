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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black text-navy-dark tracking-tight">Manajemen Klien</h1>
          <p className="text-slate-500 mt-1 text-sm">Kelola pesanan klien dan buat URL undangan otomatis.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-navy-dark hover:bg-navy-darker text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center space-x-2"
        >
          {isAdding ? <span className="px-2">Batal</span> : <><Plus className="w-4 h-4" /><span>Tambah Klien</span></>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-8 animate-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-navy-dark mb-6 border-b pb-4">Form Klien Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Mempelai */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 text-sm">A. Data Mempelai</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nama Pria</label>
                  <input required name="groom" value={formData.groom} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-navy-dark/20 text-sm" placeholder="Contoh: Dilan Saputra" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nama Wanita</label>
                  <input required name="bride" value={formData.bride} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-navy-dark/20 text-sm" placeholder="Contoh: Milea Adnan" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Inisial (Singkat)</label>
                    <input name="short" value={formData.short} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-navy-dark/20 text-sm" placeholder="D & M" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tema Desain</label>
                    <select name="themeId" value={formData.themeId} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-navy-dark/20 text-sm bg-white">
                      {themesData.map(t => <option key={t.id} value={t.id}>{t.id}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Acara */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 text-sm">B. Data Acara</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Tanggal Utama (Teks Besar)</label>
                  <input required name="dateStr" value={formData.dateStr} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-navy-dark/20 text-sm" placeholder="Contoh: 22 DESEMBER 2026" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tanggal Akad</label>
                    <input name="akadDate" value={formData.akadDate} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border text-sm" placeholder="Sabtu, 22 Desember" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Waktu Akad</label>
                    <input name="akadTime" value={formData.akadTime} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border text-sm" placeholder="08:00 WIB" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Lokasi Resepsi</label>
                  <input name="resepsiVenue" value={formData.resepsiVenue} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border text-sm" placeholder="Gedung Sate" />
                </div>
              </div>

            </div>
            
            <div className="border-t pt-6 flex justify-end">
              <button type="submit" className="bg-gold hover:bg-yellow-500 text-navy-dark px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all">
                Buat Undangan Sekarang
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Klien */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-navy-dark flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gold" />
            <span>Klien Aktif</span>
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Cari klien..." className="pl-9 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark/20 w-64" />
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-slate-500 animate-pulse">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold border-b">ID / Slug</th>
                  <th className="px-6 py-4 font-bold border-b">Nama Mempelai</th>
                  <th className="px-6 py-4 font-bold border-b">Tema</th>
                  <th className="px-6 py-4 font-bold border-b text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded inline-block">{client.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-navy-dark text-sm">{client.short}</div>
                      <div className="text-xs text-slate-500">{client.dateStr}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-navy-dark/5 text-navy-dark">
                        {client.themeId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleCopyLink(client.id)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-navy-dark hover:text-white transition-colors text-xs font-semibold"
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
