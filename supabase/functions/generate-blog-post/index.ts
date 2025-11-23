import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, category } = await req.json();

    if (!topic || !category) {
      return new Response(
        JSON.stringify({ error: "Topic and category are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating blog post for topic:", topic);

    // Generate blog content (3-5 minute read = ~600-1000 words)
    const contentPrompt = `Create a comprehensive, SEO-optimized blog post about "${topic}" in the ${category} category.

REQUIREMENTS:
- Length: 600-800 words (3-5 minute read)
- Include compelling title with primary keyword
- Write engaging meta description (150-160 characters)
- Use H2 and H3 headings with relevant keywords
- Include practical examples and actionable insights
- Optimize for Ghana and African tech market context
- End with clear call-to-action
- Use conversational yet professional tone

FORMAT YOUR RESPONSE AS JSON:
{
  "title": "SEO-optimized title",
  "meta_description": "compelling meta description",
  "content": "full markdown blog post content",
  "excerpt": "2-3 sentence summary",
  "slug": "url-friendly-slug"
}`;

    const contentResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: contentPrompt }
        ],
      }),
    });

    if (!contentResponse.ok) {
      const errorText = await contentResponse.text();
      console.error("Content generation error:", errorText);
      throw new Error("Failed to generate blog content");
    }

    const contentData = await contentResponse.json();
    const contentText = contentData.choices[0].message.content;

    // Extract JSON from response (handle markdown code blocks)
    let blogData;
    try {
      const jsonMatch = contentText.match(/```json\n([\s\S]*?)\n```/) || contentText.match(/{[\s\S]*}/);
      blogData = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : contentText);
    } catch (e) {
      console.error("Failed to parse blog data:", e);
      throw new Error("Failed to parse generated content");
    }

    console.log("Blog content generated, now generating image...");

    // Generate SEO-optimized featured image
    const imagePrompt = `Create a premium, award-winning editorial illustration for a tech blog post titled "${blogData.title}".
    
    Context: ${blogData.meta_description}

    Style requirements:
    - High-end digital art style, photorealistic lighting, 8k resolution
    - Modern, futuristic, and sophisticated aesthetic suitable for a tech consultancy
    - Use a color palette of deep blues, purples, and vibrant accents (cyberpunk meets corporate)
    - Composition: Cinematic, depth of field, balanced
    - Subject: Abstract representation of ${category} and the specific topic
    - NO TEXT in the image
    - Aspect ratio: 16:9 landscape`;

    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          { role: "user", content: imagePrompt }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error("Image generation error:", errorText);
      throw new Error("Failed to generate image");
    }

    const imageData = await imageResponse.json();
    const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image URL in response");
    }

    console.log("Image generated successfully, storing blog post...");

    // Insert blog post with image
    const { error: insertError } = await supabase
      .from("blog_posts")
      .insert({
        title: blogData.title,
        slug: blogData.slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        category: category,
        author: "Techfluence AI",
        featured_image: imageUrl,
        meta_description: blogData.meta_description,
        published: true,
        reading_time: "3-5 min read"
      });

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw insertError;
    }

    console.log("Blog post created successfully!");

    return new Response(
      JSON.stringify({
        message: "Blog post with AI-generated image created successfully!",
        title: blogData.title,
        slug: blogData.slug
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-blog-post:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
