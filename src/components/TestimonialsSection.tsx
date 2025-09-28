import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Techfluence completely transformed our outdated infrastructure into a scalable cloud solution. Their expertise and proactive support have been a game-changer for our business. We've seen a 60% increase in efficiency!",
      name: "Johnathan Lee",
      role: "CEO, Innovate Inc.",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      quote: "The AI automation agents built by Techfluence have saved us thousands of hours in manual work. The team was incredibly professional, and the results exceeded all our expectations. Highly recommended for any business looking to innovate.",
      name: "Jessica Miller",
      role: "COO, QuantumLeap",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      quote: "Working with Techfluence on our new website was a fantastic experience. They delivered a high-performance, visually stunning site on time and on budget. Our conversion rates have doubled since the launch.",
      name: "David Chen",
      role: "Marketing Director, Fusion Co.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      quote: "The 24/7 IT support from Techfluence is second to none. They are always responsive, knowledgeable, and resolve issues before they can impact our operations. We finally have peace of mind with our IT systems.",
      name: "Linda Rodriguez", 
      role: "Founder, Bright-Path",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 mb-4">
            Client Success Stories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Trusted by</span><br />
            <span className="gradient-text">Industry Leaders</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            See how we've helped businesses like yours achieve their technology goals and drive growth.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/30 backdrop-blur-md border border-border/50 p-6 group hover:border-primary/30 transition-all duration-300">
              <Quote className="w-8 h-8 text-primary/50 mb-4" />
              <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;