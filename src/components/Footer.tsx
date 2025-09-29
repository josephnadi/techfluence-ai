import { Badge } from "@/components/ui/badge";
import { Linkedin, Twitter, Phone, Mail } from "lucide-react";
import techfluenceLogo from "@/assets/techfluence-logo.png";

const Footer = () => {
  const services = [
    "Cloud Migration",
    "IT Support & Consulting", 
    "AI Agent Automation",
    "Website Development"
  ];

  return (
    <footer id="contact" className="bg-gradient-to-b from-background to-card/50 border-t border-border/50">
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={techfluenceLogo} alt="Techfluence" className="w-10 h-10" />
              <div>
                <h3 className="text-xl font-bold">Techfluence</h3>
                <p className="text-sm text-muted-foreground">Leading IT Innovation</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Transforming businesses through cutting-edge IT solutions, cloud migration, 
              and AI automation. Your trusted partner for digital transformation in the modern world.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-card/50 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-card/50 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PHONE</p>
                  <p className="font-semibold">+233595521498</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">EMAIL</p>
                  <p className="font-semibold">techfluence@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/50 mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Techfluence Connect. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Powered by{" "}
            <a 
              href="https://base44.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              base44.app
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;