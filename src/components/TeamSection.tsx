import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import nadiJosephImg from "@/assets/nadi-joseph.png"; // Add this import

const TeamSection = () => {
  const {
    ref,
    isVisible
  } = useScrollAnimation();
  const team = [{
    name: "Sarah Chen",
    role: "CTO",
    description: "Technical expert in cloud architecture and AI automation. AWS & Azure certified with expertise in scalable infrastructure design.",
    skills: ["Cloud Architecture", "AI/ML", "DevOps"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=75"
  }, {
    name: "Michael Roberts",
    role: "Head of Marketing & Strategy",
    description: "Growth strategist and marketing expert. Specializes in tech company scaling and digital marketing strategies for B2B enterprises.",
    skills: ["Growth Strategy", "B2B Marketing", "Brand Development"],
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=75"
  }, {
    name: "Nadi Joseph",
    role: "CEO & Co Founder",
    description: "Visionary leader with 4+ years in enterprise IT solutions. Former Microsoft consultant specializing in digital transformation.",
    skills: ["Strategic Planning", "Digital Transformation", "Enterprise Architecture"],
    image: nadiJosephImg
  }, {
    name: "Emily Davis",
    role: "Lead Solutions Architect",
    description: "Solutions architect with deep expertise in automation and workflow optimization. Specialized in n8n and enterprise integrations.",
    skills: ["Solution Architecture", "Automation", "System Integration"],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=75"
  }];
  const teamStats = [{
    value: "25+",
    label: "Combined Certifications."
  }, {
    value: "15+",
    label: "Years Combined Experience"
  }, {
    value: "100%",
    label: "Client Success Rate"
  }];
  return <section id="team" className="py-16 relative" ref={ref}>
      <div className={`container mx-auto px-6 transition-all duration-1000 ${isVisible ? 'scroll-fade-in' : 'opacity-0'}`}>
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
            Meet Our Expert Team
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Industry</span><br />
            <span className="gradient-text">Experts</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-muted-foreground">
            Our team of certified professionals brings decades of combined experience in 
            enterprise IT solutions, cloud architecture, and digital transformation.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {team.map((member, index) => <Card key={index} className="bg-card border border-border overflow-hidden group hover:border-primary/50 hover:shadow-xl transition-all duration-500 animate-fade-in hover:scale-105 hover:-translate-y-2" style={{
          animationDelay: `${index * 100}ms`
        }}>
              <div className="flex justify-center pt-6 pb-3">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-all duration-500">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold mb-1">{member.name}</h3>
                <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                <p className="text-xs mb-3 text-muted-foreground">{member.description}</p>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, idx) => <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>)}
                </div>
              </div>
            </Card>)}
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {teamStats.map((stat, index) => <div key={index}>
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default TeamSection;
