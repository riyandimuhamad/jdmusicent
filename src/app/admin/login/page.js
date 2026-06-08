"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const res = await login(username, password);
    if (!res.success) {
      setError(res.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-50 bg-navy-darker">
      <div className="w-full max-w-md bg-white/5 p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <h1 className="font-heading font-black text-3xl text-white tracking-tight">
            JD<span className="text-gold">Admin</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Masuk ke Dashboard Manajemen</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Username</label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-white placeholder-slate-600 transition-all"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Silakan hubungi Super Admin untuk mereset password Anda."); }} className="text-xs text-gold hover:text-yellow-400 transition-colors">Lupa Password?</a>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-white placeholder-slate-600 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-600 hover:to-gold text-navy-dark rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-70 shadow-lg shadow-gold/20"
          >
            {loading ? (
              <span className="animate-pulse">MEMPROSES...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>MASUK</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
