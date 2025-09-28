import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DashboardMockup = () => {
  return (
    <div className="relative">
      {/* Main Dashboard Card */}
      <Card className="bg-card/50 backdrop-blur-md border border-border/50 p-6 rounded-2xl hero-glow">
        <div className="space-y-4">
          {/* Live System Status */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              ⚡ Live System
            </Badge>
            <span className="text-sm font-medium text-green-400">99.9% Uptime</span>
          </div>

          {/* Team Image */}
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 p-4">
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="w-16 h-16 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                  👥
                </div>
                <p className="text-sm">IT Team Dashboard</p>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">Cloud Migration</span>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                Active Project
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm font-medium">AI Automation</span>
              </div>
              <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                In Progress
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Floating Action Indicators */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-pulse">
        ⚡
      </div>
      
      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-bounce">
        🚀
      </div>
    </div>
  );
};

export default DashboardMockup;