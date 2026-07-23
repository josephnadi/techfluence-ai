import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import dashboard1 from "@/assets/dashboard-1.jpg";
import dashboard2 from "@/assets/dashboard-2.jpg";
import dashboard3 from "@/assets/dashboard-3.jpg";
import dashboard4 from "@/assets/dashboard-4.jpg";

const DashboardMockup = () => {
  const dashboards = [
    { image: dashboard1, title: "Cloud Services" },
    { image: dashboard2, title: "AI Automation" }, 
    { image: dashboard3, title: "Cloud Migration" },
    { image: dashboard4, title: "Website Analytics" }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dashboards.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Main Dashboard Card */}
      <Card className="bg-card border border-border p-5 sm:p-6 lg:p-8 rounded-2xl hero-glow">
        <div className="space-y-4 sm:space-y-5">
          {/* Live System Status */}
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 whitespace-nowrap">
              ⚡ Live System
            </Badge>
            <span className="text-sm sm:text-base font-medium text-green-400 whitespace-nowrap">99.9% Uptime</span>
          </div>

          {/* Dashboard Gallery */}
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 p-2 sm:p-3">
            <div className="aspect-video rounded-lg overflow-hidden relative">
              <img
                src={dashboards[currentIndex].image}
                alt={`${dashboards[currentIndex].title} Dashboard Interface`}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute bottom-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                {dashboards[currentIndex].title}
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-2 h-2 shrink-0 bg-primary rounded-full"></div>
                <span className="text-sm font-medium truncate">Cloud Migration</span>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 shrink-0">
                Active Project
              </Badge>
            </div>

            <div className="flex items-center justify-between gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-2 h-2 shrink-0 bg-accent rounded-full"></div>
                <span className="text-sm font-medium truncate">AI Automation</span>
              </div>
              <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 shrink-0">
                In Progress
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Floating Action Indicators */}
      <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-9 sm:h-9 bg-accent rounded-full flex items-center justify-center animate-pulse text-sm">
        ⚡
      </div>

      <div className="absolute -bottom-3 -left-3 w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-full flex items-center justify-center animate-bounce text-xs">
        🚀
      </div>
    </div>
  );
};

export default DashboardMockup;