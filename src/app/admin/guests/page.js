"use client";

import React, { useEffect, useState } from "react";
import { mockDb } from "@/lib/supabase";
import { CheckCircle, XCircle, Download } from "lucide-react";

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [guestsData, clientsData] = await Promise.all([
        mockDb.getGuests(selectedClient === "all" ? null : selectedClient),
        mockDb.getClients()
      ]);
      setGuests(guestsData);
      setClients(clientsData);
      setLoading(false);
    };
    
    fetchData();
  }, [selectedClient]);

  const handleExportCSV = () => {
    if (guests.length === 0) {
      alert("Tidak ada data tamu untuk di-export.");
      return;
    }

    // Buat Header CSV
    const headers = ["Nama Tamu", "Klien / Acara", "Status Kehadiran", "Pesan / Ucapan", "Waktu Konfirmasi"];
    
    // Konversi baris data
    const rows = guests.map(g => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.client_id}"`,
      `"${g.status === 'hadir' ? 'Hadir' : 'Tidak Hadir'}"`,
      `"${(g.message || '-').replace(/"/g, '""')}"`,
      `"${new Date(g.created_at).toLocaleString("id-ID")}"`
    ]);

    // Gabungkan dengan newline
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    // Buat dan trigger download blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_RSVP_${selectedClient === "all" ? "Semua_Klien" : selectedClient}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center py-20 font-bold text-slate-400">Memuat data tamu...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-0 sm:pr-16">
        <div>
          <h1 className="font-heading font-black text-3xl text-white">Daftar Tamu (RSVP)</h1>
          <p className="text-slate-400 mt-1">Kelola dan lihat konfirmasi kehadiran tamu Anda.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-slate-300">Filter Klien:</label>
            <select 
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="px-3 py-2 rounded-lg border border-white/10 focus:ring-2 focus:ring-gold/50 text-sm bg-navy-darker text-white"
            >
              <option value="all">Semua Klien</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.short} ({c.id})</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={handleExportCSV}
            className="bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-white/5 text-slate-300 font-semibold border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Nama Tamu</th>
                <th className="px-6 py-4">Klien / Acara</th>
                <th className="px-6 py-4">Status Kehadiran</th>
                <th className="px-6 py-4">Pesan / Ucapan</th>
                <th className="px-6 py-4">Waktu Konfirmasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{guest.name}</td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400 bg-black/20 rounded px-2">{guest.client_id}</td>
                  <td className="px-6 py-4">
                    {guest.status === "hadir" ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Hadir</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Tidak Hadir</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-300 max-w-xs truncate" title={guest.message}>
                    {guest.message || "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {new Date(guest.created_at).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
              
              {guests.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">Belum ada tamu yang mengisi RSVP.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
