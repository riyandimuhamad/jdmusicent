"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useSidebar } from "@/lib/SidebarContext";
import { mockDb } from "@/lib/supabase";

export default function AdminContentWrapper({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isOpen, setIsOpen } = useSidebar();
  const isAuthPage = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/forgot-password');

  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      const activities = await mockDb.getRecentActivities();
      const clients = await mockDb.getClients();
      
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      const expiredClients = clients.filter(c => {
        if (!c.eventDateISO || c.status === 'Diarsipkan') return false;
        const eventDate = new Date(c.eventDateISO);
        return now > eventDate;
      });

      const expiryNotifs = expiredClients.map(c => ({
        id: `exp_${c.id}`,
        type: 'expiry',
        title: `Acara Telah Usai: ${c.short}`,
        description: `Acara pernikahan klien ini telah lewat. Segera arsipkan undangan.`,
        created_at: new Date().toISOString(),
        clientId: c.id
      }));

      setNotifications([...expiryNotifs, ...activities].slice(0, 5));
    };
    
    if (user && !isAuthPage) {
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 60000);
      return () => clearInterval(interval);
    }
  }, [user, isAuthPage]);

  return (
    <main className={cn(
      "flex-1 bg-navy-darker w-full min-h-screen flex flex-col transition-all duration-300",
      !isAuthPage ? "ml-0 md:ml-64 p-4 sm:p-8 pt-20 sm:pt-8" : ""
    )}>
      {!isAuthPage && (
        <div className="absolute top-4 left-4 z-40 md:hidden">
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <div className={cn("mx-auto w-full flex-1 flex flex-col relative", !isAuthPage ? "max-w-7xl" : "")}>
        {!isAuthPage && (
          <div className="absolute top-[-48px] sm:top-2 right-0 z-50">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-gold rounded-xl transition-colors relative shadow-sm"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-navy-dark"></span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-navy-dark border border-white/10 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Notifikasi Terbaru</h3>
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">{notifications.length}</span>
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <p className={`text-sm font-bold mb-1 group-hover:text-gold transition-colors ${notif.type === 'expiry' ? 'text-red-400' : 'text-white'}`}>{notif.title}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{notif.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-[10px] text-slate-500 font-mono">{new Date(notif.created_at).toLocaleString("id-ID")}</p>
                          {notif.type === 'expiry' && (
                            <button 
                              onClick={async () => {
                                const isConfirmed = window.confirm(`Apakah Anda yakin ingin mengarsipkan klien ini?`);
                                if (isConfirmed) {
                                  await mockDb.updateClientStatus(notif.clientId, 'Diarsipkan');
                                  alert('Berhasil diarsipkan.');
                                  window.location.reload();
                                }
                              }}
                              className="text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-2 py-1 rounded-md transition-colors font-bold"
                            >
                              Arsipkan
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-sm text-slate-500">Tidak ada notifikasi baru</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </main>
  );
}
