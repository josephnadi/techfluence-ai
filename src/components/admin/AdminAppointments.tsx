import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Phone } from "lucide-react";

interface Consultation {
  id: string;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  company: string | null;
  consultation_date: string;
  consultation_time: string;
  message: string | null;
  status: string;
  created_at: string;
}

const AdminAppointments = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .order("consultation_date", { ascending: false });

      if (error) {
        toast.error("Failed to load appointments");
        return;
      }

      setConsultations(data || []);
      setLoading(false);
    };

    fetchConsultations();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("consultations")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    toast.success("Status updated");
    setConsultations(consultations.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
  };

  if (loading) {
    return <div className="text-center py-8">Loading appointments...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No consultation bookings yet
                </TableCell>
              </TableRow>
            ) : (
              consultations.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell className="font-medium">{consultation.user_name}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${consultation.user_email}`} className="text-primary hover:underline">
                          {consultation.user_email}
                        </a>
                      </div>
                      {consultation.user_phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{consultation.user_phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{consultation.company || "—"}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(consultation.consultation_date).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">{consultation.consultation_time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        consultation.status === "completed" ? "default" :
                        consultation.status === "cancelled" ? "destructive" :
                        "secondary"
                      }
                    >
                      {consultation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {consultation.status === "scheduled" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(consultation.id, "completed")}
                          >
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(consultation.id, "cancelled")}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAppointments;
