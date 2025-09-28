import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle, Award, Clock, Building } from "lucide-react";

const AboutSection = () => {
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
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 mb-4">
            Excellence in IT Solutions
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Why Choose</span><br />
            <span className="gradient-text">Techfluence?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            With over a decade of experience in enterprise IT solutions, we've helped hundreds of 
            companies modernize their technology stack and accelerate digital transformation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/30 backdrop-blur-md border border-border/50 p-6 text-center group hover:border-primary/30 transition-all duration-300">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit text-primary group-hover:bg-primary/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;