import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users, FileText, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AnalyticsData {
  totalConsultations: number;
  scheduledConsultations: number;
  completedConsultations: number;
  cancelledConsultations: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  draftBlogPosts: number;
  consultationsByDate: Array<{ date: string; count: number }>;
  blogPostsByCategory: Array<{ category: string; count: number }>;
  recentActivity: Array<{ type: string; title: string; date: string }>;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch consultation data
      const { data: consultations, error: consultError } = await supabase
        .from("consultations")
        .select("*")
        .order("created_at", { ascending: false });

      if (consultError) throw consultError;

      // Fetch blog post data
      const { data: blogPosts, error: blogError } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (blogError) throw blogError;

      // Process data
      const totalConsultations = consultations?.length || 0;
      const scheduledConsultations = consultations?.filter(c => c.status === "scheduled").length || 0;
      const completedConsultations = consultations?.filter(c => c.status === "completed").length || 0;
      const cancelledConsultations = consultations?.filter(c => c.status === "cancelled").length || 0;

      const totalBlogPosts = blogPosts?.length || 0;
      const publishedBlogPosts = blogPosts?.filter(p => p.published).length || 0;
      const draftBlogPosts = blogPosts?.filter(p => !p.published).length || 0;

      // Group consultations by date (last 7 days)
      const consultationsByDate = consultations?.reduce((acc: any[], item) => {
        const date = new Date(item.consultation_date).toLocaleDateString();
        const existing = acc.find(a => a.date === date);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ date, count: 1 });
        }
        return acc;
      }, []).slice(0, 7) || [];

      // Group blog posts by category
      const blogPostsByCategory = blogPosts?.reduce((acc: any[], item) => {
        const existing = acc.find(a => a.category === item.category);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ category: item.category, count: 1 });
        }
        return acc;
      }, []) || [];

      // Recent activity
      const recentConsultations = consultations?.slice(0, 3).map(c => ({
        type: "consultation",
        title: `${c.user_name} - ${c.status}`,
        date: new Date(c.created_at).toLocaleDateString()
      })) || [];

      const recentBlogs = blogPosts?.slice(0, 3).map(b => ({
        type: "blog",
        title: b.title,
        date: new Date(b.created_at).toLocaleDateString()
      })) || [];

      const recentActivity = [...recentConsultations, ...recentBlogs]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setAnalytics({
        totalConsultations,
        scheduledConsultations,
        completedConsultations,
        cancelledConsultations,
        totalBlogPosts,
        publishedBlogPosts,
        draftBlogPosts,
        consultationsByDate,
        blogPostsByCategory,
        recentActivity
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-12 text-muted-foreground">
        Unable to load analytics data
      </div>
    );
  }

  const consultationStatusData = [
    { name: "Scheduled", value: analytics.scheduledConsultations },
    { name: "Completed", value: analytics.completedConsultations },
    { name: "Cancelled", value: analytics.cancelledConsultations }
  ];

  const blogPostStatusData = [
    { name: "Published", value: analytics.publishedBlogPosts },
    { name: "Drafts", value: analytics.draftBlogPosts }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalConsultations}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{analytics.scheduledConsultations} scheduled</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completedConsultations}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalConsultations > 0 
                ? `${Math.round((analytics.completedConsultations / analytics.totalConsultations) * 100)}% completion rate`
                : "No data"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBlogPosts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{analytics.publishedBlogPosts} published</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalConsultations + analytics.totalBlogPosts}
            </div>
            <p className="text-xs text-muted-foreground">Total interactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultations Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Consultation Bookings</CardTitle>
            <CardDescription>Recent consultation bookings by date</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.consultationsByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consultation Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Consultation Status</CardTitle>
            <CardDescription>Distribution of consultation statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={consultationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {consultationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Blog Posts by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Categories</CardTitle>
            <CardDescription>Posts distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.blogPostsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Blog Post Status */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Post Status</CardTitle>
            <CardDescription>Published vs Draft posts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={blogPostStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {blogPostStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest consultations and blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                {activity.type === "consultation" ? (
                  <Calendar className="h-5 w-5 text-primary" />
                ) : (
                  <FileText className="h-5 w-5 text-accent" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;