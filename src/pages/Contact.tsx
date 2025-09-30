import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, Clock, Headphones, Zap, Shield, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <Header />
      <main className="relative z-10 pt-24">
        <section className="py-16">
          <div className="container mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Contact Us</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Get in touch with our IT experts. We're here to help transform your business.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
              <Card className="p-6 bg-card/30 backdrop-blur-md border border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in" style={{animationDelay: '100ms'}}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-center mb-2">Call Directly</h3>
                <a href="tel:+233595521498" className="text-primary hover:underline block text-center mb-1">+233595521498</a>
                <p className="text-sm text-muted-foreground text-center">Available 24/7 for emergencies</p>
              </Card>
              
              <Card className="p-6 bg-card/30 backdrop-blur-md border border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in" style={{animationDelay: '200ms'}}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-center mb-2">Send Email</h3>
                <a href="mailto:techfluence@gmail.com" className="text-primary hover:underline block text-center mb-1">techfluence@gmail.com</a>
                <p className="text-sm text-muted-foreground text-center">Response within 24 hours</p>
              </Card>

              <Card className="p-6 bg-card/30 backdrop-blur-md border border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in" style={{animationDelay: '300ms'}}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Headphones className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-center mb-2">Book Consultation</h3>
                <p className="text-primary text-center mb-1">Free 30-min Call</p>
                <p className="text-sm text-muted-foreground text-center">Schedule at your convenience</p>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid md:grid-cols-5 gap-8 max-w-6xl mx-auto">
              {/* Left Sidebar - Contact Info */}
              <div className="md:col-span-2 space-y-6">
                <Card className="p-6 bg-card/30 backdrop-blur-md border border-border/50 animate-fade-in" style={{animationDelay: '400ms'}}>
                  <Phone className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-sm text-muted-foreground mb-2">Direct Line</p>
                  <p className="font-medium mb-2">+233595521498</p>
                  <p className="text-xs text-muted-foreground">Available 24/7 for emergencies</p>
                </Card>

                <Card className="p-6 bg-card/30 backdrop-blur-md border border-border/50 animate-fade-in" style={{animationDelay: '500ms'}}>
                  <Mail className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-2">General Inquiries</p>
                  <p className="font-medium mb-2">techfluence@gmail.com</p>
                  <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                </Card>

                <Card className="p-6 bg-card/30 backdrop-blur-md border border-border/50 animate-fade-in" style={{animationDelay: '600ms'}}>
                  <Clock className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-muted-foreground">Sunday: Emergency Support Only</p>
                  </div>
                </Card>
              </div>

              {/* Right Side - Contact Form */}
              <Card className="md:col-span-3 p-8 bg-card/30 backdrop-blur-md border border-border/50 animate-fade-in" style={{animationDelay: '700ms'}}>
                <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input placeholder="Your full name" className="bg-background/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <Input type="email" placeholder="your.email@company.com" className="bg-background/50" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input placeholder="+233 XX XXX XXXX" className="bg-background/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company Name</label>
                      <Input placeholder="Your company name" className="bg-background/50" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Inquiry Type</label>
                      <Select>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="cloud">Cloud Migration</SelectItem>
                          <SelectItem value="support">IT Support & Consulting</SelectItem>
                          <SelectItem value="ai">AI Agent Automation</SelectItem>
                          <SelectItem value="web">Website Development</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Priority Level</label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <Textarea 
                      placeholder="Tell us about your project requirements, current challenges, or how we can help you..." 
                      className="min-h-[150px] bg-background/50"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full gradient-primary text-white border-0 hover:opacity-90"
                  >
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>

            {/* Why Choose Section */}
            <div className="mt-16 max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                <span className="gradient-text">Why Choose Techfluence?</span>
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="p-6 bg-card/30 backdrop-blur-md border border-border/50 text-center animate-fade-in" style={{animationDelay: '800ms'}}>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Rapid Response</h3>
                  <p className="text-sm text-muted-foreground">We respond to all inquiries within 24 hours, often much sooner.</p>
                </Card>

                <Card className="p-6 bg-card/30 backdrop-blur-md border border-border/50 text-center animate-fade-in" style={{animationDelay: '900ms'}}>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Expert Consultation</h3>
                  <p className="text-sm text-muted-foreground">Free initial consultation with our certified IT professionals.</p>
                </Card>

                <Card className="p-6 bg-card/30 backdrop-blur-md border border-border/50 text-center animate-fade-in" style={{animationDelay: '1000ms'}}>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Custom Solutions</h3>
                  <p className="text-sm text-muted-foreground">Tailored IT solutions designed specifically for your business needs.</p>
                </Card>

                <Card className="p-6 bg-card/30 backdrop-blur-md border border-border/50 text-center animate-fade-in" style={{animationDelay: '1100ms'}}>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Headphones className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">Round-the-clock support for critical business operations.</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;