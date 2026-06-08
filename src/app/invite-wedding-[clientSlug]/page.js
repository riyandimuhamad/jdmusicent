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

  if (error || !clientData) {
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

  // Render the Smart Template with the real client data injected!
  return <DefaultTheme injectedClientData={clientData} injectedThemeId={clientData.themeId} />;
}
