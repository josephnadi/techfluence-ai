import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, TrendingUp, Calendar, ArrowRight } from "lucide-react";

const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-accent/5 to-primary/5">
          <div className="container mx-auto px-6 text-center">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
              → Community Hub
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Join Our Community</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Connect with IT professionals, share knowledge, and stay updated on the latest technology trends.
            </p>
            <Button size="lg" className="gradient-primary text-white">
              Join Discussion
            </Button>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <Card className="bg-card/50 backdrop-blur-md border border-border/50 text-center p-6">
                <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-md border border-border/50 text-center p-6">
                <MessageCircle className="w-8 h-8 mx-auto mb-3 text-accent" />
                <div className="text-2xl font-bold text-accent mb-1">1.2K</div>
                <div className="text-sm text-muted-foreground">Discussions</div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-md border border-border/50 text-center p-6">
                <TrendingUp className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold text-primary mb-1">95%</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-md border border-border/50 text-center p-6">
                <Calendar className="w-8 h-8 mx-auto mb-3 text-accent" />
                <div className="text-2xl font-bold text-accent mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </Card>
            </div>

            {/* Trending Discussions */}
            <Card className="bg-card/30 backdrop-blur-md border border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Trending Discussions</CardTitle>
                  <Button variant="outline">
                    View All Discussions
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-card/50 rounded-lg border border-border/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                      AJ
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">Cloud Migration Best Practices</h3>
                        <Badge variant="secondary" className="text-xs">Hot</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        Discussing the latest strategies for seamless cloud migration with zero downtime...
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground gap-4">
                        <span>By Alex Johnson</span>
                        <span>23 replies</span>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-card/50 rounded-lg border border-border/50">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent font-semibold">
                      SC
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">AI Automation Tools Comparison</h3>
                        <Badge variant="secondary" className="text-xs">Trending</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        Comparing different AI automation platforms and their integration capabilities...
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground gap-4">
                        <span>By Sarah Chen</span>
                        <span>15 replies</span>
                        <span>4 hours ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-card/50 rounded-lg border border-border/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                      ED
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">Cybersecurity Trends 2024</h3>
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        Latest cybersecurity threats and how to protect your infrastructure...
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground gap-4">
                        <span>By Emily Davis</span>
                        <span>31 replies</span>
                        <span>1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-card/30 backdrop-blur-md border border-border/50 p-6 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Expert Discussions</h3>
                <p className="text-muted-foreground text-sm">
                  Engage in meaningful conversations with industry experts and peers.
                </p>
              </Card>

              <Card className="bg-card/30 backdrop-blur-md border border-border/50 p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-accent" />
                <h3 className="text-lg font-semibold mb-2">Networking</h3>
                <p className="text-muted-foreground text-sm">
                  Build valuable connections with IT professionals worldwide.
                </p>
              </Card>

              <Card className="bg-card/30 backdrop-blur-md border border-border/50 p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                <p className="text-muted-foreground text-sm">
                  Keep up with the latest technology trends and innovations.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Community;