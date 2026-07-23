import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const cronSecret = Deno.env.get("CRON_SECRET");

interface NotificationPreference {
  user_id: string;
  email_digest_enabled: boolean;
  email_digest_frequency: string;
  digest_day_of_week: number;
  digest_hour: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // This function lists all users via the service role and emails admins with
  // consultation/blog data, so it must only be callable by the scheduled cron job.
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentDay = now.getUTCDay();

    console.log(`Running digest check at hour ${currentHour}, day ${currentDay}`);

    // Get users with digest enabled that match current schedule
    const { data: preferences, error: prefError } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("email_digest_enabled", true)
      .eq("digest_hour", currentHour);

    if (prefError) {
      console.error("Error fetching preferences:", prefError);
      throw prefError;
    }

    if (!preferences || preferences.length === 0) {
      console.log("No users scheduled for digest at this time");
      return new Response(
        JSON.stringify({ message: "No digests to send" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filter for daily or weekly (matching day)
    const usersToNotify = preferences.filter((pref: NotificationPreference) => {
      if (pref.email_digest_frequency === "daily") return true;
      if (pref.email_digest_frequency === "weekly" && pref.digest_day_of_week === currentDay) return true;
      return false;
    });

    console.log(`Found ${usersToNotify.length} users to send digests to`);

    // Get admin user emails
    const adminUserIds = usersToNotify.map((p: NotificationPreference) => p.user_id);
    
    if (adminUserIds.length === 0) {
      return new Response(
        JSON.stringify({ message: "No matching users" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user emails from auth.users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;

    const adminEmails = users.users
      .filter(u => adminUserIds.includes(u.id))
      .map(u => ({ id: u.id, email: u.email }));

    // Calculate date range for digest
    const endDate = new Date();
    const startDate = new Date();
    
    // For daily, go back 1 day; for weekly, go back 7 days
    const isWeekly = usersToNotify.some((p: NotificationPreference) => p.email_digest_frequency === "weekly");
    startDate.setDate(startDate.getDate() - (isWeekly ? 7 : 1));

    // Fetch consultations in date range
    const { data: consultations, error: consultError } = await supabase
      .from("consultations")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: false });

    if (consultError) console.error("Error fetching consultations:", consultError);

    // Fetch blog post stats
    const { data: blogPosts, error: blogError } = await supabase
      .from("blog_posts")
      .select("id, title, published, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (blogError) console.error("Error fetching blog posts:", blogError);

    // Build digest email content
    const digestPeriod = isWeekly ? "Weekly" : "Daily";
    const consultationCount = consultations?.length || 0;
    const newBlogPostCount = blogPosts?.length || 0;

    const consultationsList = consultations?.slice(0, 10).map(c => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${c.user_name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${c.user_email}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${c.consultation_date}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">
          <span style="padding: 2px 8px; border-radius: 12px; background: ${c.status === 'scheduled' ? '#fef3c7' : c.status === 'completed' ? '#d1fae5' : '#fee2e2'}; font-size: 12px;">
            ${c.status}
          </span>
        </td>
      </tr>
    `).join("") || "";

    const blogPostsList = blogPosts?.map(p => `
      <li style="margin-bottom: 8px;">
        <strong>${p.title}</strong>
        <span style="color: #666; font-size: 12px; margin-left: 8px;">
          ${p.published ? "Published" : "Draft"}
        </span>
      </li>
    `).join("") || "";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #ff2400 0%, #ff6b35 100%); padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Techfluence ${digestPeriod} Digest</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">
                ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}
              </p>
            </div>
            
            <div style="padding: 24px;">
              <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                <div style="flex: 1; background: #f8f9fa; border-radius: 8px; padding: 16px; text-align: center;">
                  <div style="font-size: 32px; font-weight: bold; color: #ff2400;">${consultationCount}</div>
                  <div style="color: #666; font-size: 14px;">New Consultations</div>
                </div>
                <div style="flex: 1; background: #f8f9fa; border-radius: 8px; padding: 16px; text-align: center;">
                  <div style="font-size: 32px; font-weight: bold; color: #ff2400;">${newBlogPostCount}</div>
                  <div style="color: #666; font-size: 14px;">Blog Posts</div>
                </div>
              </div>

              ${consultationCount > 0 ? `
                <h2 style="font-size: 18px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #ff2400;">
                  Recent Consultation Bookings
                </h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                  <thead>
                    <tr style="background: #f8f9fa;">
                      <th style="padding: 8px; text-align: left; font-size: 12px; color: #666;">Name</th>
                      <th style="padding: 8px; text-align: left; font-size: 12px; color: #666;">Email</th>
                      <th style="padding: 8px; text-align: left; font-size: 12px; color: #666;">Date</th>
                      <th style="padding: 8px; text-align: left; font-size: 12px; color: #666;">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${consultationsList}
                  </tbody>
                </table>
              ` : ""}

              ${newBlogPostCount > 0 ? `
                <h2 style="font-size: 18px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #ff2400;">
                  Blog Activity
                </h2>
                <ul style="padding-left: 20px; margin-bottom: 24px;">
                  ${blogPostsList}
                </ul>
              ` : ""}

              <div style="text-align: center; padding-top: 16px; border-top: 1px solid #eee;">
                <a href="${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app') || 'https://techfluence.lovable.app'}/admin" 
                   style="display: inline-block; background: #ff2400; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                  View Admin Dashboard
                </a>
              </div>
            </div>

            <div style="background: #f8f9fa; padding: 16px; text-align: center; font-size: 12px; color: #666;">
              <p style="margin: 0;">You're receiving this because you enabled email digests in your notification preferences.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send emails to all admins
    const emailResults = await Promise.all(
      adminEmails.map(async (admin) => {
        if (!admin.email) return { success: false, email: admin.email };
        
        try {
          await resend.emails.send({
            from: "Techfluence <notifications@techfluence.ai>",
            to: [admin.email],
            subject: `Techfluence ${digestPeriod} Digest - ${consultationCount} consultations, ${newBlogPostCount} posts`,
            html: emailHtml,
          });
          console.log(`Digest sent to ${admin.email}`);
          return { success: true, email: admin.email };
        } catch (error) {
          console.error(`Failed to send to ${admin.email}:`, error);
          return { success: false, email: admin.email };
        }
      })
    );

    const successful = emailResults.filter(r => r.success).length;
    const failed = emailResults.filter(r => !r.success).length;

    console.log(`Digest complete: ${successful} sent, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        message: "Digest processed",
        sent: successful,
        failed: failed
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-notification-digest:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});