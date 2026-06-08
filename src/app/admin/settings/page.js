"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, AlertTriangle, Music, Globe, CheckCircle } from "lucide-react";
import { mockDb } from "@/lib/supabase";
import { formatIDR, cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [messageLiveMusic, setMessageLiveMusic] = useState("");
  const [messageInvitations, setMessageInvitations] = useState("");
  const [isEditingLiveMusic, setIsEditingLiveMusic] = useState(false);
  const [isEditingInvitations, setIsEditingInvitations] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'superadmin') {
      router.push('/admin');
      return;
    }
    loadSettings();
  }, [user, router]);

  const loadSettings = async () => {
    setLoading(true);
    const data = await mockDb.getSettings();
    // Deep clone to avoid direct mutation
    setSettings(JSON.parse(JSON.stringify(data)));
    setLoading(false);
  };

  const handleLiveMusicChange = (key, field, value) => {
    const numValue = parseInt(value) || 0;
    setSettings(prev => ({
      ...prev,
      liveMusic: {
        ...prev.liveMusic,
        [key]: {
          ...prev.liveMusic[key],
          [field]: numValue
        }
      }
    }));
  };

  const handleInvitationChange = (key, field, value) => {
    const numValue = parseInt(value) || 0;
    setSettings(prev => ({
      ...prev,
      invitations: {
        ...prev.invitations,
        [key]: {
          ...prev.invitations[key],
          [field]: numValue
        }
      }
    }));
  };

  const saveSettings = async (section) => {
    setSaving(true);
    if (section === 'liveMusic') setMessageLiveMusic("");
    if (section === 'invitations') setMessageInvitations("");
    
    // Ensure discounts aren't larger than base prices
    for (const key in settings.liveMusic) {
      if (settings.liveMusic[key].discount > settings.liveMusic[key].basePrice) {
        settings.liveMusic[key].discount = settings.liveMusic[key].basePrice;
      }
    }
    for (const key in settings.invitations) {
      if (settings.invitations[key].discount > settings.invitations[key].basePrice) {
        settings.invitations[key].discount = settings.invitations[key].basePrice;
      }
    }

    await mockDb.updateSettings(settings);
    
    setSaving(false);
    
    if (section === 'liveMusic') {
      setIsEditingLiveMusic(false);
      setMessageLiveMusic("Tersimpan!");
      setTimeout(() => setMessageLiveMusic(""), 3000);
    } else if (section === 'invitations') {
      setIsEditingInvitations(false);
      setMessageInvitations("Tersimpan!");
      setTimeout(() => setMessageInvitations(""), 3000);
    }
  };

  if (loading || !settings) {
    return <div className="p-12 text-center text-slate-500 animate-pulse">Memuat pengaturan...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-black text-white tracking-tight">Pengaturan Harga & Diskon</h1>
        <p className="text-slate-400 mt-1 text-sm">Ubah harga dasar dan diskon untuk semua paket dan tema.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Live Music Settings */}
        <div className="bg-white/5 rounded-3xl border border-white/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Live Music Packages</h3>
                <p className="text-xs text-slate-400">Atur harga untuk layanan panggung</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {messageLiveMusic && (
                <div className="text-green-400 font-medium text-xs flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{messageLiveMusic}</span>
                </div>
              )}
              {!isEditingLiveMusic ? (
                <button 
                  onClick={() => setIsEditingLiveMusic(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Harga</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsEditingLiveMusic(false)}
                    disabled={saving}
                    className="px-4 py-2 text-sm rounded-lg bg-red-500/10 text-red-400 font-semibold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={() => saveSettings('liveMusic')}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 text-sm rounded-lg bg-gold text-navy-dark font-bold hover:bg-gold-champagne transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(settings.liveMusic).map(([key, data]) => (
              <div key={key} className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="font-bold text-sm text-gold capitalize">{key.replace(/-/g, ' ')}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Harga Asli (Rp)</label>
                    <input 
                      type="number" 
                      value={data.basePrice}
                      onChange={(e) => handleLiveMusicChange(key, 'basePrice', e.target.value)}
                      disabled={!isEditingLiveMusic}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition-colors",
                        isEditingLiveMusic 
                          ? "bg-navy-dark border-white/10 text-white focus:border-gold" 
                          : "bg-transparent border-transparent text-white opacity-80 cursor-not-allowed px-0"
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Diskon (%)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={data.basePrice > 0 ? Math.round((data.discount / data.basePrice) * 100) : 0}
                          onChange={(e) => {
                            const percent = parseInt(e.target.value) || 0;
                            const rpDiscount = Math.round((data.basePrice * percent) / 100);
                            handleLiveMusicChange(key, 'discount', rpDiscount);
                          }}
                          disabled={!isEditingLiveMusic}
                          className={cn(
                            "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition-colors",
                            isEditingLiveMusic 
                              ? "bg-navy-dark border-white/10 text-white focus:border-gold" 
                              : "bg-transparent border-transparent text-white opacity-80 cursor-not-allowed px-0"
                          )}
                        />
                        {isEditingLiveMusic && <span className="absolute right-3 top-2 text-sm text-slate-400 pointer-events-none">%</span>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Diskon (Rp)</label>
                      <input 
                        type="number" 
                        value={data.discount}
                        onChange={(e) => handleLiveMusicChange(key, 'discount', e.target.value)}
                        disabled={!isEditingLiveMusic}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition-colors",
                          isEditingLiveMusic 
                            ? "bg-navy-dark border-white/10 text-white focus:border-gold" 
                            : "bg-transparent border-transparent text-white opacity-80 cursor-not-allowed px-0"
                        )}
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Harga Akhir:</span>
                      <span className="font-bold text-white">{formatIDR(data.basePrice - data.discount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invitations Settings */}
        <div className="bg-white/5 rounded-3xl border border-white/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Undangan Digital Themes</h3>
                <p className="text-xs text-slate-400">Atur harga untuk tema website</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {messageInvitations && (
                <div className="text-green-400 font-medium text-xs flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{messageInvitations}</span>
                </div>
              )}
              {!isEditingInvitations ? (
                <button 
                  onClick={() => setIsEditingInvitations(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Harga</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsEditingInvitations(false)}
                    disabled={saving}
                    className="px-4 py-2 text-sm rounded-lg bg-red-500/10 text-red-400 font-semibold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={() => saveSettings('invitations')}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 text-sm rounded-lg bg-gold text-navy-dark font-bold hover:bg-gold-champagne transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(settings.invitations).map(([key, data]) => (
              <div key={key} className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="font-bold text-sm text-gold capitalize truncate" title={key}>{key.replace(/-/g, ' ')}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Harga Asli (Rp)</label>
                    <input 
                      type="number" 
                      value={data.basePrice}
                      onChange={(e) => handleInvitationChange(key, 'basePrice', e.target.value)}
                      disabled={!isEditingInvitations}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition-colors",
                        isEditingInvitations 
                          ? "bg-navy-dark border-white/10 text-white focus:border-gold" 
                          : "bg-transparent border-transparent text-white opacity-80 cursor-not-allowed px-0"
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Diskon (%)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={data.basePrice > 0 ? Math.round((data.discount / data.basePrice) * 100) : 0}
                          onChange={(e) => {
                            const percent = parseInt(e.target.value) || 0;
                            const rpDiscount = Math.round((data.basePrice * percent) / 100);
                            handleInvitationChange(key, 'discount', rpDiscount);
                          }}
                          disabled={!isEditingInvitations}
                          className={cn(
                            "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition-colors",
                            isEditingInvitations 
                              ? "bg-navy-dark border-white/10 text-white focus:border-gold" 
                              : "bg-transparent border-transparent text-white opacity-80 cursor-not-allowed px-0"
                          )}
                        />
                        {isEditingInvitations && <span className="absolute right-3 top-2 text-sm text-slate-400 pointer-events-none">%</span>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Diskon (Rp)</label>
                      <input 
                        type="number" 
                        value={data.discount}
                        onChange={(e) => handleInvitationChange(key, 'discount', e.target.value)}
                        disabled={!isEditingInvitations}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition-colors",
                          isEditingInvitations 
                            ? "bg-navy-dark border-white/10 text-white focus:border-gold" 
                            : "bg-transparent border-transparent text-white opacity-80 cursor-not-allowed px-0"
                        )}
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Harga Akhir:</span>
                      <span className="font-bold text-white">{formatIDR(data.basePrice - data.discount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
