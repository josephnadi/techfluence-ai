import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import DashboardMockup from "./DashboardMockup";

const DashboardShowcaseSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-16 relative" ref={ref}>
      <div className={`container mx-auto px-6 transition-all duration-1000 ${isVisible ? "scroll-fade-in" : "opacity-0"}`}>
        <div className="text-center mb-12">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
            ⚡ Live System
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Real-Time</span>{" "}
            <span className="text-primary">Project Dashboards</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            A live look at the systems we build and manage for our clients — cloud migrations,
            AI automation, and more, tracked in real time.
          </p>
        </div>

        <div className="w-full max-w-3xl lg:max-w-4xl mx-auto">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
};
export default DashboardShowcaseSection;
