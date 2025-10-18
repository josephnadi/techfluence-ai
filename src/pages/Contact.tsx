import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, Clock, Headphones } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";

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
    source: "techfluence-website", // hidden field for tracking
  });
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://tyesha-unharped-unpersuasively.ngrok-free.dev/webhook-test/contact-form",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to send form data");

      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        inquiryType: "",
        priority: "medium",
        message: "",
        source: "techfluence-website",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <SEO
        title="Contact Us - TechFluence Ghana"
        description="Reach out to TechFluence for web development, AI automation, or IT strategy projects. Let's create something great together!"
        canonical="https://techfluence-ai.lovable.app/contact"
        keywords="contact techfluence ghana, web development inquiry, ai automation contact, it solutions"
      />
      <Header />
      <main className="relative z-10 pt-24">
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Contact Us</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Let's talk about your next digital transformation project.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-4">
                <a href="tel:+14782495284">
                  <Card className="p-6 border-green-500/20 hover:border-green-500/40 transition">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-1">Call Us</h3>
                      <p className="text-primary font-medium">+14782495284</p>
                      <p className="text-sm text-muted-foreground">Available 24/7</p>
                    </div>
                  </Card>
                </a>

                <a href="mailto:techfluence.ai@outlook.com">
                  <Card className="p-6 border-blue-500/20 hover:border-blue-500/40 transition">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-1">Email Us</h3>
                      <p className="text-primary font-medium break-all">techfluence.ai@outlook.com</p>
                      <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                    </div>
                  </Card>
                </a>

                <Card className="p-6 border-border/40">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-sm text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-sm text-muted-foreground">Sat: 10:00 AM - 4:00 PM</p>
                  </div>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="p-8 border-border/40">
                  <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Full Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      <Input
                        placeholder="Company Name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Select
                        value={formData.inquiryType}
                        onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Inquiry Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="web">Web Development</SelectItem>
                          <SelectItem value="ai">AI Automation</SelectItem>
                          <SelectItem value="support">IT Support</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Priority Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Textarea
                      placeholder="Your Message *"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gradient-primary text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
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
