import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, Building } from "lucide-react";
import { format } from "date-fns";
import { useRecaptcha } from "@/hooks/useRecaptcha";

// Available time slots (20-minute intervals, 10 slots per day)
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00",
  "13:00", "13:30", "14:00", "14:30", "15:00"
];

const BookConsultation = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    website: "", // Honeypot field for bot detection
  });
  const { executeRecaptcha } = useRecaptcha();

  // Fetch booked slots for selected date
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) return;

      const { data, error } = await supabase
        .from("consultations")
        .select("consultation_time")
        .eq("consultation_date", format(selectedDate, "yyyy-MM-dd"))
        .eq("status", "scheduled");

      if (error) {
        console.error("Error fetching booked slots:", error);
        return;
      }

      const booked = data.map((slot) => slot.consultation_time.substring(0, 5));
      setBookedSlots(booked);
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }

    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Execute reCAPTCHA
      const recaptchaToken = await executeRecaptcha("booking_form");
      if (!recaptchaToken) {
        throw new Error("reCAPTCHA verification failed");
      }

      const { data, error } = await supabase.functions.invoke("book-consultation", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          consultation_date: format(selectedDate, "yyyy-MM-dd"),
          consultation_time: selectedTime,
          message: formData.message,
          website: formData.website,
          recaptchaToken,
        },
      });

      if (error) throw error;

      toast.success("Consultation booked successfully! Check your email for confirmation.");
      
      // Reset form
      setFormData({ name: "", email: "", phone: "", company: "", message: "", website: "" });
      setSelectedDate(undefined);
      setSelectedTime("");
      
      setTimeout(() => navigate("/contact"), 2000);
    } catch (error: any) {
      console.error("Error booking consultation:", error);
      toast.error(error.message || "Failed to book consultation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSlots = TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Book Free AI Consultation | Generative AI Expert Ghana"
        description="Schedule a free consultation with Ghana's leading AI experts. Discuss generative AI, custom software, and digital transformation strategies."
        canonical="https://techfluence-ai.lovable.app/book-consultation"
        keywords="AI consultation Ghana, free tech consultation, generative AI expert, IT strategy meeting"
      />
      <Header />
      
      <main className="flex-1 pt-20 pb-16 bg-gradient-to-b from-background to-accent/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Book a Consultation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Schedule a 20-minute consultation with our experts. Choose your preferred date and time slot.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calendar and Time Selection */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date & Time
                </CardTitle>
                <CardDescription>
                  Choose an available date and time slot for your consultation
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    className="rounded-md border"
                  />
                </div>

                {selectedDate && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-5 w-5" />
                      <h3 className="font-semibold">Available Time Slots</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableSlots.length > 0 ? (
                        availableSlots.map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedTime === slot ? "default" : "outline"}
                            onClick={() => setSelectedTime(slot)}
                            className="w-full"
                          >
                            {slot}
                          </Button>
                        ))
                      ) : (
                        <p className="col-span-full text-center text-muted-foreground py-4">
                          No available slots for this date
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information Form */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Information
                </CardTitle>
                <CardDescription>
                  Fill in your details to complete the booking
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email *
                    </label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Company
                    </label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Message (Optional)
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you'd like to discuss..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Honeypot field for bot detection - hidden from users */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !selectedDate || !selectedTime}
                  >
                    {isSubmitting ? "Booking..." : "Book Consultation"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookConsultation;