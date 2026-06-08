"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mockDb } from "@/lib/supabase";
import { Users, UserCheck, UserX, Copy, CheckCircle, Link as LinkIcon } from "lucide-react";

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

  useEffect(() => {
    async function loadData() {
      const cData = await mockDb.getClient(clientSlug);
      if (cData) {
        setClientData(cData);
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

  if (loading) return <div className="text-center py-20 animate-pulse text-slate-400">Memuat Portal Klien...</div>;

  if (!clientData) {
    return <div className="text-center py-20 text-red-400 font-bold">Klien tidak ditemukan. URL mungkin salah.</div>;
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
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 pr-0 sm:pr-8">
        <div>
          <h1 className="font-heading font-black text-3xl text-white">Dashboard Pernikahan</h1>
          <p className="text-slate-400 mt-1">Selamat datang, {clientData.short}. Kelola tamu dan pantau kehadiran undangan Anda.</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-xs font-bold">
          Keluar (Logout)
        </button>
      </div>

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
    </div>
  );
}
