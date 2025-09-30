import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import FloatingParticles from "@/components/FloatingParticles";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
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
      
      <Footer />
    </div>
  );
};

export default Index;
