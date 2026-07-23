import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import techfluenceLogo from "@/assets/techfluence-logo.png";
import { useActiveSection } from "@/hooks/useActiveSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection = useActiveSection();
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").single().then(({
            data
          }) => {
            setIsAdmin(!!data);
          });
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").single().then(({
            data
          }) => {
            setIsAdmin(!!data);
          });
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleLogout = async () => {
    const {
      error
    } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to log out");
    } else {
      toast.success("Logged out successfully");
    }
  };
  const navigation = [{
    name: "Home",
    href: "/"
  }, {
    name: "Services",
    href: "/#services"
  }, {
    name: "About",
    href: "/#about"
  }, {
    name: "Blog",
    href: "/blog"
  }, {
    name: "Contact",
    href: "/contact"
  }];
  const handleNavClick = (href: string, e: React.MouseEvent) => {
    setIsMenuOpen(false);
    if (href === "/") {
      // Scroll to top for home
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else if (href.startsWith("/#")) {
      // Handle anchor links on home page
      e.preventDefault();

      if (location.pathname !== "/") {
        // Navigate client-side to the home page with the target hash; Index.tsx
        // scrolls to the matching section once it mounts (see its hash effect).
        navigate(href);
      } else {
        const element = document.getElementById(href.substring(2));
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    } else {
      // For other routes, scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }, 100);
    }
  };
  return <header className="fixed top-0 left-0 right-0 z-50 bg-card/60 backdrop-blur-2xl border-b border-border/40 shadow-xl">
      <nav className="container mx-auto px-8 py-5 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={techfluenceLogo} alt="TechFluenceAI" className="w-12 h-12 rounded-full ring-2 ring-primary/30" />
            <div>
              <div className="text-xl font-bold text-foreground">TechFluenceAI</div>
              <div className="text-xs text-muted-foreground -mt-1">IT Solutions & Consulting</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map(item => {
            let isActive = false;
            if (location.pathname !== "/") {
              // For non-home pages, check exact path match
              isActive = location.pathname === item.href;
            } else {
              // For home page, check active section
              if (item.href === "/") {
                isActive = activeSection === "home";
              } else if (item.href === "/#services") {
                isActive = activeSection === "services";
              } else if (item.href === "/#about") {
                isActive = activeSection === "about";
              }
            }
            return <Link key={item.name} to={item.href} onClick={e => handleNavClick(item.href, e)} className={`relative px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 ${isActive ? "text-primary nav-link-active" : "text-foreground/80 hover:text-primary hover:bg-white/5"}`}>
                  {item.name}
                </Link>;
          })}
          </div>

          {/* CTA Button & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? <>
                {isAdmin && <Link to="/admin">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <UserIcon className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>}
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </> : <Link to="/auth">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>}
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
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-nav-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            isMenuOpen ? "max-h-[32rem] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div className="py-4 border-t border-border/30 bg-card/50 backdrop-blur-xl rounded-lg mx-2 px-2">
            <div className="flex flex-col space-y-2">
              {navigation.map(item => {
            let isActive = false;
            if (location.pathname !== "/") {
              // For non-home pages, check exact path match
              isActive = location.pathname === item.href;
            } else {
              // For home page, check active section
              if (item.href === "/") {
                isActive = activeSection === "home";
              } else if (item.href === "/#services") {
                isActive = activeSection === "services";
              } else if (item.href === "/#about") {
                isActive = activeSection === "about";
              }
            }
            return <Link key={item.name} to={item.href} onClick={e => handleNavClick(item.href, e)} className={`relative px-4 py-2 text-base font-bold rounded-lg transition-all duration-300 ${isActive ? "text-primary nav-link-active" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                    {item.name}
                  </Link>;
          })}
              {user ? <>
                  {isAdmin && <Link to="/admin">
                      <Button variant="ghost" size="sm" className="gap-2 w-fit">
                        <UserIcon className="h-4 w-4" />
                        Admin
                      </Button>
                    </Link>}
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 w-fit">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </> : <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-2 w-fit">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>}
              <Link to="/contact">
                <Button className="gradient-primary text-white border-0 hover:opacity-90 w-fit">
                  Get Started ⚡
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>;
};
export default Header;