"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, HelpCircle, PhoneCall } from "lucide-react";
import packagesData from "@/data/packages.json";
import { mockDb } from "@/lib/supabase";
import PackageCard from "@/components/pricelist/PackageCard";
import DetailsModal from "@/components/pricelist/DetailsModal";

export default function PricelistPage() {
  const router = useRouter();
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  React.useEffect(() => {
    async function loadSettings() {
      const data = await mockDb.getSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  const handleShowDetails = (pkg) => {
    setSelectedPkg(pkg);
    setIsModalOpen(true);
  };

  const handleBook = (pkg) => {
    router.push(`/booking?package=${pkg.id}`);
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Background Radial Glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-radial-gradient-glow opacity-30 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1 text-gold text-xs font-semibold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Pricelist & Paket</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-tight">
            Pilihan Paket Hiburan <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-gold via-gold-champagne to-electric bg-clip-text text-transparent text-glow-gold">
              Musik Pernikahan
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Dapatkan transparansi harga dengan pilihan paket panggung yang dirancang khusus untuk memeriahkan pesta pernikahan Anda. Seluruh paket sudah termasuk konsultasi gratis daftar lagu.
          </p>
        </div>

        {/* Packages List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 max-w-6xl mx-auto">
          {packagesData.map((pkg) => {
            const dynamicPkg = { ...pkg };
            if (settings && settings.liveMusic[pkg.id]) {
              dynamicPkg.price = settings.liveMusic[pkg.id].basePrice - settings.liveMusic[pkg.id].discount;
              dynamicPkg.originalPrice = settings.liveMusic[pkg.id].basePrice;
            }
            return (
              <PackageCard
                key={dynamicPkg.id}
                pkg={dynamicPkg}
                onShowDetails={handleShowDetails}
                onBook={handleBook}
              />
            );
          })}
        </div>

        {/* Technical & Riders FAQ Notes */}
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl glass-card border border-white/5 space-y-6">
          <div className="flex items-center space-x-3 text-gold">
            <HelpCircle className="w-5 h-5" />
            <h3 className="font-heading font-bold text-base sm:text-lg">Catatan Penting Pemesanan (Riders & Teknis)</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300 pl-1 list-disc list-inside">
            <li>
              <strong className="text-white">Pemesanan Minimal H-14:</strong> Memudahkan musisi kami berlatih lagu pilihan khusus Anda.
            </li>
            <li>
              <strong className="text-white">Uang Muka (DP):</strong> Pemesanan dianggap sah setelah melakukan pembayaran DP minimal 30% dari total biaya paket.
            </li>
            <li>
              <strong className="text-white">Kebutuhan Sound System:</strong> Sound system panggung disediakan oleh kami lengkap dengan operator suara berlisensi.
            </li>
            <li>
              <strong className="text-white">Transportasi & Akomodasi:</strong> Biaya sudah termasuk wilayah Bandung. Di luar kota Bandung dikenakan tambahan biaya bensin/akomodasi wajar.
            </li>
          </ul>

          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              Punya kebutuhan instrumen tambahan (Orkestra, Trumpet, Harpa)? Hubungi admin langsung.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WA || "6285147746761"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-gold animate-bounce" />
              <span>Tanya Admin</span>
            </a>
          </div>
        </div>

      </div>

      {/* Dynamic Details Modal Popup (Placed at Root to avoid z-index trapping) */}
      <DetailsModal
        isOpen={isModalOpen}
        pkg={selectedPkg}
        onClose={() => setIsModalOpen(false)}
        onBook={handleBook}
      />
    </div>
  );
}
