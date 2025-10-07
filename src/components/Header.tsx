import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import techfluenceLogo from "@/assets/techfluence-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/#services" },
    { name: "About", href: "/#about" },
    { name: "Community", href: "/community" },
    { name: "Contact", href: "/contact" }
  ];

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    setIsMenuOpen(false);
    
    if (href === "/") {
      // Scroll to top for home
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href.startsWith("/#")) {
      // Handle anchor links on home page
      e.preventDefault();
      
      // If not on home page, navigate there first
      if (location.pathname !== "/") {
        window.location.href = href;
      } else {
        const element = document.getElementById(href.substring(2));
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } else {
      // For other routes, scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={techfluenceLogo} 
              alt="Techfluence Connect" 
              className="w-10 h-10"
            />
            <div>
              <div className="text-xl font-bold text-foreground">Techfluence</div>
              <div className="text-xs text-muted-foreground -mt-1">IT Solutions & Consulting</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={(e) => handleNavClick(item.href, e)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href || 
                  (item.href === "/" && location.pathname === "/") ||
                  (item.href.startsWith("/#") && location.pathname === "/")
                    ? "text-primary" 
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/contact">
              <Button className="gradient-primary text-white border-0 hover:opacity-90">
                Get Started ⚡
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border/50">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === item.href || 
                    (item.href === "/" && location.pathname === "/") ||
                    (item.href.startsWith("/#") && location.pathname === "/")
                      ? "text-primary" 
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/contact">
                <Button className="gradient-primary text-white border-0 hover:opacity-90 w-fit">
                  Get Started ⚡
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;