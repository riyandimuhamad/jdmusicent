import React from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Send, Globe, LogOut } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | JD Music",
  description: "SaaS Admin Dashboard for Managing Invitations",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10 shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-heading font-black text-2xl text-navy-dark tracking-tight">
            JD<span className="text-gold">Admin</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">SaaS Dashboard Mode</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-navy-dark transition-colors font-semibold text-sm">
            <LayoutDashboard className="w-5 h-5" />
            <span>Overview</span>
          </Link>
          <Link href="/admin/guests" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-navy-dark transition-colors font-semibold text-sm">
            <Users className="w-5 h-5" />
            <span>Daftar Tamu (RSVP)</span>
          </Link>
          <Link href="/admin/broadcast" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-navy-dark transition-colors font-semibold text-sm">
            <Send className="w-5 h-5" />
            <span>WA Broadcast</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link href="/undangan" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-navy-dark transition-colors font-semibold text-sm">
            <Globe className="w-5 h-5" />
            <span>Katalog Web</span>
          </Link>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors font-semibold text-sm">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
