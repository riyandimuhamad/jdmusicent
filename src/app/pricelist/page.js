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
        <div className="max-w-6xl mx-auto p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-slate-900/80 to-navy-darker/80 backdrop-blur-md border border-white/5 shadow-2xl relative overflow-hidden group">
          {/* Subtle Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/10 transition-colors duration-700" />
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10">
            {/* Left Column: Header & CTA */}
            <div className="lg:w-1/3 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center space-x-3 text-gold mb-3">
                  <div className="p-2 bg-gold/10 rounded-lg border border-gold/20">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white">
                    Catatan Pemesanan
                  </h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Informasi teknis dan riders terkait persiapan acara. Harap dibaca dengan saksama sebelum melanjutkan pemesanan paket hiburan Anda.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Punya kebutuhan instrumen tambahan (Orkestra, Trumpet, Harpa)?
                </p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WA || "6285147746761"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-bold text-navy-dark bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold transition-all shadow-lg shadow-gold/20"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>Hubungi Admin</span>
                </a>
              </div>
            </div>

            {/* Right Column: List of Notes */}
            <div className="lg:w-2/3 flex flex-col justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {/* Item 1 */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                    <strong className="text-sm font-bold tracking-wide">Pemesanan Minimal H-14</strong>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-3.5 border-l border-white/10 ml-0.5">
                    Memudahkan musisi kami untuk menyiapkan dan berlatih lagu pilihan khusus untuk momen spesial Anda.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                    <strong className="text-sm font-bold tracking-wide">Uang Muka (DP)</strong>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-3.5 border-l border-white/10 ml-0.5">
                    Pemesanan dianggap sah setelah melakukan pembayaran DP minimal 30% dari total biaya paket yang dipilih.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                    <strong className="text-sm font-bold tracking-wide">Sound System</strong>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-3.5 border-l border-white/10 ml-0.5">
                    Sound system panggung standar disediakan oleh kami lengkap dengan operator suara profesional berlisensi.
                  </p>
                </div>

                {/* Item 4 */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                    <strong className="text-sm font-bold tracking-wide">Transportasi & Akomodasi</strong>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-3.5 border-l border-white/10 ml-0.5">
                    Biaya sudah termasuk wilayah Bandung. Di luar kota Bandung dikenakan tambahan biaya akomodasi yang wajar.
                  </p>
                </div>
              </div>
            </div>
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
