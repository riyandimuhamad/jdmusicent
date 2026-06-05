"use client";

import React, { useState } from "react";
import { Send, Smartphone, Link as LinkIcon, RefreshCw } from "lucide-react";

export default function AdminBroadcastPage() {
  const [template, setTemplate] = useState(
    "Kepada Yth. Bapak/Ibu/Saudara/i [NAMA_TAMU],\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami.\n\nBerikut link undangan digital Anda:\n[LINK_UNDANGAN]\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu berkenan hadir di acara pernikahan kami.\n\nTerima kasih.\nRomeo & Juliet"
  );
  
  const [isSending, setIsSending] = useState(false);

  const handleBroadcast = (e) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate sending broadcast
    setTimeout(() => {
      setIsSending(false);
      alert("Broadcast berhasil dikirim ke 150 kontak tamu! (Ini adalah Mockup)");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-heading font-black text-3xl text-navy-dark">WhatsApp Broadcast</h1>
        <p className="text-slate-500 mt-1">Kirim undangan massal ke daftar kontak tamu Anda secara otomatis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Setup */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-lg text-navy-dark flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-gold" />
              <span>Pesan Undangan</span>
            </h3>
            <p className="text-xs text-slate-500">Gunakan tag <code>[NAMA_TAMU]</code> dan <code>[LINK_UNDANGAN]</code> agar pesan dikustomisasi secara otomatis untuk setiap tamu.</p>
          </div>

          <textarea 
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows="12"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none text-sm text-slate-700 font-mono"
          />

          <button 
            onClick={handleBroadcast}
            disabled={isSending}
            className="w-full py-4 bg-navy-dark hover:bg-navy-darker text-white rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center space-x-2 transition-colors disabled:opacity-70"
          >
            {isSending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            <span>{isSending ? "MENGIRIM PESAN..." : "KIRIM BROADCAST"}</span>
          </button>
        </div>

        {/* Live Preview */}
        <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 shadow-inner flex flex-col items-center justify-center relative">
          <h3 className="absolute top-6 left-6 font-heading font-bold text-lg text-slate-600 flex items-center space-x-2">
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
                {template.replace('[NAMA_TAMU]', 'Budi Santoso').replace('[LINK_UNDANGAN]', 'https://jdmusic.com/demo/lokal-sunda-priangan?to=Budi-Santoso')}
                <div className="text-[10px] text-right mt-1 opacity-60">10:45 AM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
