import { Linkedin, Twitter, Phone, Mail } from "lucide-react";
import techfluenceLogo from "@/assets/techfluence-logo.png";
const Footer = () => {
  const services = ["Cloud Migration", "IT Support & Consulting", "AI Agent Automation", "Website Development", "Digital Marketing", "Brand Design", "Visibility Services"];
  const quickLinks = [{
    name: "Home",
    href: "/"
  }, {
    name: "Blog",
    href: "/blog"
  }, {
    name: "Contact",
    href: "/contact"
  }];
  return <footer id="contact" className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#2d1b4e] text-white overflow-hidden">
      {/* Subtle star pattern background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-1/4 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-40 right-1/3 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute bottom-32 left-1/2 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-60 right-1/4 w-1 h-1 bg-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10 bg-neutral-950">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={techfluenceLogo} alt="Techfluence" className="w-12 h-12" />
              <div>
                <h3 className="text-2xl font-bold text-white">Techfluence</h3>
                <p className="text-base text-gray-300">Leading IT Innovation</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-base">
              Transforming businesses through cutting-edge IT solutions, cloud migration, 
              and AI automation. Your trusted partner for digital transformation in the modern world.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/10">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/10">
                <Twitter className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-6">
            <h4 className="text-2xl font-bold text-white">Services</h4>
            <ul className="space-y-4">
              {services.map((service, index) => <li key={index} className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors cursor-pointer text-base">
                  <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                  {service}
                </li>)}
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-6">
            <h4 className="text-2xl font-bold text-white">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => <li key={index}>
                  <a href={link.href} className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors text-base">
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                    {link.name}
                  </a>
                </li>)}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h4 className="text-2xl font-bold text-white">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-green-500/30 hover:border-green-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">PHONE</p>
                  <p className="font-semibold text-white text-base">+233595521498</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">EMAIL</p>
                  <p className="font-semibold text-white text-base">techfluence@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Techfluence Connect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;