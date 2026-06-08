"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DefaultTheme from "@/components/invitations/DefaultTheme";
import { mockDb } from "@/lib/supabase";

export default function ClientInvitationRouter() {
  const params = useParams();
  const clientSlug = params.clientSlug;

  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchClient() {
      const data = await mockDb.getClient(clientSlug);
      if (data) {
        setClientData(data);
      } else {
        setError(true);
      }
      setLoading(false);
    }
    
    fetchClient();
  }, [clientSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-dark flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="animate-pulse text-xs tracking-widest font-bold">MENYIAPKAN UNDANGAN...</p>
      </div>
    );
  }

  if (error || !clientData || clientData.status === 'Nonaktif') {
    return (
      <div className="min-h-screen bg-navy-dark flex flex-col items-center justify-center text-white p-8 text-center">
        <h1 className="font-heading text-4xl text-gold mb-4">404</h1>
        <p className="text-sm opacity-80 mb-8 max-w-md">
          Maaf, undangan untuk "{clientSlug}" tidak ditemukan atau masa aktifnya telah habis.
        </p>
        <a href="/booking" className="px-6 py-3 rounded-full bg-gold text-navy-dark font-bold text-xs uppercase tracking-widest">
          Buat Undangan Anda
        </a>
      </div>
    );
  }

  if (clientData.status === 'Diarsipkan') {
    return (
      <div className="min-h-screen bg-navy-dark flex flex-col items-center justify-center text-white p-8 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl text-white mb-4">Akses Ditangguhkan</h1>
        <p className="text-sm text-slate-400 mb-8 max-w-md leading-relaxed">
          Mohon maaf, akses ke undangan digital ini sedang ditangguhkan. Silakan hubungi admin penyedia layanan (JD Music) untuk menyelesaikan kelengkapan administrasi Anda.
        </p>
        <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-gold text-navy-dark font-bold text-xs uppercase tracking-widest hover:bg-yellow-400 transition-colors">
          Hubungi Admin
        </a>
      </div>
    );
  }

  // Render the Smart Template with the real client data injected!
  return <DefaultTheme injectedClientData={clientData} injectedThemeId={clientData.themeId} />;
}
