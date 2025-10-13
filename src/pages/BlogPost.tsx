import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  keywords: string[];
  read_time: string;
  image_url?: string;
  created_at: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) {
        console.error("Error fetching blog post:", error);
        toast.error("Failed to load blog post");
        setLoading(false);
        return;
      }

      setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = post?.title || "";

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    };

    if (platform === "copy") {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
      return;
    }

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${post.title} | Techfluence Blog`}
        description={post.excerpt}
        canonical={`https://techfluence-ai.lovable.app/blog/${post.slug}`}
        keywords={post.keywords.join(", ")}
      />

      <Header />

      <article className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>

          {/* Post Header */}
          <header className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.read_time}
              </span>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Share Buttons */}
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("twitter")}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("linkedin")}
            >
              <Share2 className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("facebook")}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("whatsapp")}
            >
              <Share2 className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("copy")}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Keywords */}
          {post.keywords && post.keywords.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Keywords:
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 p-8 bg-primary/5 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground mb-6">
              Let's discuss how we can help you leverage AI and technology for growth
            </p>
            <Link to="/book-consultation">
              <Button size="lg">Book a Free Consultation</Button>
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
