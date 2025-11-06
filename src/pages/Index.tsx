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
          <AboutSection className="py-0" />
          <TeamSection />
          <TestimonialsCarousel />
        </div>
      </main>
      
      <TrustedOrganizations />
      
      <Footer />
      
      <NewsletterPopup />
      
      <button onClick={() => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })} className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all">
        {/* Go to Top */}
      </button>

      <script>
        {`
          document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
              // Only scroll to top for internal navigation
              if (this.getAttribute('href') === '#' || this.getAttribute('href') === '#top') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            });
          });
        `}
      </script>
    </div>;
};
export default Index;