import { useEffect, useState } from 'react';
import { Card } from './ui/card';

const TrustedOrganizations = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const organizations = [
    { name: "Microsoft", logo: "🏢", industry: "Technology" },
    { name: "Amazon Web Services", logo: "☁️", industry: "Cloud Services" },
    { name: "Salesforce", logo: "⚡", industry: "CRM Solutions" },
    { name: "IBM", logo: "🔷", industry: "Enterprise Tech" },
    { name: "Oracle", logo: "🔴", industry: "Database Solutions" },
    { name: "SAP", logo: "🟦", industry: "Business Software" },
    { name: "Cisco", logo: "🔵", industry: "Networking" },
    { name: "Dell Technologies", logo: "💻", industry: "IT Hardware" }
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (interval) return;
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % organizations.length);
      }, 3000);
    };
    const stop = () => {
      if (!interval) return;
      clearInterval(interval);
      interval = null;
    };

    // Don't keep re-rendering every 3s while the tab is backgrounded/hidden.
    const handleVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", handleVisibility);
    start();

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [organizations.length]);

  const getVisibleOrgs = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(organizations[(currentIndex + i) % organizations.length]);
    }
    return visible;
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </h2>
          <p className="text-muted-foreground text-lg">
            Partnering with global organizations to deliver excellence
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex gap-6">
            {getVisibleOrgs().map((org, index) => (
              <Card 
                key={`${org.name}-${index}`}
                className="flex-shrink-0 w-64 p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-scale-in">{org.logo}</div>
                  <h3 className="font-bold text-lg mb-2">{org.name}</h3>
                  <p className="text-sm text-muted-foreground">{org.industry}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {organizations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedOrganizations;
