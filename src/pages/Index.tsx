import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import FloatingParticles from "@/components/FloatingParticles";
import AnimatedBackground from "@/components/AnimatedBackground";
import TrustedOrganizations from "@/components/TrustedOrganizations";
import Footer from "@/components/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";
const Index = () => {
  const { hash } = useLocation();

  // Handles nav links like "/#services" clicked from another page: Header
  // navigates here client-side, then we scroll to the target section once
  // it's mounted (avoids the full page reload the old code used instead).
  useEffect(() => {
    if (!hash) return;
    const element = document.getElementById(hash.substring(1));
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Place this as the first element in your <body> */}
      <div id="top"></div>
      
      <AnimatedBackground />
      <FloatingParticles />
      
      <Header />
      
      <main className="relative z-10">
        <HeroSection />
        <div className="space-y-8">
          <ServicesSection />
          <AboutSection />
          <TeamSection />
          <TestimonialsCarousel />
        </div>
      </main>
      
      <TrustedOrganizations />
      
      <Footer />
      
      <NewsletterPopup />
      
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Go to top"
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>;
};
export default Index;