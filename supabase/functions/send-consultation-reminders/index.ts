import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0];
    const todayDateStr = now.toISOString().split('T')[0];

    console.log("Checking for consultations on:", tomorrowDateStr, "and completed today:", todayDateStr);

    // Get consultations happening tomorrow (24-hour reminder)
    const { data: upcomingConsultations, error: upcomingError } = await supabase
      .from("consultations")
      .select("*")
      .eq("consultation_date", tomorrowDateStr)
      .eq("status", "scheduled");

    if (upcomingError) {
      console.error("Error fetching upcoming consultations:", upcomingError);
      throw upcomingError;
    }

    console.log("Found", upcomingConsultations?.length || 0, "upcoming consultations");

    // Send reminder emails for tomorrow's consultations
    const reminderResults = [];
    for (const consultation of upcomingConsultations || []) {
      try {
        const { error: emailError } = await resend.emails.send({
          from: "Techfluence <notifications@resend.dev>",
          to: [consultation.user_email],
          subject: "Reminder: Your Consultation is Tomorrow",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #ff2400;">Consultation Reminder</h1>
              <p>Dear ${consultation.user_name},</p>
              <p>This is a friendly reminder that your consultation with Techfluence is scheduled for <strong>tomorrow</strong>.</p>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(consultation.consultation_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${consultation.consultation_time}</p>
                ${consultation.company ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${consultation.company}</p>` : ''}
              </div>
              
              <p>Please ensure you're available at the scheduled time. If you need to reschedule, please contact us as soon as possible.</p>
              
              <p>We look forward to speaking with you!</p>
              
              <p style="margin-top: 30px;">Best regards,<br>The Techfluence Team</p>
            </div>
          `,
        });

        if (emailError) {
          console.error("Failed to send reminder to:", consultation.user_email, emailError);
          reminderResults.push({ email: consultation.user_email, status: "failed", error: emailError });
        } else {
          console.log("Reminder sent to:", consultation.user_email);
          reminderResults.push({ email: consultation.user_email, status: "sent" });
        }
      } catch (e) {
        console.error("Error sending reminder:", e);
        reminderResults.push({ email: consultation.user_email, status: "error", error: e });
      }
    }

    // Get consultations that were completed today (thank you emails)
    const { data: completedConsultations, error: completedError } = await supabase
      .from("consultations")
      .select("*")
      .eq("consultation_date", todayDateStr)
      .eq("status", "completed");

    if (completedError) {
      console.error("Error fetching completed consultations:", completedError);
    }

    console.log("Found", completedConsultations?.length || 0, "completed consultations");

    // Send thank you emails for completed consultations
    const thankYouResults = [];
    for (const consultation of completedConsultations || []) {
      try {
        const { error: emailError } = await resend.emails.send({
          from: "Techfluence <notifications@resend.dev>",
          to: [consultation.user_email],
          subject: "Thank You for Your Consultation",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #ff2400;">Thank You!</h1>
              <p>Dear ${consultation.user_name},</p>
              <p>Thank you for taking the time to consult with Techfluence today. We truly value the opportunity to discuss your needs and explore how we can help you achieve your goals.</p>
              
              <h2 style="color: #333; margin-top: 30px;">What's Next?</h2>
              <ul style="line-height: 1.8;">
                <li>Our team will review the discussion points from our meeting</li>
                <li>You'll receive a detailed proposal within 2-3 business days</li>
                <li>Feel free to reach out if you have any immediate questions</li>
              </ul>
              
              <div style="background: linear-gradient(135deg, #ff2400 0%, #ff6b35 100%); color: white; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                <p style="margin: 0; font-size: 16px;">We're excited about the possibility of working together!</p>
              </div>
              
              <p>If you have any questions in the meantime, don't hesitate to contact us.</p>
              
              <p style="margin-top: 30px;">Warm regards,<br>The Techfluence Team</p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #666; font-size: 12px;">
                Visit our <a href="https://techfluence.com/blog" style="color: #ff2400;">blog</a> for the latest insights on technology and digital transformation.
              </p>
            </div>
          `,
        });

        if (emailError) {
          console.error("Failed to send thank you to:", consultation.user_email, emailError);
          thankYouResults.push({ email: consultation.user_email, status: "failed", error: emailError });
        } else {
          console.log("Thank you sent to:", consultation.user_email);
          thankYouResults.push({ email: consultation.user_email, status: "sent" });
        }
      } catch (e) {
        console.error("Error sending thank you:", e);
        thankYouResults.push({ email: consultation.user_email, status: "error", error: e });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        reminders: {
          count: upcomingConsultations?.length || 0,
          results: reminderResults,
        },
        thankYous: {
          count: completedConsultations?.length || 0,
          results: thankYouResults,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-consultation-reminders:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
