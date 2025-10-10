import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookOpen, Video, FileText, Download, ExternalLink, Brain } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Community = () => {
  const learningMaterials = {
    videos: [
      { title: "IT Consulting Fundamentals", duration: "45 min", link: "#" },
      { title: "Cloud Architecture Masterclass", duration: "1h 20min", link: "#" },
      { title: "AI in Governance & Decision Making", duration: "55 min", link: "#" },
      { title: "Cybersecurity Best Practices", duration: "40 min", link: "#" },
    ],
    documents: [
      { title: "Complete IT Strategy Guide", pages: "120 pages", format: "PDF", link: "#" },
      { title: "Digital Transformation Playbook", pages: "85 pages", format: "PDF", link: "#" },
      { title: "AI Implementation Framework", pages: "95 pages", format: "PDF", link: "#" },
      { title: "Network Security Handbook", pages: "150 pages", format: "PDF", link: "#" },
    ],
    links: [
      { title: "Industry Best Practices Database", description: "Curated resources from top IT firms", link: "#" },
      { title: "Tech Stack Decision Tools", description: "Interactive guides for technology selection", link: "#" },
      { title: "AI Governance Templates", description: "Ready-to-use policy templates", link: "#" },
      { title: "Case Studies Library", description: "Real-world implementation examples", link: "#" },
    ]
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div id="top"></div>
      <Header />
      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 mb-4">
              📚 Free Educational Resources
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">Study for Free</span><br />
              <span className="gradient-text">Master IT & AI Governance</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Access comprehensive learning materials covering all our services - from IT consulting to AI governance. Everything you need to excel in modern technology.
            </p>
          </div>
        </section>

        {/* Video Tutorials Section */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <Video className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Video Tutorials</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {learningMaterials.videos.map((video, index) => (
                <Card key={index} className="p-6 hover:border-primary transition-all cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                      <p className="text-muted-foreground text-sm">{video.duration}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-accent" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Documents & Files Section */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="w-8 h-8 text-accent" />
              <h2 className="text-3xl font-bold">Documents & Guides</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {learningMaterials.documents.map((doc, index) => (
                <Card key={index} className="p-6 hover:border-accent transition-all cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{doc.title}</h3>
                      <div className="flex gap-4 text-muted-foreground text-sm">
                        <span>{doc.pages}</span>
                        <span>•</span>
                        <span>{doc.format}</span>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-primary" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* External Resources Section */}
        <section className="py-12 pb-24">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Curated Resources & Links</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {learningMaterials.links.map((resource, index) => (
                <Card key={index} className="p-6 hover:border-primary transition-all cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                      <p className="text-muted-foreground text-sm">{resource.description}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-accent" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI in Governance Highlight */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-6 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-accent" />
            <h2 className="text-3xl font-bold mb-4">
              <span className="gradient-text">AI in Governance</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dive deep into how artificial intelligence is transforming governance, decision-making, and organizational leadership. Our comprehensive materials cover implementation strategies, ethical considerations, and practical applications.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Community;