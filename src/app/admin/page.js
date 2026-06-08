"use client";

import React, { useEffect, useState } from "react";
import { mockDb } from "@/lib/supabase";
import { Users, UserCheck, UserX, Activity, CalendarDays, Globe, Clock } from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [statsData, activitiesData] = await Promise.all([
        mockDb.getDashboardStats(),
        mockDb.getRecentActivities()
      ]);
      setStats(statsData);
      setActivities(activitiesData);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20 font-bold text-slate-400">Memuat data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-heading font-black text-3xl text-white">Overview Acara</h1>
        <p className="text-slate-400 mt-1">Pantau statistik kehadiran tamu undangan Anda secara real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live Band Bookings */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-sm flex flex-col justify-between hover:border-white/20 transition-colors">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
              <CalendarDays className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400">Total Pesanan Band</p>
              <p className="font-heading font-black text-4xl text-white mt-1">{stats.bookings.total}</p>
            </div>
          </div>
          <div className="text-xs font-medium text-slate-400 bg-black/20 py-2.5 px-4 rounded-xl flex items-center justify-between">
            <span>Menunggu Konfirmasi</span>
            <span className="font-bold text-yellow-400 text-sm bg-yellow-400/10 px-2 py-0.5 rounded-md">{stats.bookings.pending}</span>
          </div>
        </div>

        {/* Clients */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-sm flex flex-col justify-between hover:border-white/20 transition-colors">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400">Klien Undangan Aktif</p>
              <p className="font-heading font-black text-4xl text-white mt-1">{stats.clients.total}</p>
            </div>
          </div>
          <div className="text-xs font-medium text-slate-400 bg-black/20 py-2.5 px-4 rounded-xl flex items-center justify-between">
            <span>Total Klien Terdaftar</span>
            <span className="font-bold text-purple-400 text-sm bg-purple-400/10 px-2 py-0.5 rounded-md">{stats.clients.total}</span>
          </div>
        </div>

        {/* RSVP Total */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-sm flex flex-col justify-between hover:border-white/20 transition-colors">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400">Total RSVP Masuk</p>
              <p className="font-heading font-black text-4xl text-white mt-1">{stats.rsvps.total}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 text-xs font-medium text-slate-400 bg-black/20 py-2.5 px-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-green-400" />
                <span>Hadir</span>
              </div>
              <span className="font-bold text-green-400 text-sm bg-green-400/10 px-2 py-0.5 rounded-md">{stats.rsvps.attending}</span>
            </div>
            <div className="flex-1 text-xs font-medium text-slate-400 bg-black/20 py-2.5 px-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <UserX className="w-3.5 h-3.5 text-red-400" />
                <span>Tidak</span>
              </div>
              <span className="font-bold text-red-400 text-sm bg-red-400/10 px-2 py-0.5 rounded-md">{stats.rsvps.absent}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-sm">
        <div className="flex items-center space-x-3 mb-4 border-b border-white/10 pb-4">
          <Activity className="w-5 h-5 text-gold" />
          <h2 className="font-heading font-bold text-lg text-white">Aktivitas Terkini</h2>
        </div>
        <div className="space-y-2">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 py-3 px-4 rounded-2xl bg-transparent hover:bg-white/5 transition-colors group">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${activity.type === 'booking' ? 'bg-gold/10 text-gold group-hover:bg-gold/20' : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20'} transition-colors`}>
                  {activity.type === 'booking' ? <CalendarDays className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{activity.title}</h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{activity.description}</p>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-medium bg-black/20 px-3 py-1.5 rounded-lg flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(activity.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">Belum ada aktivitas yang tercatat.</p>
          )}
        </div>
      </div>
    </div>
  );
}
