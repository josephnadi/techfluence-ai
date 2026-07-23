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

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    console.log("Generating blog post for topic:", topic);

    // Generate blog content (3-5 minute read = ~600-1000 words)
    const contentPrompt = `Create a comprehensive, SEO-optimized blog post about "${topic}" in the ${category} category.

REQUIREMENTS:
- Length: 600-800 words (3-5 minute read)
- Include compelling title with primary keyword
- Write engaging excerpt (2-3 sentences summary)
- Use H2 and H3 headings with relevant keywords
- Include practical examples and actionable insights
- Optimize for Ghana and African tech market context
- End with clear call-to-action
- Use conversational yet professional tone
- Include 3-5 relevant SEO keywords

FORMAT YOUR RESPONSE AS VALID JSON ONLY (no markdown code blocks):
{
  "title": "SEO-optimized title",
  "content": "full markdown blog post content with proper headings",
  "excerpt": "2-3 sentence summary for preview cards",
  "slug": "url-friendly-slug-lowercase-with-hyphens",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`;

    const contentResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "You are a professional tech blog writer. Always respond with valid JSON only, no markdown formatting." }],
          },
          contents: [{ role: "user", parts: [{ text: contentPrompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!contentResponse.ok) {
      const errorText = await contentResponse.text();
      console.error("Content generation error:", errorText);
      throw new Error("Failed to generate blog content");
    }

    const contentData = await contentResponse.json();
    const contentText = contentData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!contentText) {
      throw new Error("Empty response from Gemini");
    }

    console.log("Raw content response:", contentText.substring(0, 500));

    // Extract JSON from response (handle markdown code blocks)
    let blogData;
    try {
      // Try to find JSON in code blocks first
      const jsonMatch = contentText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        blogData = JSON.parse(jsonMatch[1].trim());
      } else {
        // Try to parse directly
        const cleanedText = contentText.trim();
        blogData = JSON.parse(cleanedText);
      }
    } catch (e) {
      console.error("Failed to parse blog data:", e, "Content:", contentText);
      throw new Error("Failed to parse generated content");
    }

    // Validate required fields
    if (!blogData.title || !blogData.content || !blogData.excerpt || !blogData.slug) {
      console.error("Missing required fields:", blogData);
      throw new Error("Generated content missing required fields");
    }

    console.log("Blog content generated:", blogData.title);
    console.log("Now generating featured image...");

    // Generate SEO-optimized featured image
    const imagePrompt = `Create a premium editorial illustration for a tech blog post.

Title: "${blogData.title}"
Topic: ${topic}
Category: ${category}

Style requirements:
- Modern, professional tech blog header image
- Aspect ratio: 16:9 landscape orientation
- Color palette: Deep blues, teals, and accent colors
- Abstract representation of ${category} concepts
- Clean, minimalist design with subtle tech elements
- High quality, suitable for professional website
- NO TEXT OR WORDS in the image`;

    const imageResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: imagePrompt }] }],
          generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
        }),
      }
    );

    let imageUrl: string | null = null;

    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      const imagePart = imageData.candidates?.[0]?.content?.parts?.find(
        (p: { inlineData?: { data?: string } }) => p.inlineData?.data
      );

      if (imagePart) {
        const mimeType = imagePart.inlineData.mimeType || "image/png";
        const ext = mimeType.split("/")[1] || "png";
        const bytes = Uint8Array.from(atob(imagePart.inlineData.data), (c) => c.charCodeAt(0));
        const fileName = `${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, bytes, { contentType: mimeType });

        if (uploadError) {
          console.warn("Failed to upload generated image, proceeding without image:", uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(fileName);
          imageUrl = publicUrl;
          console.log("Image generated and uploaded successfully");
        }
      } else {
        console.warn("No image data in response, proceeding without image");
      }
    } else {
      const errorText = await imageResponse.text();
      console.warn("Image generation failed, proceeding without image:", errorText);
    }

    console.log("Storing blog post in database...");

    // Insert blog post - use correct column names matching the schema
    const { data: insertedPost, error: insertError } = await supabase
      .from("blog_posts")
      .insert({
        title: blogData.title,
        slug: blogData.slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        category: category,
        keywords: blogData.keywords || [],
        image_url: imageUrl,
        read_time: "3-5 min read",
        published: false // Start as draft so admin can review
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log("Blog post created successfully:", insertedPost?.id);

    return new Response(
      JSON.stringify({
        message: `Blog post "${blogData.title}" created as draft!`,
        title: blogData.title,
        slug: blogData.slug,
        hasImage: !!imageUrl
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
