import { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, FileText, Users, Calendar, MessageSquare, BarChart3, Settings, 
  Plus, ExternalLink, RefreshCw, Search
} from "lucide-react";
import AdminBlogManager from "@/components/admin/AdminBlogManager";
import AdminUserManager from "@/components/admin/AdminUserManager";
import AdminAppointments from "@/components/admin/AdminAppointments";
import AdminCommunity from "@/components/admin/AdminCommunity";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminSEOReports from "@/components/admin/AdminSEOReports";
import NotificationPreferences from "@/components/admin/NotificationPreferences";

const Admin = () => {
  const { isAdmin, loading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("analytics");

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Admin Dashboard | Techfluence AI"
        description="Admin dashboard for managing Techfluence website"
        robots="noindex, nofollow"
      />
      
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your website content and users</p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/blog">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Blog
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/contact">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Contact
              </Link>
            </Button>
            <Button variant="default" size="sm" onClick={() => setActiveTab("blog")}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 lg:w-auto lg:inline-grid gap-1 h-auto p-1 bg-card/50 backdrop-blur-xl border border-border/40">
            <TabsTrigger value="analytics" className="gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4 mt-6">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 mt-6">
            <AdminSEOReports />
          </TabsContent>

          <TabsContent value="blog" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle>Blog Management</CardTitle>
                    <CardDescription>Create, edit, and manage blog posts with live preview and SEO tools</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AdminBlogManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and assign roles</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminUserManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Consultation Appointments</CardTitle>
                <CardDescription>View and manage booking requests</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminAppointments />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Community Management</CardTitle>
                <CardDescription>Manage community content and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCommunity />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure email notifications and digest summaries</CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationPreferences />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>Platform status and configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-sm">Platform</span>
                      <span className="text-sm font-medium">Techfluence AI</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-sm">Environment</span>
                      <span className="text-sm font-medium text-green-500">Production</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-sm">Database</span>
                      <span className="text-sm font-medium text-green-500">Connected</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-sm">Email Service</span>
                      <span className="text-sm font-medium text-green-500">Active</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://docs.lovable.dev" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Documentation
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
