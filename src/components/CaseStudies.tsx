import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TrendingUp, Users, Clock } from 'lucide-react';
interface CaseStudy {
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    improvement: string;
    icon: React.ReactNode;
  }[];
}
const CaseStudies = () => {
  const [selectedStudy, setSelectedStudy] = useState<number | null>(null);
  const caseStudies: CaseStudy[] = [{
    company: "Global Retail Corp",
    industry: "E-Commerce",
    challenge: "Outdated legacy systems causing 40% downtime and losing $2M annually in sales",
    solution: "Implemented cloud-based infrastructure with AI-driven inventory management and real-time analytics",
    results: [{
      metric: "Revenue Growth",
      improvement: "+185%",
      icon: <TrendingUp className="w-5 h-5" />
    }, {
      metric: "System Uptime",
      improvement: "99.9%",
      icon: <Clock className="w-5 h-5" />
    }, {
      metric: "Customer Satisfaction",
      improvement: "+92%",
      icon: <Users className="w-5 h-5" />
    }]
  }, {
    company: "FinTech Solutions Inc",
    industry: "Financial Services",
    challenge: "Security vulnerabilities and compliance issues risking regulatory penalties",
    solution: "Deployed enterprise-grade cybersecurity framework with 24/7 monitoring and automated compliance reporting",
    results: [{
      metric: "Security Incidents",
      improvement: "-100%",
      icon: <TrendingUp className="w-5 h-5" />
    }, {
      metric: "Compliance Score",
      improvement: "100%",
      icon: <Clock className="w-5 h-5" />
    }, {
      metric: "Cost Savings",
      improvement: "$3.5M/year",
      icon: <Users className="w-5 h-5" />
    }]
  }, {
    company: "HealthCare Plus",
    industry: "Healthcare",
    challenge: "Inefficient patient data management leading to delayed treatments and errors",
    solution: "Integrated AI-powered healthcare management system with blockchain-secured patient records",
    results: [{
      metric: "Processing Speed",
      improvement: "+320%",
      icon: <TrendingUp className="w-5 h-5" />
    }, {
      metric: "Medical Errors",
      improvement: "-95%",
      icon: <Clock className="w-5 h-5" />
    }, {
      metric: "Patient Satisfaction",
      improvement: "+88%",
      icon: <Users className="w-5 h-5" />
    }]
  }];
  return <div className="mt-16">
      <div className="text-center mb-12">
        <Badge className="mb-4 px-4 py-2 text-sm font-semibold bg-primary/10 text-primary border-primary/20">
          Success Stories
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Transformative Results
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Real businesses, real impact. See how we've revolutionized operations for leading organizations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {caseStudies.map((study, index) => <Card key={index} className="group hover:scale-105 transition-all duration-300 cursor-pointer bg-card/60 backdrop-blur-sm border-primary/20 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 animate-fade-in" style={{
        animationDelay: `${index * 150}ms`
      }} onClick={() => setSelectedStudy(selectedStudy === index ? null : index)}>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {study.company}
                </CardTitle>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                  {study.industry}
                </Badge>
              </div>
              <CardDescription className="text-base text-zinc-50 font-thin">
                {study.challenge}
              </CardDescription>
            </CardHeader>

            {selectedStudy === index && <CardContent className="space-y-4 animate-fade-in">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h4 className="font-semibold mb-2 text-primary">Solution Delivered</h4>
                  <p className="text-sm text-muted-foreground">{study.solution}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Key Results</h4>
                  {study.results.map((result, idx) => <div key={idx} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg border border-accent/10 hover:bg-accent/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="text-accent">{result.icon}</div>
                        <span className="text-sm font-medium">{result.metric}</span>
                      </div>
                      <span className="text-lg font-bold text-accent">{result.improvement}</span>
                    </div>)}
                </div>
              </CardContent>}

            <div className="px-6 pb-6">
              <Button variant="ghost" className="w-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {selectedStudy === index ? 'Show Less' : 'View Full Case Study'}
              </Button>
            </div>
          </Card>)}
      </div>
    </div>;
};
export default CaseStudies;