import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import AnimatedText from "./AnimatedText";
import DashboardMockup from "./DashboardMockup";
import StatsSection from "./StatsSection";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <Badge 
              variant="secondary" 
              className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium"
            >
              ✨ Trusted IT Solutions Partner ✨
            </Badge>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-foreground">Transform</span><br />
                <span className="text-foreground">Your</span><br />
                <AnimatedText />
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Accelerate your business with expert{" "}
                <span className="text-primary font-medium">cloud migration</span>, 
                <span className="text-accent font-medium"> AI automation</span>, and 
                comprehensive IT solutions.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gradient-primary text-white border-0 hover:opacity-90 px-8 py-6 text-lg font-medium hero-glow"
              >
                ✨ Get Started Today →
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg"
                className="text-foreground hover:text-primary px-8 py-6 text-lg font-medium"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <StatsSection />
          </div>

          {/* Right Column - Dashboard Mockup */}
          <div className="relative">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;