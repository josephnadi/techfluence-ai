import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedText from "./AnimatedText";
import DashboardMockup from "./DashboardMockup";
import StatsSection from "./StatsSection";
const HeroSection = () => {
  return <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
              ✨ Trusted IT Solutions Partner ✨
            </Badge>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-7xl font-bold leading-tight md:text-8xl">
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
              <Link to="/contact">
                <Button size="lg" className="bg-primary text-white hover:opacity-90 transition-all hover:scale-105 shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                  Get Started Today
                </Button>
              </Link>
              
              <Button variant="ghost" size="lg" className="text-foreground hover:text-primary px-8 py-6 text-lg font-medium transition-all hover:scale-105" asChild>
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </a>
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
    </section>;
};
export default HeroSection;