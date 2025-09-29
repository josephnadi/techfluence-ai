import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <Header />
      <main className="relative z-10 pt-24">
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
              📞 Get In Touch
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Ready to Transform</span><br />
              <span className="gradient-text">Your Business?</span>
            </h1>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mt-12">
              <Card className="p-6 bg-green-500/10 border-green-500/20">
                <Phone className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Phone</h3>
                <p>+233595521498</p>
              </Card>
              <Card className="p-6 bg-blue-500/10 border-blue-500/20">
                <Mail className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p>techfluence@gmail.com</p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;