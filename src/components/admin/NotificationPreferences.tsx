import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, Bell, Mail, Clock } from "lucide-react";

interface NotificationPrefs {
  email_new_consultation: boolean;
  email_new_contact: boolean;
  email_digest_enabled: boolean;
  email_digest_frequency: "daily" | "weekly";
  digest_day_of_week: number;
  digest_hour: number;
}

const NotificationPreferences = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPrefs>({
    email_new_consultation: true,
    email_new_contact: true,
    email_digest_enabled: false,
    email_digest_frequency: "daily",
    digest_day_of_week: 1,
    digest_hour: 9,
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching preferences:", error);
        return;
      }

      if (data) {
        setPreferences({
          email_new_consultation: data.email_new_consultation,
          email_new_contact: data.email_new_contact,
          email_digest_enabled: data.email_digest_enabled,
          email_digest_frequency: data.email_digest_frequency as "daily" | "weekly",
          digest_day_of_week: data.digest_day_of_week || 1,
          digest_hour: data.digest_hour || 9,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      const { error } = await supabase
        .from("notification_preferences")
        .upsert({
          user_id: user.id,
          ...preferences,
        }, {
          onConflict: "user_id",
        });

      if (error) throw error;

      toast.success("Notification preferences saved!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  const hours = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: `${i.toString().padStart(2, "0")}:00`,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Instant Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Instant Notifications
          </CardTitle>
          <CardDescription>
            Receive email notifications immediately when events occur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">New Consultation Booking</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone books a consultation
              </p>
            </div>
            <Switch
              checked={preferences.email_new_consultation}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({ ...prev, email_new_consultation: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">New Contact Form Submission</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone submits the contact form
              </p>
            </div>
            <Switch
              checked={preferences.email_new_contact}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({ ...prev, email_new_contact: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Digest Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5" />
            Email Digest
          </CardTitle>
          <CardDescription>
            Receive a summary of all activities at scheduled times
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Enable Email Digest</Label>
              <p className="text-sm text-muted-foreground">
                Receive periodic summaries instead of individual notifications
              </p>
            </div>
            <Switch
              checked={preferences.email_digest_enabled}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({ ...prev, email_digest_enabled: checked }))
              }
            />
          </div>

          {preferences.email_digest_enabled && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Schedule Settings
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={preferences.email_digest_frequency}
                    onValueChange={(value: "daily" | "weekly") =>
                      setPreferences((prev) => ({ ...prev, email_digest_frequency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <Select
                    value={preferences.digest_hour.toString()}
                    onValueChange={(value) =>
                      setPreferences((prev) => ({ ...prev, digest_hour: parseInt(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={hour.value} value={hour.value.toString()}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {preferences.email_digest_frequency === "weekly" && (
                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <Select
                    value={preferences.digest_day_of_week.toString()}
                    onValueChange={(value) =>
                      setPreferences((prev) => ({ ...prev, digest_day_of_week: parseInt(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="text-muted-foreground">
                  {preferences.email_digest_frequency === "daily"
                    ? `You'll receive a daily digest at ${preferences.digest_hour.toString().padStart(2, "0")}:00`
                    : `You'll receive a weekly digest on ${daysOfWeek.find((d) => d.value === preferences.digest_day_of_week)?.label} at ${preferences.digest_hour.toString().padStart(2, "0")}:00`}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;