import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("newsletter-popup-seen");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    localStorage.setItem("newsletter-popup-seen", "true");
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });
    setIsOpen(false);
    setEmail("");
  };

  const handleClose = () => {
    localStorage.setItem("newsletter-popup-seen", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Stay Updated!</DialogTitle>
          <DialogDescription className="text-center">
            Subscribe to our newsletter for the latest tech insights, industry trends, and exclusive offers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Subscribe
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Maybe Later
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterPopup;
