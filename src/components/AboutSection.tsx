import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { CheckCircle, Award, Clock, Building, ArrowRight } from "lucide-react";

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certified Cloud Experts",
      description: "AWS, Azure, and GCP certified professionals with 4+ years experience"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "60% Efficiency Increase", 
      description: "Custom AI automation solutions that dramatically boost productivity"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Proactive Support",
      description: "Round-the-clock monitoring and instant response for critical systems"
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Fortune 500 Experience",
      description: "Proven track record with enterprise-grade solutions and implementations"
    }
  ];

  const stats = [
    { value: "4+", label: "Expert Team" },
    { value: "15+", label: "Certifications" },
    { value: "4+", label: "Years Experience" },
    { value: "99.9%", label: "Uptime Guarantee" }
  ];

  return (
    <section id="about" className="py-16 relative" ref={ref}>
      <div className={`container mx-auto px-6 transition-all duration-1000 ${isVisible ? 'scroll-fade-in' : 'opacity-0'}`}>
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 mb-4">
            Excellence in IT Solutions
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-vibrant">
            <span className="text-foreground">Why Choose</span><br />
            <span className="text-primary">Techfluence?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            With over a decade of experience in enterprise IT solutions, we've helped hundreds of 
            companies modernize their technology stack and accelerate digital transformation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-card/30 backdrop-blur-md border border-border/50 p-6 text-center group hover:border-primary/30 transition-all duration-500 animate-fade-in hover:scale-105 card-float" 
              style={{animationDelay: `${index * 100}ms`}}
            >
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit text-primary group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(124,58,237,0.7)] group-hover:animate-pulse">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2 text-vibrant">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Add CTA at the end */}
        <div className="text-center mt-16">
          <Link to="/contact">
            <Button 
              size="lg" 
              className="bg-primary text-white hover:opacity-90 transition-all hover:scale-105 shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
            >
              Schedule Your Free Consultation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 rounded-xl card-float"
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2 text-vibrant">{stat.value}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;