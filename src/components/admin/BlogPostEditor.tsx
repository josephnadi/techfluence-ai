import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import {
  Loader2,
  Save,
  Eye,
  Image as ImageIcon,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  keywords: string[];
  read_time: string;
  image_url: string | null;
  published: boolean;
}

interface BlogPostEditorProps {
  post?: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  "AI Solutions",
  "Digital Transformation",
  "IT Strategy",
  "Tech Consulting",
  "Software Development",
  "Cloud Computing",
];

const BlogPostEditor = ({ post, isOpen, onClose, onSuccess }: BlogPostEditorProps) => {
  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    keywords: [],
    read_time: "3 min read",
    image_url: null,
    published: false,
  });
  const [keywordInput, setKeywordInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  // SEO Analysis
  const [seoScore, setSeoScore] = useState(0);
  const [seoIssues, setSeoIssues] = useState<string[]>([]);

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        keywords: post.keywords || [],
      });
      setKeywordInput("");
    } else {
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        keywords: [],
        read_time: "3 min read",
        image_url: null,
        published: false,
      });
    }
  }, [post, isOpen]);

  // Auto-generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }, []);

  // Calculate reading time
  const calculateReadTime = useCallback((content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  }, []);

  // SEO Analysis
  useEffect(() => {
    const issues: string[] = [];
    let score = 100;

    // Title checks
    if (!formData.title) {
      issues.push("Missing title");
      score -= 20;
    } else if (formData.title.length < 30) {
      issues.push("Title too short (aim for 50-60 characters)");
      score -= 10;
    } else if (formData.title.length > 70) {
      issues.push("Title too long (keep under 60 characters)");
      score -= 10;
    }

    // Meta description (excerpt)
    if (!formData.excerpt) {
      issues.push("Missing meta description");
      score -= 20;
    } else if (formData.excerpt.length < 120) {
      issues.push("Meta description too short (aim for 150-160 characters)");
      score -= 10;
    } else if (formData.excerpt.length > 170) {
      issues.push("Meta description too long (keep under 160 characters)");
      score -= 10;
    }

    // Keywords
    if (formData.keywords.length === 0) {
      issues.push("No keywords added");
      score -= 15;
    } else if (formData.keywords.length < 3) {
      issues.push("Add more keywords (3-5 recommended)");
      score -= 5;
    }

    // Content checks
    if (!formData.content) {
      issues.push("Missing content");
      score -= 20;
    } else {
      const wordCount = formData.content.trim().split(/\s+/).length;
      if (wordCount < 300) {
        issues.push(`Content too short (${wordCount} words, aim for 600+)`);
        score -= 15;
      }

      // Check for headings
      if (!formData.content.includes("##")) {
        issues.push("No subheadings found (use ## for H2 headings)");
        score -= 10;
      }
    }

    // Featured image
    if (!formData.image_url) {
      issues.push("No featured image");
      score -= 10;
    }

    // Slug check
    if (!formData.slug) {
      issues.push("Missing URL slug");
      score -= 5;
    }

    setSeoScore(Math.max(0, score));
    setSeoIssues(issues);
  }, [formData]);

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
      read_time: calculateReadTime(content),
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()],
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (publish = false) => {
    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Please fill in title, content, and category");
      return;
    }

    setSaving(true);

    try {
      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        keywords: formData.keywords,
        read_time: formData.read_time,
        image_url: formData.image_url,
        published: publish,
      };

      if (post?.id) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", post.id);

        if (error) throw error;
        toast.success(publish ? "Post published!" : "Post saved!");
      } else {
        const { error } = await supabase.from("blog_posts").insert(postData);

        if (error) throw error;
        toast.success(publish ? "Post created and published!" : "Post saved as draft!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{post?.id ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex">
          {/* Main Editor */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter blog post title..."
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.title.length}/60 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        placeholder="url-friendly-slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, slug: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Meta Description / Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Write a compelling meta description (150-160 characters)..."
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                      }
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.excerpt.length}/160 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Keywords</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add keyword..."
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                      />
                      <Button type="button" onClick={addKeyword} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="gap-1">
                          {keyword}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeKeyword(keyword)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content (Markdown)</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your blog post in Markdown..."
                      value={formData.content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      rows={15}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.content.trim().split(/\s+/).filter(Boolean).length} words •{" "}
                      {formData.read_time}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Featured Image</Label>
                    <div className="flex items-center gap-4">
                      {formData.image_url ? (
                        <div className="relative w-32 h-20 rounded-lg overflow-hidden border">
                          <img
                            src={formData.image_url}
                            alt="Featured"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, image_url: null }))
                            }
                            className="absolute top-1 right-1 bg-background/80 rounded-full p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-20 rounded-lg border-2 border-dashed flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploading}
                          asChild
                        >
                          <span>
                            {uploading ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            Upload Image
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    {formData.image_url && (
                      <img
                        src={formData.image_url}
                        alt={formData.title}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                      />
                    )}
                    <Badge variant="outline" className="mb-4">
                      {formData.category || "Uncategorized"}
                    </Badge>
                    <h1 className="text-3xl font-bold mb-4">{formData.title || "Untitled"}</h1>
                    <p className="text-muted-foreground mb-6">{formData.excerpt}</p>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                        {formData.content || "*No content yet*"}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* SEO Sidebar */}
          <div className="w-72 border-l p-4 overflow-y-auto bg-muted/30">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  SEO Score
                  <span
                    className={`ml-auto text-lg font-bold ${
                      seoScore >= 80
                        ? "text-green-500"
                        : seoScore >= 50
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {seoScore}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-secondary rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      seoScore >= 80
                        ? "bg-green-500"
                        : seoScore >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${seoScore}%` }}
                  />
                </div>

                {seoIssues.length > 0 ? (
                  <ul className="space-y-2 text-xs">
                    {seoIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <AlertCircle className="h-3 w-3 mt-0.5 text-yellow-500 shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-green-500 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    All SEO checks passed!
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground">Reading time</p>
              <p className="font-medium">{formData.read_time}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t px-6 py-4 flex justify-between">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Draft
            </Button>
            <Button onClick={() => handleSave(true)} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {post?.id ? "Update & Publish" : "Publish"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostEditor;