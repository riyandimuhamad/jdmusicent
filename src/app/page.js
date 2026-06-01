import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import MeetTheBand from "@/components/landing/MeetTheBand";
import GallerySection from "@/components/landing/GallerySection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <AboutSection />
      <MeetTheBand />
      <GallerySection />
      <TestimonialsSection />
    </div>
  );
}
