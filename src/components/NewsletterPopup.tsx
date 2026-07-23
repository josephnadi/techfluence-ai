import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasSubscribed = localStorage.getItem("newsletter-subscribed");
    if (!hasSubscribed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000); // 3 seconds after page load
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;

    setSubmitting(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setSubmitting(false);

    // Unique-constraint violation just means they're already subscribed — treat as success.
    if (error && error.code !== "23505") {
      toast({
        title: "Something went wrong",
        description: "Couldn't subscribe right now — please try again.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("newsletter-subscribed", "true");
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });
    setIsOpen(false);
    setEmail("");
  };

  const handleClose = () => {
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
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? "Subscribing..." : "Subscribe"}
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
