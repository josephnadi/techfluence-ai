import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, HeadphonesIcon, Bot, Globe, TrendingUp, Palette, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import CaseStudies from "@/components/CaseStudies";
const ServicesSection = () => {
  const {
    ref,
    isVisible
  } = useScrollAnimation();
  const navigate = useNavigate();
  const services = [ {
    icon: <Bot className="w-8 h-8" />,
    title: "AI Agent Automation",
    description: "Transform your workflows with intelligent automation using n8n and cutting-edge AI technologies.",
    features: ["Workflow Automation", "AI Integration", "Process Optimization", "Custom Agents"]
  },{
    icon: <HeadphonesIcon className="w-8 h-8" />,
    title: "IT Support & Consulting",
    description: "24/7 comprehensive IT support and strategic consulting to keep your business running smoothly.",
    features: ["Help Desk Support", "Network Management", "Security Audits", "Strategic Planning"]
  },  {
    icon: <Globe className="w-8 h-8" />,
    title: "Website Development",
    description: "Create stunning, high-performance websites that convert visitors into customers.",
    features: ["Custom Development", "E-commerce Solutions", "Mobile Responsive", "SEO Optimization"]
  }, {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Digital Marketing",
    description: "Boost your online presence with data-driven marketing strategies that deliver measurable results.",
    features: ["SEO & SEM", "Content Marketing", "Social Media Strategy", "Analytics & Reporting"]
  }, {
    icon: <Palette className="w-8 h-8" />,
    title: "Brand Design",
    description: "Create a memorable brand identity that resonates with your audience and stands out in the market.",
    features: ["Logo Design", "Brand Guidelines", "Visual Identity", "Marketing Collateral"]
  }, {
    icon: <Eye className="w-8 h-8" />,
    title: "Visibility Services",
    description: "Enhance your digital footprint and reputation with comprehensive visibility and online presence management.",
    features: ["Online Reputation", "Local SEO", "Review Management", "Citation Building"]
  }, {
    icon: <Cloud className="w-8 h-8" />,
    title: "Cloud Migration",
    description: "Seamlessly migrate your infrastructure to the cloud with zero downtime. AWS, Azure, and GCP certified experts.",
    features: ["Infrastructure Assessment", "Migration Strategy", "Security Implementation", "Performance Optimization"]
  }];
  return <section id="services" className="py-16 relative" ref={ref}>
      <div className={`container mx-auto px-6 transition-all duration-1000 ${isVisible ? 'scroll-fade-in' : 'opacity-0'}`}>
        {/* Header */}
        <div className="text-center mb-16 my-0 py-0">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
            🚀 Premium IT Solutions
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Comprehensive</span><br />
            <span className="text-primary">IT Solutions</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-neutral-50">
            From cloud infrastructure to AI automation, we provide end-to-end technology solutions
            that drive growth and efficiency for your business in the digital age.
          </p>
        </div>

        {/* Services Grid - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => <Card key={index} className="bg-card/60 backdrop-blur-sm border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 group animate-fade-in hover:scale-105 overflow-hidden" style={{
          animationDelay: `${index * 50}ms`
        }}>
              <CardHeader className="pb-4">
                <div className="mb-6 animate-scale-in" style={{
              animationDelay: `${index * 50 + 100}ms`
            }}>
                  <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center relative group-hover:shadow-[0_0_40px_hsl(var(--primary)/0.6)] transition-all duration-300">
                    <div className="absolute inset-0 rounded-3xl bg-primary blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="relative text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-card-foreground mb-4 group-hover:text-primary transition-colors duration-300">{service.title}</CardTitle>
                <p className="text-base leading-relaxed text-neutral-50">{service.description}</p>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => <li key={idx} className="flex items-start text-sm transition-colors duration-200 text-neutral-50">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 mt-1.5 group-hover:scale-150 transition-transform duration-300" />
                      {feature}
                    </li>)}
                </ul>
                <Button onClick={() => navigate('/book-consultation')} className="w-full">
                  Book Now
                </Button>
              </CardContent>
            </Card>)}
        </div>

        {/* Case Studies */}
        <CaseStudies />

        {/* CTA */}
        <div className="text-center">
          <Link to="/contact">
            <Button size="lg" className="bg-primary text-white border-0 hover:opacity-90 px-8 py-6 transition-all hover:scale-105 shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
              Schedule Your Free Consultation
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default ServicesSection;
