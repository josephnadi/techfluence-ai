import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Mail, Phone, Download, Calendar, Clock, Building, User, 
  Search, Filter, ChevronDown, ChevronUp, MessageSquare, RefreshCw
} from "lucide-react";
import { format, parseISO } from "date-fns";

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
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  useEffect(() => {
    filterConsultations();
  }, [consultations, searchTerm, statusFilter, sortOrder]);

  const fetchConsultations = async () => {
    setLoading(true);
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

  const filterConsultations = () => {
    let filtered = [...consultations];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.user_name.toLowerCase().includes(term) ||
          c.user_email.toLowerCase().includes(term) ||
          c.company?.toLowerCase().includes(term) ||
          c.user_phone?.includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.consultation_date).getTime();
      const dateB = new Date(b.consultation_date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredConsultations(filtered);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("consultations")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    toast.success(`Status updated to ${newStatus}`);
    setConsultations(consultations.map(c =>
      c.id === id ? { ...c, status: newStatus } : c
    ));
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Company", "Date", "Time", "Status", "Message", "Created At"];
    const csvData = filteredConsultations.map(c => [
      c.user_name,
      c.user_email,
      c.user_phone || "",
      c.company || "",
      format(parseISO(c.consultation_date), "yyyy-MM-dd"),
      c.consultation_time,
      c.status,
      c.message?.replace(/"/g, '""') || "",
      format(parseISO(c.created_at), "yyyy-MM-dd HH:mm")
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `consultations_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Consultations exported successfully");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "scheduled":
        return <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const statusCounts = {
    all: consultations.length,
    scheduled: consultations.filter(c => c.status === "scheduled").length,
    completed: consultations.filter(c => c.status === "completed").length,
    cancelled: consultations.filter(c => c.status === "cancelled").length,
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setStatusFilter("all")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{statusCounts.all}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setStatusFilter("scheduled")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-primary">{statusCounts.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setStatusFilter("completed")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-500">{statusCounts.completed}</p>
              </div>
              <User className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setStatusFilter("cancelled")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-red-500">{statusCounts.cancelled}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[300px]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            title={sortOrder === "desc" ? "Newest first" : "Oldest first"}
          >
            {sortOrder === "desc" ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={fetchConsultations} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredConsultations.length} of {consultations.length} appointments
      </p>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Appointment</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConsultations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No appointments found</p>
                  {searchTerm || statusFilter !== "all" ? (
                    <Button 
                      variant="link" 
                      onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
                    >
                      Clear filters
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ) : (
              filteredConsultations.map((consultation) => (
                <>
                  <TableRow 
                    key={consultation.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setExpandedRow(expandedRow === consultation.id ? null : consultation.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{consultation.user_name}</p>
                          {consultation.company && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {consultation.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <a 
                          href={`mailto:${consultation.user_email}`} 
                          className="text-sm flex items-center gap-1.5 text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-3 w-3" />
                          {consultation.user_email}
                        </a>
                        {consultation.user_phone && (
                          <a
                            href={`tel:${consultation.user_phone}`}
                            className="text-sm flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="h-3 w-3" />
                            {consultation.user_phone}
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {format(parseISO(consultation.consultation_date), "MMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {consultation.consultation_time}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                        {consultation.status === "scheduled" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-500 border-green-500/50 hover:bg-green-500/10"
                              onClick={() => updateStatus(consultation.id, "completed")}
                            >
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 border-red-500/50 hover:bg-red-500/10"
                              onClick={() => updateStatus(consultation.id, "cancelled")}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {consultation.message && (
                          <Button size="sm" variant="ghost" title="Has message">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRow === consultation.id && consultation.message && (
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={5} className="py-4">
                        <div className="px-4">
                          <p className="text-sm font-medium mb-1">Message:</p>
                          <p className="text-sm text-muted-foreground bg-background p-3 rounded-lg">
                            {consultation.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Booked on: {format(parseISO(consultation.created_at), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAppointments;
