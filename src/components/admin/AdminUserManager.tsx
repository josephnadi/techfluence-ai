import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

const AdminUserManager = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load users");
        return;
      }

      setUserRoles(data || []);
      setLoading(false);
    };

    fetchUserRoles();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Added On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No users with assigned roles yet
                </TableCell>
              </TableRow>
            ) : (
              userRoles.map((userRole) => (
                <TableRow key={userRole.id}>
                  <TableCell className="font-mono text-sm">
                    {userRole.user_id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={userRole.role === "admin" ? "default" : "secondary"}
                    >
                      {userRole.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(userRole.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Note: To add admin users, insert records directly into the user_roles table through the backend.
      </p>
    </div>
  );
};

export default AdminUserManager;
