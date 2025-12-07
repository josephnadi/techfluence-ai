import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Users, Shield, UserCog, Search, Trash2, RefreshCw } from "lucide-react";
import { format, parseISO } from "date-fns";

interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "moderator" | "user";
  created_at: string;
}

const AdminUserManager = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [newUserId, setNewUserId] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "moderator" | "user">("user");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    setLoading(true);
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

  const addUserRole = async () => {
    if (!newUserId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }

    setAdding(true);
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: newUserId.trim(), role: newRole });

    if (error) {
      console.error("Error adding user role:", error);
      toast.error(error.message || "Failed to add user role");
      setAdding(false);
      return;
    }

    toast.success("User role added successfully");
    setNewUserId("");
    setNewRole("user");
    setAdding(false);
    fetchUserRoles();
  };

  const updateRole = async (id: string, newRoleValue: "admin" | "moderator" | "user") => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRoleValue })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update role");
      return;
    }

    toast.success("Role updated successfully");
    setUserRoles(userRoles.map(ur => ur.id === id ? { ...ur, role: newRoleValue } : ur));
  };

  const deleteUserRole = async (id: string) => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete user role");
      return;
    }

    toast.success("User role removed");
    setUserRoles(userRoles.filter(ur => ur.id !== id));
  };

  const filteredUsers = userRoles.filter(ur => {
    const matchesSearch = ur.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || ur.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    all: userRoles.length,
    admin: userRoles.filter(ur => ur.role === "admin").length,
    moderator: userRoles.filter(ur => ur.role === "moderator").length,
    user: userRoles.filter(ur => ur.role === "user").length,
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Admin</Badge>;
      case "moderator":
        return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">Moderator</Badge>;
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setRoleFilter("all")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{roleCounts.all}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setRoleFilter("admin")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-primary">{roleCounts.admin}</p>
              </div>
              <Shield className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setRoleFilter("moderator")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Moderators</p>
                <p className="text-2xl font-bold text-blue-500">{roleCounts.moderator}</p>
              </div>
              <UserCog className="h-8 w-8 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setRoleFilter("user")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Regular Users</p>
                <p className="text-2xl font-bold text-muted-foreground">{roleCounts.user}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New User Role */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add User Role</CardTitle>
          <CardDescription>Assign a role to a user by their ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter user ID (UUID)"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              className="flex-1"
            />
            <Select value={newRole} onValueChange={(val) => setNewRole(val as typeof newRole)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addUserRole} disabled={adding}>
              {adding ? "Adding..." : "Add Role"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[300px]"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={fetchUserRoles} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredUsers.length} of {userRoles.length} users
      </p>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">User ID</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Added On</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No users found</p>
                  {searchTerm || roleFilter !== "all" ? (
                    <Button
                      variant="link"
                      onClick={() => { setSearchTerm(""); setRoleFilter("all"); }}
                    >
                      Clear filters
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((userRole) => (
                <TableRow key={userRole.id}>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                      {userRole.user_id.substring(0, 8)}...{userRole.user_id.substring(userRole.user_id.length - 4)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={userRole.role}
                      onValueChange={(val) => updateRole(userRole.id, val as typeof userRole.role)}
                    >
                      <SelectTrigger className="w-[130px]">
                        {getRoleBadge(userRole.role)}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {format(parseISO(userRole.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove User Role</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this user's role? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteUserRole(userRole.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default AdminUserManager;
