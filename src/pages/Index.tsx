import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FloatingParticles from "@/components/FloatingParticles";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <FloatingParticles />
      
      <Header />
      
      <main className="relative z-10">
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <TeamSection />
        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
