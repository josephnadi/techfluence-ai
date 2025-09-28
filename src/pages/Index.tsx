import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FloatingParticles from "@/components/FloatingParticles";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <FloatingParticles />
      
      <Header />
      
      <main className="relative z-10">
        <HeroSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
