"use client";

import React, { useEffect, useState } from "react";
import { mockDb } from "@/lib/supabase";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockDb.getGuests().then((data) => {
      setGuests(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-20 font-bold text-slate-400">Memuat data tamu...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-heading font-black text-3xl text-navy-dark">Daftar Tamu (RSVP)</h1>
        <p className="text-slate-500 mt-1">Kelola dan lihat konfirmasi kehadiran tamu Anda.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama Tamu</th>
                <th className="px-6 py-4">Status Kehadiran</th>
                <th className="px-6 py-4">Pesan / Ucapan</th>
                <th className="px-6 py-4">Waktu Konfirmasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy-dark">{guest.name}</td>
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
                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={guest.message}>
                    {guest.message || "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(guest.created_at).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
              
              {guests.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-400">Belum ada tamu yang mengisi RSVP.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
