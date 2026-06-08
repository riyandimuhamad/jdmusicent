"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Send, Globe, LogOut, CalendarDays, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { useSidebar } from "@/lib/SidebarContext";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isOpen, setIsOpen } = useSidebar();

  if (pathname.startsWith('/admin/login') || pathname.startsWith('/admin/forgot-password')) {
    return null;
  }

  const navLinks = [
    { href: "/admin", icon: LayoutDashboard, label: "Overview", exact: true },
    { href: "/admin/bookings", icon: CalendarDays, label: "Pesanan Masuk" },
    { href: "/admin/clients", icon: Globe, label: "Manajemen Klien" },
    { href: "/admin/guests", icon: Users, label: "Daftar Tamu (RSVP)" },
    { href: "/admin/broadcast", icon: Send, label: "WA Broadcast" },
  ];

  // Superadmin or the primary 'admin' account always gets access
  if (user?.role === 'superadmin' || user?.username === 'admin') {
    navLinks.push(
      { href: "/admin/settings", icon: Settings, label: "Pengaturan Harga" },
      { href: "/admin/users", icon: Users, label: "Manajemen Admin" }
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "w-64 bg-navy-dark border-r border-white/10 flex flex-col fixed h-full z-40 shadow-lg shadow-black/20 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="font-heading font-black text-2xl text-white tracking-tight">
              JD<span className="text-gold">Admin</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">SaaS Dashboard Mode</p>
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-white p-1"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navLinks.map((link) => {
          const isActive = link.exact 
            ? pathname === link.href 
            : pathname.startsWith(link.href);
            
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-semibold text-sm",
                isActive 
                  ? "bg-gold/10 text-gold border border-gold/20 shadow-inner" 
                  : "hover:bg-white/5 text-slate-300 hover:text-white"
              )}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <Link href="/undangan" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-gold transition-colors font-semibold text-sm">
          <Globe className="w-5 h-5" />
          <span>Katalog Web</span>
        </Link>
        <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-colors font-semibold text-sm">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
}
