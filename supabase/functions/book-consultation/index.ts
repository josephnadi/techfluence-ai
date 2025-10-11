import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation schema
const BookingSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().regex(/^\+?[0-9\s\-()]{10,20}$/, "Invalid phone number format").optional(),
  company: z.string().trim().max(100, "Company name must be less than 100 characters").optional(),
  consultation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  consultation_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  message: z.string().trim().max(1000, "Message must be less than 1000 characters").optional()
});

// Helper to mask sensitive data in logs
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local.substring(0, 2)}***@${domain}`;
}

function maskPhone(phone?: string): string {
  return phone ? `***${phone.slice(-4)}` : '';
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const rawBooking = await req.json();
    
    // Validate input
    const validation = BookingSchema.safeParse(rawBooking);
    if (!validation.success) {
      console.error("Validation failed:", validation.error.errors);
      return new Response(
        JSON.stringify({ error: "Invalid input data", details: validation.error.errors }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const booking = validation.data;
    
    // Log without PII
    console.log("Processing booking:", {
      email: maskEmail(booking.email),
      phone: maskPhone(booking.phone),
      date: booking.consultation_date,
      time: booking.consultation_time
    });
    
    // Validate date is in future
    const bookingDate = new Date(booking.consultation_date);
    if (bookingDate <= new Date()) {
      return new Response(
        JSON.stringify({ error: "Cannot book consultations in the past" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Validate time slot
    const validTimes = ["09:00", "09:30", "10:00", "10:30", "11:00", "13:00", "13:30", "14:00", "14:30", "15:00"];
    if (!validTimes.includes(booking.consultation_time)) {
      return new Response(
        JSON.stringify({ error: "Invalid consultation time slot" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if slot is still available
    const { data: existingBookings, error: checkError } = await supabase
      .from("consultations")
      .select("id")
      .eq("consultation_date", booking.consultation_date)
      .eq("consultation_time", booking.consultation_time)
      .eq("status", "scheduled");

    if (checkError) {
      console.error("Error checking availability:", checkError);
      throw new Error("Failed to check availability");
    }

    if (existingBookings && existingBookings.length > 0) {
      return new Response(
        JSON.stringify({ error: "This time slot is no longer available" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create consultation booking
    const { data: consultation, error: insertError } = await supabase
      .from("consultations")
      .insert({
        user_name: booking.name,
        user_email: booking.email,
        user_phone: booking.phone,
        company: booking.company,
        consultation_date: booking.consultation_date,
        consultation_time: booking.consultation_time,
        message: booking.message,
        status: "scheduled",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating booking:", insertError);
      throw new Error("Failed to create booking");
    }

    console.log("Booking created successfully:", {
      id: consultation.id,
      date: booking.consultation_date,
      time: booking.consultation_time
    });

    // Format date and time for emails
    const formattedDate = new Date(booking.consultation_date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Create calendar event (.ics file content)
    const calendarEvent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TechFluence//Consultation//EN
BEGIN:VEVENT
UID:${consultation.id}@techfluence.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${booking.consultation_date.replace(/-/g, "")}T${booking.consultation_time.replace(":", "")}00Z
DTEND:${booking.consultation_date.replace(/-/g, "")}T${(parseInt(booking.consultation_time.split(":")[0]) * 60 + parseInt(booking.consultation_time.split(":")[1]) + 20).toString().padStart(4, "0")}00Z
SUMMARY:TechFluence Consultation
DESCRIPTION:Consultation with ${escapeHtml(booking.name)}
LOCATION:Online
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

    // Send confirmation email to user
    const userEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "TechFluence <onboarding@resend.dev>",
        to: [booking.email],
        subject: "Consultation Confirmed - TechFluence",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
                .details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
                .detail-label { font-weight: bold; color: #6b7280; }
                .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Consultation Confirmed!</h1>
                </div>
                <div class="content">
                  <p>Dear ${escapeHtml(booking.name)},</p>
                  <p>Your consultation has been successfully booked with TechFluence.</p>
                  
                  <div class="details">
                    <h3 style="margin-top: 0; color: #3b82f6;">Consultation Details</h3>
                    <div class="detail-row">
                      <span class="detail-label">Date:</span>
                      <span>${escapeHtml(formattedDate)}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Time:</span>
                      <span>${escapeHtml(booking.consultation_time)}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Duration:</span>
                      <span>20 minutes</span>
                    </div>
                    ${booking.company ? `
                    <div class="detail-row">
                      <span class="detail-label">Company:</span>
                      <span>${escapeHtml(booking.company)}</span>
                    </div>
                    ` : ""}
                  </div>

                  <p>We look forward to discussing your needs and how TechFluence can help transform your business with cutting-edge technology solutions.</p>
                  
                  <p><strong>What to expect:</strong></p>
                  <ul>
                    <li>Expert analysis of your requirements</li>
                    <li>Tailored solution recommendations</li>
                    <li>Clear next steps and timeline</li>
                  </ul>

                  <p>Please add this consultation to your calendar using the attachment.</p>

                  <div class="footer">
                    <p>Need to reschedule? Contact us at info@techfluence.com</p>
                    <p>&copy; 2025 TechFluence. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        attachments: [
          {
            filename: "consultation.ics",
            content: btoa(calendarEvent),
          },
        ],
      }),
    });

    if (!userEmailResponse.ok) {
      const errorText = await userEmailResponse.text();
      console.error("Failed to send user email");
      throw new Error(`Failed to send user email: ${errorText}`);
    }

    console.log("User confirmation email sent successfully");

    // Send notification email to admin
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "TechFluence Bookings <onboarding@resend.dev>",
        to: ["techfluence.ai@outlook.com"],
        subject: `New Consultation Booked - ${escapeHtml(booking.name)}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; }
                .info-grid { display: grid; gap: 15px; margin: 20px 0; }
                .info-item { padding: 15px; background: #f9fafb; border-radius: 6px; }
                .label { font-weight: bold; color: #6b7280; font-size: 14px; }
                .value { color: #111827; font-size: 16px; margin-top: 5px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>🔔 New Consultation Booking</h2>
                </div>
                <div class="content">
                  <p>A new consultation has been booked:</p>
                  
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="label">Client Name</div>
                      <div class="value">${escapeHtml(booking.name)}</div>
                    </div>
                    <div class="info-item">
                      <div class="label">Email</div>
                      <div class="value">${escapeHtml(booking.email)}</div>
                    </div>
                    ${booking.phone ? `
                    <div class="info-item">
                      <div class="label">Phone</div>
                      <div class="value">${escapeHtml(booking.phone)}</div>
                    </div>
                    ` : ""}
                    ${booking.company ? `
                    <div class="info-item">
                      <div class="label">Company</div>
                      <div class="value">${escapeHtml(booking.company)}</div>
                    </div>
                    ` : ""}
                    <div class="info-item">
                      <div class="label">Date & Time</div>
                      <div class="value">${escapeHtml(formattedDate)} at ${escapeHtml(booking.consultation_time)}</div>
                    </div>
                    ${booking.message ? `
                    <div class="info-item">
                      <div class="label">Message</div>
                      <div class="value">${escapeHtml(booking.message)}</div>
                    </div>
                    ` : ""}
                  </div>

                  <p><strong>Booking ID:</strong> ${consultation.id}</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!adminEmailResponse.ok) {
      const errorText = await adminEmailResponse.text();
      console.error("Failed to send admin notification");
      // Don't throw error for admin email, as user booking is already confirmed
    } else {
      console.log("Admin notification email sent successfully");
    }

    return new Response(
      JSON.stringify({ success: true, bookingId: consultation.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in book-consultation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);