import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, HeadphonesIcon, Bot, Globe } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Migration",
      description: "Seamlessly migrate your infrastructure to the cloud with zero downtime. AWS, Azure, and GCP certified experts.",
      features: [
        "Infrastructure Assessment",
        "Migration Strategy", 
        "Security Implementation",
        "Performance Optimization"
      ]
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8" />,
      title: "IT Support & Consulting",
      description: "24/7 comprehensive IT support and strategic consulting to keep your business running smoothly.",
      features: [
        "Help Desk Support",
        "Network Management",
        "Security Audits", 
        "Strategic Planning"
      ]
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Agent Automation", 
      description: "Transform your workflows with intelligent automation using n8n and cutting-edge AI technologies.",
      features: [
        "Workflow Automation",
        "AI Integration",
        "Process Optimization",
        "Custom Agents"
      ]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Website Development",
      description: "Create stunning, high-performance websites that convert visitors into customers.",
      features: [
        "Custom Development", 
        "E-commerce Solutions",
        "Mobile Responsive",
        "SEO Optimization"
      ]
    }
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
            🚀 Premium IT Solutions
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Comprehensive</span><br />
            <span className="gradient-text">IT Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From cloud infrastructure to AI automation, we provide end-to-end technology solutions
            that drive growth and efficiency for your business in the digital age.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-md border border-border/50 hover:border-primary/30 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-colors">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                </div>
                <p className="text-muted-foreground">{service.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="gradient-primary text-white border-0 hover:opacity-90 px-8 py-6">
            Schedule Your Free Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;