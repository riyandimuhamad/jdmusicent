"use client";

import React, { useState, useEffect } from "react";
import { formatIDR, cn } from "@/lib/utils";
import { mockDb } from "@/lib/supabase";
import { CalendarDays, Search, CheckCircle, XCircle, Clock, Eye, X, MapPin, Music, Phone, RefreshCw, Trash2 } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState('Semua');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const data = await mockDb.getBookings();
    // Sort by created_at descending
    const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setBookings(sorted);
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin mengubah status pesanan menjadi "${newStatus}"?`);
    if (!isConfirmed) {
      // Re-load to reset the select dropdown to its original value if canceled
      await loadBookings();
      return;
    }
    await mockDb.updateBookingStatus(id, newStatus);
    await loadBookings();
  };

  const handleDeleteBooking = async (id) => {
    const isConfirmed = window.confirm(`PERINGATAN: Apakah Anda yakin ingin menghapus data pesanan ini secara permanen?`);
    if (isConfirmed) {
      await mockDb.deleteBooking(id);
      await loadBookings();
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Dikonfirmasi":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Dikonfirmasi</span>
          </span>
        );
      case "Ditolak":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase">
            <XCircle className="w-3.5 h-3.5" />
            <span>Ditolak</span>
          </span>
        );
      case "Menunggu Konfirmasi":
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu</span>
          </span>
        );
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (statusFilter === 'Semua') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black text-white tracking-tight">Manajemen Booking Live Music</h1>
          <p className="text-slate-400 mt-1 text-sm">Pantau dan kelola pesanan masuk paket Live Band & Acoustic dari klien.</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-3xl border border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-transparent">
          <h3 className="font-bold text-white flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-gold" />
            <span>Daftar Pesanan Masuk</span>
          </h3>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 bg-navy-darker text-white w-full sm:w-auto"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu Konfirmasi">Menunggu</option>
              <option value="Dikonfirmasi">Konfirmasi</option>
              <option value="Ditolak">Tolak</option>
            </select>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Cari pemesan..." className="pl-9 pr-4 py-2 rounded-lg border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 w-full sm:w-64 bg-navy-darker text-white placeholder-slate-500" />
              </div>
              <button 
                onClick={loadBookings}
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
                  <th className="px-6 py-4 font-bold border-b border-white/10">Pemesan</th>
                  <th className="px-6 py-4 font-bold border-b border-white/10">Acara & Lokasi</th>
                  <th className="px-6 py-4 font-bold border-b border-white/10">Paket & Add-on</th>
                  <th className="px-6 py-4 font-bold border-b border-white/10">Total (Est)</th>
                  <th className="px-6 py-4 font-bold border-b border-white/10">Status</th>
                  <th className="px-6 py-4 font-bold border-b border-white/10 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{booking.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{booking.whatsapp}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{new Date(booking.created_at).toLocaleString("id-ID")}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-300">{booking.date}</div>
                      <div className="text-xs text-slate-400 truncate max-w-[150px]" title={booking.venue}>{booking.venue}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-white">{booking.packageName || "N/A"}</div>
                      {booking.themeName && (
                        <div className="text-xs text-gold mt-0.5">+ {booking.themeName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-white">{formatIDR(booking.totalPrice)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center justify-start space-x-2">
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-white/10 text-slate-300 hover:bg-gold/10 hover:text-gold hover:border-gold/30 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className="text-xs h-[34px] border border-white/10 rounded-lg px-2 focus:outline-none focus:ring-1 focus:ring-gold/50 bg-navy-darker text-white"
                        >
                          <option value="Menunggu Konfirmasi">Menunggu</option>
                          <option value="Dikonfirmasi">Konfirmasi</option>
                          <option value="Ditolak">Tolak</option>
                        </select>
                        <button 
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Hapus Pesanan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">Belum ada pesanan masuk.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-navy-dark border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedBooking(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-heading font-black text-white mb-6 pr-8">Detail Pesanan</h2>
            
            <div className="space-y-6">
              {/* Pemesan */}
              <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <Phone className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Data Pemesan</p>
                  <p className="font-bold text-white text-lg">{selectedBooking.name}</p>
                  <p className="text-slate-300 text-sm mt-0.5">{selectedBooking.whatsapp}</p>
                </div>
              </div>

              {/* Acara & Lokasi */}
              <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <MapPin className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Acara & Lokasi</p>
                  <p className="font-bold text-white text-sm">{selectedBooking.date}</p>
                  <p className="text-slate-300 text-sm mt-0.5">{selectedBooking.venue}</p>
                </div>
              </div>

              {/* Paket */}
              <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <Music className="w-5 h-5 text-gold mt-0.5" />
                <div className="w-full">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Paket yang Dipilih</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-white text-sm">{selectedBooking.packageName || "N/A"}</p>
                    <p className="font-bold text-gold">{formatIDR(selectedBooking.totalPrice)}</p>
                  </div>
                  {selectedBooking.themeName && (
                    <p className="text-slate-300 text-xs mt-1">+ {selectedBooking.themeName}</p>
                  )}
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Catatan Tambahan & Request</p>
                <p className="text-slate-300 text-sm italic whitespace-pre-wrap leading-relaxed">
                  {selectedBooking.notes || "Tidak ada catatan."}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              <button 
                onClick={() => setSelectedBooking(null)}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
