"use client";

import React, { useState, useEffect } from "react";
import { Copy, Smartphone, Link as LinkIcon, CheckCircle } from "lucide-react";
import { mockDb } from "@/lib/supabase";

export default function AdminBroadcastPage() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [template, setTemplate] = useState(
    "Kepada Yth. Bapak/Ibu/Saudara/i [NAMA_TAMU],\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami.\n\nBerikut link undangan digital Anda:\n[LINK_UNDANGAN]\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu berkenan hadir di acara pernikahan kami.\n\nTerima kasih.\n[NAMA_PENGANTIN]"
  );
  
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const loadClients = async () => {
      const data = await mockDb.getClients();
      setClients(data);
      if (data.length > 0) {
        setSelectedClient(data[0].id);
      }
    };
    loadClients();
  }, []);

  const handleCopy = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(template);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const clientData = clients.find(c => c.id === selectedClient);
  const dummyGuest = "Budi Santoso";
  const dummyLink = clientData ? `https://jdmusic.com/invitation/${clientData.id}?to=Budi-Santoso` : "https://jdmusic.com/invitation/demo?to=Budi-Santoso";
  const pengantinName = clientData ? `${clientData.bride} & ${clientData.groom}` : "Romeo & Juliet";

  const previewText = template
    .replace(/\[NAMA_TAMU\]/g, dummyGuest)
    .replace(/\[LINK_UNDANGAN\]/g, dummyLink)
    .replace(/\[NAMA_PENGANTIN\]/g, pengantinName);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-heading font-black text-3xl text-white">Template Broadcast WA</h1>
        <p className="text-slate-400 mt-1">Buat template teks undangan yang rapi untuk diserahkan kepada Klien (Pengantin).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Editor Setup */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm flex flex-col h-full">
          
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-xl flex items-start space-x-3 text-sm mb-6">
            <Smartphone className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p><strong>Catatan:</strong> Pengiriman *Broadcast* WA dilakukan secara manual oleh Klien (Pengantin). Fitur ini hanya untuk membuat standar teks yang bisa Anda *copy-paste* ke mereka.</p>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 mb-2">Pilih Klien (Untuk Preview Link)</label>
            <select 
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-gold text-sm bg-navy-darker text-white"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.bride} & {c.groom} ({c.id})</option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex flex-col min-h-[300px] mb-6">
            <div className="space-y-2 mb-4">
              <label className="block text-xs font-bold text-slate-400">Teks Template Broadcast</label>
              <p className="text-xs text-slate-500">Gunakan tag <code>[NAMA_TAMU]</code>, <code>[LINK_UNDANGAN]</code>, dan <code>[NAMA_PENGANTIN]</code> untuk variabel otomatis.</p>
            </div>

            <textarea 
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full flex-1 min-h-[250px] px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none text-sm text-white font-mono bg-black/20"
            />
          </div>

          <button 
            onClick={handleCopy}
            className="w-full py-4 mt-auto bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-600 hover:to-gold text-navy-dark rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center space-x-2 transition-colors shadow-md"
          >
            {isCopied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span>{isCopied ? "TEMPLATE BERHASIL DISALIN!" : "SALIN TEMPLATE UNTUK KLIEN"}</span>
          </button>
        </div>

        {/* Live Preview */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner flex flex-col items-center justify-center relative">
          <h3 className="absolute top-6 left-6 font-heading font-bold text-lg text-slate-300 flex items-center space-x-2">
            <LinkIcon className="w-5 h-5" />
            <span>Live Preview</span>
          </h3>
          
          <div className="w-[300px] h-[550px] bg-white border-[8px] border-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden mt-10">
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
            
            {/* WA Header */}
            <div className="bg-[#075E54] text-white p-3 pt-8 flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
              <div>
                <p className="font-bold text-sm leading-tight">Budi Santoso</p>
                <p className="text-[10px] opacity-80">online</p>
              </div>
            </div>

            {/* WA Background */}
            <div className="bg-[#ECE5DD] h-full p-3 pt-6 relative overflow-y-auto pb-20 custom-scrollbar">
              {/* Message Bubble */}
              <div className="bg-[#DCF8C6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] ml-auto text-sm text-slate-800 relative whitespace-pre-wrap">
                {previewText}
                <div className="text-[10px] text-right mt-1 opacity-60">10:45 AM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
