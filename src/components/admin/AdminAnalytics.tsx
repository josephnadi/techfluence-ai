import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Calendar, Users, FileText, TrendingUp, Clock, CheckCircle, XCircle, 
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart as PieChartIcon, 
  Activity, Target, RefreshCw
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { format, subDays, startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";

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
  recentActivity: Array<{ type: string; title: string; date: string; status?: string }>;
  thisMonthConsultations: number;
  lastMonthConsultations: number;
  thisMonthBlogPosts: number;
  lastMonthBlogPosts: number;
  weeklyTrend: Array<{ day: string; consultations: number; posts: number }>;
}

const COLORS = ['hsl(8, 100%, 50%)', 'hsl(217, 33%, 50%)', 'hsl(142, 76%, 36%)', 'hsl(48, 96%, 53%)'];

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      // This month vs last month comparison
      const now = new Date();
      const thisMonthStart = startOfMonth(now);
      const thisMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subDays(thisMonthStart, 1));
      const lastMonthEnd = endOfMonth(subDays(thisMonthStart, 1));

      const thisMonthConsultations = consultations?.filter(c => {
        const date = parseISO(c.created_at);
        return isWithinInterval(date, { start: thisMonthStart, end: thisMonthEnd });
      }).length || 0;

      const lastMonthConsultations = consultations?.filter(c => {
        const date = parseISO(c.created_at);
        return isWithinInterval(date, { start: lastMonthStart, end: lastMonthEnd });
      }).length || 0;

      const thisMonthBlogPosts = blogPosts?.filter(p => {
        const date = parseISO(p.created_at);
        return isWithinInterval(date, { start: thisMonthStart, end: thisMonthEnd });
      }).length || 0;

      const lastMonthBlogPosts = blogPosts?.filter(p => {
        const date = parseISO(p.created_at);
        return isWithinInterval(date, { start: lastMonthStart, end: lastMonthEnd });
      }).length || 0;

      // Weekly trend (last 7 days)
      const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(now, 6 - i);
        const dayStr = format(date, "EEE");
        const dateStr = format(date, "yyyy-MM-dd");
        
        const dayConsultations = consultations?.filter(c => 
          format(parseISO(c.created_at), "yyyy-MM-dd") === dateStr
        ).length || 0;
        
        const dayPosts = blogPosts?.filter(p => 
          format(parseISO(p.created_at), "yyyy-MM-dd") === dateStr
        ).length || 0;

        return { day: dayStr, consultations: dayConsultations, posts: dayPosts };
      });

      // Group consultations by date (last 14 days)
      const consultationsByDate = Array.from({ length: 14 }, (_, i) => {
        const date = subDays(now, 13 - i);
        const dateStr = format(date, "MM/dd");
        const count = consultations?.filter(c => 
          format(parseISO(c.consultation_date), "MM/dd") === dateStr
        ).length || 0;
        return { date: dateStr, count };
      });

      // Group blog posts by category
      const blogPostsByCategory = blogPosts?.reduce((acc: Array<{ category: string; count: number }>, item) => {
        const existing = acc.find(a => a.category === item.category);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ category: item.category, count: 1 });
        }
        return acc;
      }, []) || [];

      // Recent activity with more details
      const recentConsultations = consultations?.slice(0, 5).map(c => ({
        type: "consultation",
        title: c.user_name,
        date: format(parseISO(c.created_at), "MMM d, h:mm a"),
        status: c.status
      })) || [];

      const recentBlogs = blogPosts?.slice(0, 5).map(b => ({
        type: "blog",
        title: b.title,
        date: format(parseISO(b.created_at), "MMM d, h:mm a"),
        status: b.published ? "published" : "draft"
      })) || [];

      const recentActivity = [...recentConsultations, ...recentBlogs]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);

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
        recentActivity,
        thisMonthConsultations,
        lastMonthConsultations,
        thisMonthBlogPosts,
        lastMonthBlogPosts,
        weeklyTrend
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-12 text-muted-foreground">
        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Unable to load analytics data</p>
        <Button onClick={handleRefresh} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const consultationsChange = getPercentageChange(analytics.thisMonthConsultations, analytics.lastMonthConsultations);
  const blogPostsChange = getPercentageChange(analytics.thisMonthBlogPosts, analytics.lastMonthBlogPosts);
  const completionRate = analytics.totalConsultations > 0 
    ? Math.round((analytics.completedConsultations / analytics.totalConsultations) * 100)
    : 0;

  const consultationStatusData = [
    { name: "Scheduled", value: analytics.scheduledConsultations, color: COLORS[0] },
    { name: "Completed", value: analytics.completedConsultations, color: COLORS[2] },
    { name: "Cancelled", value: analytics.cancelledConsultations, color: COLORS[3] }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Overview</h2>
          <p className="text-muted-foreground">Real-time insights into your platform performance</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalConsultations}</div>
            <div className="flex items-center mt-1">
              {consultationsChange >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-xs ${consultationsChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {Math.abs(consultationsChange)}% from last month
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.scheduledConsultations} pending
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completionRate}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.completedConsultations} completed
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalBlogPosts}</div>
            <div className="flex items-center mt-1">
              {blogPostsChange >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-xs ${blogPostsChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {Math.abs(blogPostsChange)}% from last month
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.publishedBlogPosts} published, {analytics.draftBlogPosts} drafts
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics.thisMonthConsultations + analytics.thisMonthBlogPosts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.thisMonthConsultations} consultations, {analytics.thisMonthBlogPosts} posts
            </p>
            <Badge variant="secondary" className="mt-2 text-xs">
              {format(new Date(), "MMMM yyyy")}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Consultations and blog posts over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={analytics.weeklyTrend}>
                <defs>
                  <linearGradient id="colorConsultations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(8, 100%, 50%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(8, 100%, 50%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217, 70%, 50%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(217, 70%, 50%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="consultations" 
                  stroke="hsl(8, 100%, 50%)" 
                  fillOpacity={1} 
                  fill="url(#colorConsultations)" 
                  name="Consultations"
                />
                <Area 
                  type="monotone" 
                  dataKey="posts" 
                  stroke="hsl(217, 70%, 50%)" 
                  fillOpacity={1} 
                  fill="url(#colorPosts)" 
                  name="Blog Posts"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consultation Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Consultation Status
            </CardTitle>
            <CardDescription>Distribution of consultation statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={consultationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {consultationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {consultationStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consultation Bookings Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Booking Trend (14 Days)</CardTitle>
            <CardDescription>Consultation bookings over the last two weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.consultationsByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="count" fill="hsl(8, 100%, 50%)" radius={[4, 4, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`mt-1 p-1.5 rounded-full ${
                    activity.type === "consultation" 
                      ? "bg-primary/20 text-primary" 
                      : "bg-blue-500/20 text-blue-500"
                  }`}>
                    {activity.type === "consultation" ? (
                      <Calendar className="h-3 w-3" />
                    ) : (
                      <FileText className="h-3 w-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                      {activity.status && (
                        <Badge 
                          variant={
                            activity.status === "completed" || activity.status === "published" 
                              ? "default" 
                              : activity.status === "cancelled" 
                                ? "destructive" 
                                : "secondary"
                          }
                          className="text-[10px] px-1.5 py-0"
                        >
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {analytics.recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Categories */}
      {analytics.blogPostsByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Blog Categories Distribution</CardTitle>
            <CardDescription>Posts organized by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.blogPostsByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="count" fill="hsl(217, 70%, 50%)" radius={[0, 4, 4, 0]} name="Posts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAnalytics;
