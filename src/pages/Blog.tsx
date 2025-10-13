import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BlogGenerator from "@/components/BlogGenerator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  created_at: string;
  read_time: string;
  category: string;
  image_url?: string;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blog posts:", error);
        toast.error("Failed to load blog posts");
        setLoading(false);
        return;
      }

      setBlogPosts(data || []);
      setLoading(false);
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Tech Insights & AI Solutions Blog | Techfluence"
        description="Expert insights on AI solutions, digital transformation, and tech consulting in Africa. Stay updated with the latest trends in generative AI and IT strategy."
        canonical="https://techfluence-ai.lovable.app/blog"
        keywords="AI blog, tech insights, digital transformation Africa, generative AI, IT consulting, Ghana tech blog, software development trends"
      />
      
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="secondary">Tech Insights</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Techfluence Blog
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Expert insights on AI solutions, digital transformation, and tech consulting for African businesses
              </p>
            </div>
          </div>
        </section>

        {/* AI Generator Section */}
        <section className="py-8 px-4 border-b">
          <div className="container mx-auto max-w-7xl flex justify-center">
            <BlogGenerator />
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-full">
                    <CardHeader>
                      <div className="animate-pulse space-y-3">
                        <div className="h-6 bg-muted rounded w-20"></div>
                        <div className="h-8 bg-muted rounded w-full"></div>
                        <div className="h-20 bg-muted rounded w-full"></div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  No blog posts yet. Generate your first AI-powered blog post!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <article key={post.id}>
                    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <Badge className="w-fit mb-2" variant="outline">
                          {post.category}
                        </Badge>
                        <CardTitle className="text-2xl mb-3 line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.read_time}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link to={`/blog/${post.slug}`}>
                          <Button variant="ghost" className="group">
                            Read More 
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 px-4 bg-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest insights on AI solutions and digital transformation in Africa
            </p>
            <Button size="lg" asChild>
              <a href="/#newsletter">Subscribe Now</a>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
