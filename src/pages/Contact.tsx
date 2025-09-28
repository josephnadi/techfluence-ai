import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Clock, CheckCircle, Users, Lightbulb, Shield } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Contact Us</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get in touch with our IT experts. We're here to help transform your business.
            </p>
          </div>
        </section>

        {/* Quick Contact Cards */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-card/50 backdrop-blur-md border border-border/50 text-center p-6 hover:border-primary/30 transition-colors group">
                <Phone className="w-8 h-8 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">Call Directly</h3>
                <p className="text-muted-foreground mb-4">+233595521498<br />Available 24/7 for emergencies</p>
                <Button asChild variant="outline" className="w-full">
                  <a href="tel:+233595521498">Call Now</a>
                </Button>
              </Card>

              <Card className="bg-card/50 backdrop-blur-md border border-border/50 text-center p-6 hover:border-accent/30 transition-colors group">
                <Mail className="w-8 h-8 mx-auto mb-4 text-accent group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">Send Email</h3>
                <p className="text-muted-foreground mb-4">techfluence@gmail.com<br />Response within 24 hours</p>
                <Button asChild variant="outline" className="w-full">
                  <a href="mailto:techfluence@gmail.com">Send Email</a>
                </Button>
              </Card>

              <Card className="bg-card/50 backdrop-blur-md border border-border/50 text-center p-6 hover:border-primary/30 transition-colors group">
                <Clock className="w-8 h-8 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">Book Consultation</h3>
                <p className="text-muted-foreground mb-4">Free 30-min Call<br />Schedule at your convenience</p>
                <Button className="gradient-primary text-white w-full">
                  Book Call
                </Button>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="bg-card/30 backdrop-blur-md border border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name *</label>
                      <Input placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email Address *</label>
                      <Input type="email" placeholder="your@email.com" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number</label>
                      <Input placeholder="+1 (555) 123-4567" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Company Name</label>
                      <Input placeholder="Your company" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Inquiry Type</label>
                      <Select>
                        <SelectTrigger>
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
                      <label className="text-sm font-medium mb-2 block">Priority Level</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Medium Priority" />
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
                    <label className="text-sm font-medium mb-2 block">Message *</label>
                    <Textarea placeholder="Tell us about your project or requirements..." rows={5} />
                  </div>

                  <Button className="gradient-primary text-white w-full" size="lg">
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Info & Why Choose Us */}
              <div className="space-y-8">
                {/* Contact Details */}
                <Card className="bg-card/30 backdrop-blur-md border border-border/50 p-6">
                  <h3 className="text-xl font-bold mb-6">Contact Details</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Call Us</h4>
                      <p className="text-muted-foreground">Direct Line</p>
                      <p className="font-medium">+233595521498</p>
                      <p className="text-sm text-muted-foreground">Available 24/7 for emergencies</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Email Us</h4>
                      <p className="text-muted-foreground">General Inquiries</p>
                      <p className="font-medium">techfluence@gmail.com</p>
                      <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Business Hours</h4>
                      <div className="text-sm space-y-1">
                        <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                        <p>Saturday: 10:00 AM - 4:00 PM</p>
                        <p>Sunday: Emergency Support Only</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Why Choose Techfluence */}
                <Card className="bg-card/30 backdrop-blur-md border border-border/50 p-6">
                  <h3 className="text-xl font-bold mb-6">Why Choose Techfluence?</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Rapid Response</h4>
                        <p className="text-sm text-muted-foreground">We respond to all inquiries within 24 hours, often much sooner.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Expert Consultation</h4>
                        <p className="text-sm text-muted-foreground">Free initial consultation with our certified IT professionals.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Custom Solutions</h4>
                        <p className="text-sm text-muted-foreground">Tailored IT solutions designed specifically for your business needs.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">24/7 Support</h4>
                        <p className="text-sm text-muted-foreground">Round-the-clock support for critical business operations.</p>
                      </div>
                    </div>
                  </div>
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