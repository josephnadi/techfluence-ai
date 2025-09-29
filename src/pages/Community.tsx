import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Community = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <Header />
      <main className="relative z-10 pt-24">
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 mb-4">
              🚀 Join the Community
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">Welcome to the</span><br />
              <span className="gradient-text">Techfluence Community</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Join thousands of IT professionals sharing knowledge and growing together.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white">
              <Users className="mr-2 w-4 h-4" />
              Join Community (Free)
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Community;