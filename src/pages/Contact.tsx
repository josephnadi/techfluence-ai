import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, Clock, Headphones, Zap, Shield, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "",
    priority: "medium",
    message: "",
    website: "" // Honeypot field for bot detection
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you soon.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        inquiryType: "",
        priority: "medium",
        message: "",
        website: ""
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <SEO 
        title="Contact Us - AI Solutions & Tech Consulting Ghana"
        description="Get in touch with Ghana's leading AI solutions provider. Free consultation for generative AI, digital transformation, and IT strategy projects."
        canonical="https://techfluence-ai.lovable.app/contact"
        keywords="contact AI consultant Ghana, tech consulting inquiry, IT solutions support, AI consultation booking"
      />
      {/* Place this as the first element in your <body> */}
      <div id="top"></div>
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
              {/* Left Column - Contact Methods */}
              <div className="lg:col-span-1 space-y-4">
                {/* 1. Call Directly */}
                <a href="tel:+233595521498" className="block group">
                  <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 animate-fade-in" style={{animationDelay: '100ms'}}>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-lg shadow-green-500/30">
                      <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-center mb-2 text-base sm:text-lg">Call Directly</h3>
                    <p className="text-primary hover:underline block text-center mb-1 font-medium text-sm sm:text-base">+233595521498</p>
                    <p className="text-xs sm:text-sm text-muted-foreground text-center">Available 24/7 for emergencies</p>
                  </Card>
                </a>

                {/* 2. Send Email */}
                <a href="mailto:techfluence.ai@outlook.com" className="block group">
                  <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 animate-fade-in" style={{animationDelay: '200ms'}}>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-lg shadow-blue-500/30">
                      <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-center mb-2 text-base sm:text-lg">Send Email</h3>
                    <p className="text-primary hover:underline block text-center mb-1 font-medium break-all text-xs sm:text-base">techfluence.ai@outlook.com</p>
                    <p className="text-xs sm:text-sm text-muted-foreground text-center">Response within 24 hours</p>
                  </Card>
                </a>

                {/* 3. Book Consultation */}
                <a href="/book-consultation" className="block group">
                  <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/10 to-purple-500/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 animate-fade-in cursor-pointer" style={{animationDelay: '300ms'}}>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-lg shadow-primary/30">
                      <Headphones className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-center mb-2 text-base sm:text-lg">Book Consultation</h3>
                    <p className="text-primary text-center mb-1 font-medium text-sm sm:text-base">Free 20-min Call</p>
                    <p className="text-xs sm:text-sm text-muted-foreground text-center">Schedule at your convenience</p>
                  </Card>
                </a>

                {/* 4. Business Hours */}
                <Card className="p-4 sm:p-6 bg-muted/50 border border-border/50 animate-fade-in" style={{animationDelay: '400ms'}}>
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary mb-2 sm:mb-3" />
                  <h3 className="font-semibold mb-2 text-base sm:text-lg">Business Hours</h3>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-muted-foreground">Sunday: Emergency Support Only</p>
                  </div>
                </Card>
              </div>

              {/* Right Column - Contact Form */}
              <div className="lg:col-span-2">
                <Card className="p-4 sm:p-6 lg:p-8 bg-muted/50 border border-border/50 animate-fade-in" style={{animationDelay: '500ms'}}>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2">Full Name *</label>
                        <Input 
                          placeholder="Your full name" 
                          className="bg-background/50"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2">Email Address *</label>
                        <Input 
                          type="email" 
                          placeholder="your.email@company.com" 
                          className="bg-background/50"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2">Phone Number</label>
                        <Input 
                          placeholder="+233 XX XXX XXXX" 
                          className="bg-background/50"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2">Company Name</label>
                        <Input 
                          placeholder="Your company name" 
                          className="bg-background/50"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2">Inquiry Type</label>
                        <Select value={formData.inquiryType} onValueChange={(value) => setFormData({...formData, inquiryType: value})}>
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
                        <label className="block text-xs sm:text-sm font-medium mb-2">Priority Level</label>
                        <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
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
                      <label className="block text-xs sm:text-sm font-medium mb-2">Message *</label>
                      <Textarea 
                        placeholder="Tell us about your project requirements, current challenges, or how we can help you..." 
                        className="min-h-[100px] sm:min-h-[120px] bg-background/50"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                      />
                    </div>

                    {/* Honeypot field for bot detection - hidden from users */}
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />

                    <Button
                      type="submit" 
                      size="lg" 
                      className="w-full gradient-primary text-white border-0 hover:opacity-90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Why Choose Us Cards */}
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Rapid Response */}
                <Card className="p-4 sm:p-6 bg-muted/50 border border-border/50 text-center animate-fade-in hover:border-primary/30 transition-all duration-300 flex flex-col items-center justify-center" style={{animationDelay: '800ms'}}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-lg shadow-primary/30">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-base sm:text-lg">Rapid Response</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">We respond to all inquiries within 24 hours, often much sooner.</p>
                </Card>

                {/* Expert Consultation */}
                <Card className="p-4 sm:p-6 bg-muted/50 border border-border/50 text-center animate-fade-in hover:border-primary/30 transition-all duration-300 flex flex-col items-center justify-center" style={{animationDelay: '900ms'}}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-lg shadow-primary/30">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-base sm:text-lg">Expert Consultation</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Free initial consultation with our certified IT professionals.</p>
                </Card>

                {/* 24/7 Support */}
                <Card className="p-4 sm:p-6 bg-muted/50 border border-border/50 text-center animate-fade-in hover:border-primary/30 transition-all duration-300 flex flex-col items-center justify-center sm:col-span-2 lg:col-span-1" style={{animationDelay: '1000ms'}}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-lg shadow-primary/30">
                    <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-base sm:text-lg">24/7 Support</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Round-the-clock support for critical operations.</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300"
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <script>
        {`
          document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
              // Only scroll to top for internal navigation
              if (this.getAttribute('href') === '#' || this.getAttribute('href') === '#top') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            });
          });
        `}
      </script>
    </div>
  );
};

export default Contact;