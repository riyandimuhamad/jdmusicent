"use client";

import React, { useEffect, useState } from "react";
import { mockDb } from "@/lib/supabase";
import { Users, UserCheck, UserX, Activity } from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({ total: 0, attending: 0, absent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockDb.getStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-20 font-bold text-slate-400">Memuat data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-heading font-black text-3xl text-navy-dark">Overview Acara</h1>
        <p className="text-slate-500 mt-1">Pantau statistik kehadiran tamu undangan Anda secara real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total RSVP Masuk</p>
            <p className="font-heading font-black text-2xl text-navy-dark">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Konfirmasi Hadir</p>
            <p className="font-heading font-black text-2xl text-green-600">{stats.attending}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Tidak Hadir</p>
            <p className="font-heading font-black text-2xl text-red-600">{stats.absent}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
          <Activity className="w-5 h-5 text-gold" />
          <h2 className="font-heading font-bold text-lg text-navy-dark">Aktivitas Terkini</h2>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-slate-500 italic">Data mockup: Dashboard ini disiapkan untuk membaca data dari Supabase ketika aplikasi dihubungkan ke backend production.</p>
        </div>
      </div>
    </div>
  );
}
