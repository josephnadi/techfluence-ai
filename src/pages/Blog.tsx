import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
}

const Blog = () => {
  const [blogPosts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "Transforming Business with Generative AI: A Practical Guide",
      excerpt: "Discover how generative AI is revolutionizing business operations across Africa and how your organization can leverage these technologies for competitive advantage.",
      date: "2025-10-10",
      readTime: "5 min read",
      category: "AI Solutions",
    },
    {
      id: "2",
      title: "Digital Transformation in Ghana: Success Stories and Lessons",
      excerpt: "Explore real-world case studies of successful digital transformation initiatives in Ghana's tech ecosystem and learn from their implementation strategies.",
      date: "2025-10-08",
      readTime: "7 min read",
      category: "Digital Transformation",
    },
    {
      id: "3",
      title: "Building Scalable IT Infrastructure for African Startups",
      excerpt: "Learn best practices for creating robust, scalable IT infrastructure that supports rapid growth while maintaining security and reliability.",
      date: "2025-10-05",
      readTime: "6 min read",
      category: "IT Strategy",
    },
  ]);

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

        {/* Blog Posts Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-7xl">
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
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="group">
                        Read More 
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </article>
              ))}
            </div>

            {/* Coming Soon Message */}
            <div className="mt-16 text-center">
              <p className="text-muted-foreground text-lg">
                More insightful articles coming soon. Stay tuned for expert analysis on AI, tech consulting, and digital transformation.
              </p>
            </div>
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
