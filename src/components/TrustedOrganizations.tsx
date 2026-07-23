import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { SiGooglecloud, SiSap, SiCisco, SiDell } from 'react-icons/si';
import type { IconType } from 'react-icons';

// Only some of these certifications have a real logo available from our icon
// library (Simple Icons doesn't include Microsoft/AWS/Salesforce/IBM/Oracle at
// all). The rest render as a text badge until official partner/certification
// badge assets are supplied.
const certifications: { name: string; icon?: IconType; category: string }[] = [
  { name: "Microsoft Azure", category: "Cloud Platform" },
  { name: "Amazon Web Services", category: "Cloud Services" },
  { name: "Google Cloud", icon: SiGooglecloud, category: "Cloud Platform" },
  { name: "Salesforce", category: "CRM Solutions" },
  { name: "IBM", category: "Enterprise Tech" },
  { name: "Oracle", category: "Database Solutions" },
  { name: "SAP", icon: SiSap, category: "Business Software" },
  { name: "Cisco", icon: SiCisco, category: "Networking" },
  { name: "Dell Technologies", icon: SiDell, category: "IT Hardware" }
];

const TrustedOrganizations = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (interval) return;
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % certifications.length);
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
  }, []);

  const getVisibleCertifications = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(certifications[(currentIndex + i) % certifications.length]);
    }
    return visible;
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Our Certified Expertise
          </h2>
          <p className="text-muted-foreground text-lg">
            Certified across the platforms that power modern business
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex gap-6">
            {getVisibleCertifications().map((cert, index) => {
              const Icon = cert.icon;
              return (
                <Card
                  key={`${cert.name}-${index}`}
                  className="flex-shrink-0 w-64 p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                >
                  <div className="text-center">
                    <div className="h-16 flex items-center justify-center mb-4 animate-scale-in">
                      {Icon && <Icon className="w-12 h-12 text-foreground" aria-hidden="true" />}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">{cert.category}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {certifications.map((_, index) => (
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
