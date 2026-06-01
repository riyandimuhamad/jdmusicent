import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: {
    template: "%s | JD Music Entertainment",
    default: "JD Music Entertainment - Live Band & Digital Wedding Invitation",
  },
  description: "Vendor live band dan hiburan musik pernikahan premium terbaik di Bandung, Jakarta, Tasikmalaya. Dilengkapi paket bundling undangan digital eksklusif.",
  keywords: [
    "wedding band",
    "live music",
    "vendor musik pernikahan",
    "undangan digital",
    "live band bandung",
    "live band jakarta",
    "hiburan musik",
    "JD Music"
  ],
  authors: [{ name: "JD Music Entertainment" }],
  openGraph: {
    title: "JD Music Entertainment - Live Band & Digital Wedding Invitation",
    description: "Vendor hiburan musik pernikahan premium terbaik dengan layanan bundling undangan digital eksklusif.",
    url: "https://jdmusic.ent",
    siteName: "JD Music Entertainment",
    locale: "id_ID",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-navy-dark text-slate-200 font-sans selection:bg-gold/30 selection:text-white relative"
        suppressHydrationWarning
      >
        {/* Background Layer 1: Slow Pulsing Aurora Glows (Subtle Purple/Blue) */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen">
          <div className="aurora-base aurora-top"></div>
          <div className="aurora-base aurora-bottom"></div>
          <div className="aurora-base aurora-left"></div>
          <div className="aurora-base aurora-right"></div>
        </div>

        {/* Background Layer 2: Fixed Ambient Glow Backgrounds */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[5%] left-[-15%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-radial-organic-glow opacity-40"></div>
          <div className="absolute bottom-[15%] right-[-15%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-radial-organic-glow-blue opacity-30"></div>
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-radial-organic-glow opacity-20"></div>
        </div>

        {/* Background Layer 3: Twinkling Stars (Expanded & Evenly Distributed) */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
          {/* Top Left Quadrant */}
          <div className="absolute top-[10%] left-[15%] w-1.5 h-1.5 bg-gold rounded-full animate-ping duration-1000 delay-100" />
          <div className="absolute top-[25%] left-[5%] w-2 h-2 bg-white rounded-full animate-pulse duration-700 delay-300" />
          <div className="absolute top-[5%] left-[35%] w-1 h-1 bg-electric rounded-full animate-pulse duration-1000 delay-700" />

          {/* Top Right Quadrant */}
          <div className="absolute top-[15%] right-[15%] w-2 h-2 bg-gold rounded-full animate-pulse duration-700 delay-200" />
          <div className="absolute top-[8%] right-[35%] w-1.5 h-1.5 bg-white rounded-full animate-ping duration-1000 delay-500" />
          <div className="absolute top-[30%] right-[8%] w-2.5 h-2.5 bg-electric rounded-full animate-pulse duration-1000 delay-150" />

          {/* Middle Left Quadrant */}
          <div className="absolute top-[45%] left-[10%] w-2 h-2 bg-gold rounded-full animate-pulse duration-1000 delay-500" />
          <div className="absolute top-[60%] left-[20%] w-1.5 h-1.5 bg-white rounded-full animate-ping duration-700 delay-200" />
          <div className="absolute top-[35%] left-[25%] w-1 h-1 bg-gold rounded-full animate-pulse duration-500 delay-100" />

          {/* Middle Right Quadrant */}
          <div className="absolute top-[50%] right-[15%] w-2 h-2 bg-white rounded-full animate-ping duration-1000 delay-300" />
          <div className="absolute top-[65%] right-[5%] w-1.5 h-1.5 bg-electric rounded-full animate-pulse duration-700 delay-700" />
          <div className="absolute top-[40%] right-[25%] w-1 h-1 bg-gold rounded-full animate-pulse duration-1000 delay-100" />

          {/* Bottom Left Quadrant */}
          <div className="absolute bottom-[15%] left-[15%] w-2.5 h-2.5 bg-gold rounded-full animate-pulse duration-700 delay-150" />
          <div className="absolute bottom-[5%] left-[30%] w-1.5 h-1.5 bg-white rounded-full animate-ping duration-1000 delay-500" />
          <div className="absolute bottom-[25%] left-[5%] w-1 h-1 bg-electric rounded-full animate-pulse duration-500 delay-300" />

          {/* Bottom Right Quadrant */}
          <div className="absolute bottom-[20%] right-[20%] w-2 h-2 bg-gold rounded-full animate-ping duration-1000 delay-200" />
          <div className="absolute bottom-[10%] right-[5%] w-1.5 h-1.5 bg-white rounded-full animate-pulse duration-700 delay-700" />
          <div className="absolute bottom-[30%] right-[35%] w-2 h-2 bg-gold rounded-full animate-pulse duration-1000 delay-100" />

          {/* Center Area (Sparse to not block content heavily) */}
          <div className="absolute top-[40%] left-[40%] w-1.5 h-1.5 bg-white rounded-full animate-ping duration-1000 delay-300" />
          <div className="absolute bottom-[40%] right-[40%] w-1.5 h-1.5 bg-gold rounded-full animate-pulse duration-700 delay-500" />
        </div>

        {/* Global Page Wrapper */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
