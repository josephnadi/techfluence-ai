import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, TrendingDown, Search, Globe, FileText, 
  AlertTriangle, CheckCircle, RefreshCw, ExternalLink,
  Zap, Target, BarChart3, Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface KeywordRanking {
  keyword: string;
  position: number;
  change: number;
  volume: number;
  difficulty: "easy" | "medium" | "hard";
}

interface PagePerformance {
  page: string;
  views: number;
  avgTimeOnPage: number;
  bounceRate: number;
  score: number;
}

interface ContentSuggestion {
  type: "warning" | "success" | "info";
  title: string;
  description: string;
  page?: string;
}

const AdminSEOReports = () => {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [overallScore, setOverallScore] = useState(78);
  
  const [keywordRankings, setKeywordRankings] = useState<KeywordRanking[]>([
    { keyword: "AI consulting services", position: 5, change: 2, volume: 1200, difficulty: "medium" },
    { keyword: "IT solutions company", position: 8, change: -1, volume: 2400, difficulty: "hard" },
    { keyword: "digital transformation consulting", position: 12, change: 4, volume: 880, difficulty: "medium" },
    { keyword: "cloud migration services", position: 15, change: 0, volume: 1600, difficulty: "hard" },
    { keyword: "cybersecurity consulting", position: 7, change: 3, volume: 3200, difficulty: "hard" },
    { keyword: "AI implementation", position: 3, change: 5, volume: 720, difficulty: "easy" },
  ]);

  const [pagePerformance, setPagePerformance] = useState<PagePerformance[]>([
    { page: "/", views: 3420, avgTimeOnPage: 145, bounceRate: 42, score: 92 },
    { page: "/blog", views: 1890, avgTimeOnPage: 210, bounceRate: 35, score: 88 },
    { page: "/contact", views: 890, avgTimeOnPage: 95, bounceRate: 55, score: 75 },
    { page: "/book-consultation", views: 650, avgTimeOnPage: 180, bounceRate: 38, score: 85 },
    { page: "/community", views: 420, avgTimeOnPage: 240, bounceRate: 28, score: 82 },
  ]);

  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([
    { type: "warning", title: "Missing Alt Text", description: "3 images on the homepage are missing alt text", page: "/" },
    { type: "success", title: "Meta Descriptions", description: "All pages have optimized meta descriptions" },
    { type: "info", title: "Content Length", description: "Blog posts averaging 650 words - consider increasing to 1000+ for better rankings" },
    { type: "warning", title: "Internal Links", description: "Contact page has only 2 internal links - add more for better SEO", page: "/contact" },
    { type: "success", title: "Mobile Optimization", description: "All pages score 90+ on mobile usability" },
    { type: "info", title: "Schema Markup", description: "Consider adding FAQ schema to service pages" },
  ]);

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call to fetch fresh SEO data
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "hard": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "info": return <Zap className="h-5 w-5 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">SEO Reports</h2>
          <p className="text-muted-foreground">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleString()}` : "Loading..."}
          </p>
        </div>
        <Button onClick={refreshData} disabled={loading} variant="outline" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall SEO Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Progress value={overallScore} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Keywords Tracked</p>
                <p className="text-3xl font-bold">{keywordRankings.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Search className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <p className="mt-2 text-sm text-green-400">+4 improved this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pages Indexed</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <Globe className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">All pages indexed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Load Time</p>
                <p className="text-3xl font-bold">1.2s</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500/10">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
            <p className="mt-2 text-sm text-green-400">Good performance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keywords" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keywords" className="gap-2">
            <Search className="h-4 w-4" />
            Keyword Rankings
          </TabsTrigger>
          <TabsTrigger value="pages" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Page Performance
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="gap-2">
            <Zap className="h-4 w-4" />
            Optimization Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Rankings</CardTitle>
              <CardDescription>Track your target keywords and their search positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keywordRankings.map((kw, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium">{kw.keyword}</p>
                      <p className="text-sm text-muted-foreground">
                        {kw.volume.toLocaleString()} monthly searches
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={getDifficultyColor(kw.difficulty)}>
                        {kw.difficulty}
                      </Badge>
                      <div className="text-right min-w-[80px]">
                        <p className="font-bold text-lg">#{kw.position}</p>
                        <div className="flex items-center justify-end gap-1">
                          {kw.change > 0 ? (
                            <>
                              <TrendingUp className="h-3 w-3 text-green-400" />
                              <span className="text-xs text-green-400">+{kw.change}</span>
                            </>
                          ) : kw.change < 0 ? (
                            <>
                              <TrendingDown className="h-3 w-3 text-red-400" />
                              <span className="text-xs text-red-400">{kw.change}</span>
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Page Performance</CardTitle>
              <CardDescription>Monitor how each page performs in search and user engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pagePerformance.map((page, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{page.page}</p>
                        <p className="text-sm text-muted-foreground">
                          {page.views.toLocaleString()} views · {Math.floor(page.avgTimeOnPage / 60)}m {page.avgTimeOnPage % 60}s avg
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Bounce Rate</p>
                        <p className={`font-medium ${page.bounceRate > 50 ? "text-red-400" : "text-green-400"}`}>
                          {page.bounceRate}%
                        </p>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className={`font-bold text-lg ${getScoreColor(page.score)}`}>
                          {page.score}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions">
          <Card>
            <CardHeader>
              <CardTitle>Content Optimization Suggestions</CardTitle>
              <CardDescription>Actionable recommendations to improve your SEO</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contentSuggestions.map((suggestion, idx) => (
                  <div key={idx} className={`flex items-start gap-4 p-4 rounded-lg ${
                    suggestion.type === "warning" ? "bg-yellow-500/10 border border-yellow-500/20" :
                    suggestion.type === "success" ? "bg-green-500/10 border border-green-500/20" :
                    "bg-blue-500/10 border border-blue-500/20"
                  }`}>
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1">
                      <p className="font-medium">{suggestion.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                      {suggestion.page && (
                        <Badge variant="outline" className="mt-2">{suggestion.page}</Badge>
                      )}
                    </div>
                    {suggestion.type === "warning" && (
                      <Button variant="ghost" size="sm" className="gap-1">
                        Fix <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSEOReports;
