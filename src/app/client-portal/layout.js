import React from "react";
import { Globe } from "lucide-react";

export default function ClientPortalLayout({ children }) {
  return (
    <div className="min-h-screen bg-navy-darker flex flex-col text-white font-sans">
      <header className="border-b border-white/10 bg-navy-dark px-6 py-4 flex items-center justify-between">
        <h2 className="font-heading font-black text-xl text-white tracking-tight flex items-center space-x-2">
          <Globe className="w-6 h-6 text-gold" />
          <span>JD<span className="text-gold">Music</span> <span className="font-sans text-sm font-normal text-slate-400">Client Portal</span></span>
        </h2>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
