import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import AnimatedText from "./AnimatedText";
import StatsSection from "./StatsSection";
const HeroSection = () => {
  return <section className="relative min-h-[100svh] lg:min-h-screen flex items-center justify-center pt-28 pb-16 lg:pt-24 lg:pb-20 animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto space-y-6 lg:space-y-8 text-center">
          {/* Trust Badge */}
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
            ✨ Trusted IT Solutions Partner ✨
          </Badge>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1]">
              <span className="text-foreground">Transform</span><br />
              <span className="text-foreground">Your</span><br />
              <AnimatedText />
            </h1>

            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-muted-foreground">
              We build the{" "}
              <span className="font-semibold text-[#fe0000]">software</span>,{" "}
              <span className="font-semibold text-[#f1fb00]">AI automation</span>, and IT
              infrastructure that turn bold ideas into products people actually use.
            </p>
          </div>

          {/* CTA + Stats */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 items-center justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-primary text-white hover:opacity-90 transition-all hover:scale-105 shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                Get Started Today
              </Button>
            </Link>

            <StatsSection />
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;